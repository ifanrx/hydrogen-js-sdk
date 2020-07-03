const {Session} = require('./session')
const util = require('./util')

class Connection {
  constructor(options) {
    util.assert(options.url !== undefined, 'options.url missing')
    util.assert(
      options.create_transport !== undefined,
      'create_transport missing'
    )
    util.assert(
      typeof options.create_transport === 'function',
      'create_transport must be a function'
    )
    util.assert(
      options.getAuthTokenQuerystring !== undefined,
      'getAuthTokenQuerystring missing'
    )
    util.assert(
      typeof options.getAuthTokenQuerystring === 'function',
      'getAuthTokenQuerystring must be a function'
    )

    this._options = options

    this._create_transport = this._options.create_transport
    this._getAuthTokenQuerystring = this._options.getAuthTokenQuerystring
    this._shouldTryAgain = this._options.shouldTryAgain || (() => false)

    // Deferred factory
    //
    this._defer = util.deferred_factory()

    // WAMP session
    //
    this._session = null
    this._session_close_reason = null
    this._session_close_message = null

    // automatic reconnection configuration
    //

    // enable automatic reconnect if host is unreachable
    this._retry_if_unreachable = util.opt(
      this._options.retry_if_unreachable,
      true
    )

    // maximum number of reconnection attempts
    this._max_retries = util.opt(this._options.max_retries, 15)

    // initial retry delay in seconds
    this._initial_retry_delay = util.opt(this._options.initial_retry_delay, 1.5)

    // maximum seconds between reconnection attempts
    this._max_retry_delay = this._options.max_retry_delay || 300

    // the growth factor applied to the retry delay on each retry cycle
    this._retry_delay_growth = this._options.retry_delay_growth || 1.5

    // the SD of a Gaussian to jitter the delay on each retry cycle
    // as a fraction of the mean
    this._retry_delay_jitter = this._options.retry_delay_jitter || 0.1

    // reconnection tracking
    //

    // total number of successful connections
    this._connect_successes = 0

    // controls if we should try to reconnect
    this._retry = false

    // current number of reconnect cycles we went through
    this._retry_count = 0

    // the current retry delay
    this._retry_delay = this._initial_retry_delay

    // flag indicating if we are currently in a reconnect cycle
    this._is_retrying = false

    // when retrying, this is the timer object returned from window.setTimeout()
    this._retry_timer = null
  }

  _autoreconnect_reset_timer() {
    clearTimeout(this._retry_timer)
    this._retry_timer = null
  }

  _autoreconnect_reset() {
    this._autoreconnect_reset_timer()
    this._retry_count = 0
    this._retry_delay = this._initial_retry_delay
    this._is_retrying = false
  }

  _autoreconnect_advance() {
    if (this._retry_delay_jitter) {
      this._retry_delay_jitter = util.rand_normal(
        this._retry_delay,
        this._retry_delay * this._retry_delay_jitter
      )
    }

    if (this._retry_delay > this._max_retry_delay) {
      this._retry_delay = this._max_retry_delay
    }

    this._retry_count += 1

    let res
    if (
      this._retry &&
      (this._max_retries === -1 || this._retry_count <= this._max_retries)
    ) {
      res = {
        count: this._retry_count,
        delay: this._retry_delay,
        will_retry: true,
      }
    } else {
      res = {
        count: null,
        delay: null,
        will_retry: false,
      }
    }

    // retry delay growth for next retry cycle
    if (this._retry_delay_growth) {
      this._retry_delay = this._retry_delay * this._retry_delay_growth
    }

    return res
  }

  open() {
    if (this._transport) {
      throw new Error('connection already open (or opening)')
    }

    this._autoreconnect_reset()
    this._retry = true

    const original_retry = (q) => {
      // create a WAMP transport
      try {
        this._transport = this._create_transport({url: this._options.url + '?' + q})
      } catch (e) {
        util.handle_error(this._options.on_internal_error, e)
      }

      if (!this._transport) {
        // failed to create a WAMP transport
        this._retry = false
        if (this.onclose) {
          let details = {
            reason: null,
            message: null,
            retry_delay: null,
            retry_count: null,
            will_retry: false,
          }
          this.onclose('unsupported', details)
        }
        return
      }

      // create a new WAMP session using the WebSocket connection as transport
      this._session = new Session(
        this._transport,
        this._defer,
        this._options.onchallenge,
        this._options.on_user_error,
        this._options.on_internal_error
      )
      this._session_close_reason = null
      this._session_close_message = null

      this._transport.onopen = () => {
        // reset auto-reconnect timer and tracking

        if (!this._options.state.retried) {
          this._autoreconnect_reset()
        }

        // util successful connections
        this._connect_successes += 1

        // start WAMP session
        this._session.join(
          this._options.realm,
          this._options.authmethods,
          this._options.authid,
          this._options.authextra
        )
      }

      this._session.onjoin = (details) => {
        if (this.onopen) {
          try {
            // forward transport info ..
            details.transport = this._transport.info
            this.onopen(this._session, details)
          } catch (e) {
            util.handle_error(
              this._options.on_user_error,
              e,
              'exception raised from app code while firing Connection.onopen()'
            )
          }
        }
      }

      //
      // ... WAMP session is now attached to realm.
      //

      this._session.onleave = (reason, details) => {
        this._session_close_reason = reason
        this._session_close_message = details.message || ''
        if (!this._shouldTryAgain(reason)) {
          this._retry = false
        } else {
          this._options.state.retried = true
        }
        this._transport.close()

        if (this.onabort) {
          this.onabort(reason, details)
        }
      }

      this._transport.onclose = (evt) => {
        // console.log('websocket==>', evt)
        // remove any pending reconnect timer
        this._autoreconnect_reset_timer()

        this._transport = null

        let reason = null

        if (this._connect_successes === 0) {
          reason = 'unreachable'
          if (!this._retry_if_unreachable) {
            this._retry = false
          }
        } else if (!evt.wasClean) {
          reason = 'lost'
        } else {
          reason = 'closed'
        }

        let next_retry = this._autoreconnect_advance()

        let details = {
          reason: this._session_close_reason,
          message: this._session_close_message,
          retry_delay: next_retry.delay,
          retry_count: next_retry.count,
          will_retry: next_retry.will_retry,
        }

        util.warn('connection closed', reason, details)

        // fire app code handler
        //
        let stop_retrying
        if (this.onclose) {
          try {
            // Connection.onclose() allows to cancel any subsequent retry attempt
            stop_retrying = this.onclose(reason, details)
          } catch (e) {
            util.handle_error(
              this._options.on_user_error,
              e,
              'exception raised from app code while firing Connection.onclose()'
            )
          }
        }

        // reset session info
        //
        if (this._session) {
          this._session._id = null
          this._session = null
          this._session_close_reason = null
          this._session_close_message = null
        }

        // automatic reconnection
        //
        if (this._retry && !stop_retrying) {
          if (next_retry.will_retry) {
            this._is_retrying = true

            util.warn('auto-reconnecting in ' + next_retry.delay + 's ..')
            this._retry_timer = setTimeout(
              () => retry(),
              next_retry.delay * 1000
            )
          } else {
            util.warn('giving up trying to auto-reconnect!')
          }
        } else {
          util.warn('auto-reconnect disabled!', this._retry, stop_retrying)
        }
      }
    }

    const retry = () => {
      this._getAuthTokenQuerystring()
        .then((q) => {
          original_retry(q)
        })
        .catch(e => {
          util.handle_error(this._options.on_internal_error, e)
        })
    }

    retry()
  }

  close(reason, message) {
    if (!this._transport && !this._is_retrying) {
      throw new Error('connection already closed')
    }

    this._retry = false
    if (this._session && this._session.isOpen) {
      this._session.leave(reason, message)
    } else if (this._transport) {
      this._transport.close()
    }
  }

  get defer() {
    return this._defer
  }

  get session() {
    return this._session
  }

  get isOpen() {
    if (this._session && this._session.isOpen) return true
    return false
  }

  get isConnected() {
    if (this._transport) return true
    return false
  }

  get transport() {
    if (this._transport) {
      return this._transport
    }
    return {info: {type: 'none', url: null, protocal: null}}
  }

  get isRetrying() {
    return this._is_retrying
  }
}

module.exports = {Connection}
