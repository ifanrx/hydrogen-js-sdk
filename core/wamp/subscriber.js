const {Connection} = require('./connection')
const {transporter} = require('./transporter')
const util = require('./util')

const subscriber = ({
  WebSocket,
  getAuthTokenQuerystring,
  realm,
  resolveOptions,
  resolveTopic,
  url,
  shouldTryAgain,
}) => {
  const create_transport = transporter(WebSocket)
  let connection  = null
  const subscriptionMap = new Map()

  const clearConnection = () => {
    if (connection && connection.isOpen) {
      connection.close()
    }
    connection = null
    subscriptionMap.clear()
  }

  const tryCloseConnection = (details) => {
    if (subscriptionMap.size === 0) {
      clearConnection()
    } else if (details && details.will_retry === false) {
      clearConnection()
    }
  }

  const _subscribe = (key) => {
    const found = subscriptionMap.get(key)
    if (!found) {
      return
    }
    connection.session.subscribe(
      found.topic,
      (_, kwargs) => found.onevent(kwargs),
      found.options,
    )
      .then(subscription => {
        found.subscription = subscription
        subscriptionMap.set(key, found)
        found.oninit()
      })
      .catch((e) => {
        found.onerror(e)
        subscriptionMap.delete(key)
        tryCloseConnection()
      })
  }

  const recover = () => {
    for (const [key] of subscriptionMap) {
      _subscribe(key)
    }
  }

  const onopen = () => {
    recover()
  }

  const onclose = (reason, details) => {
    for (const data of subscriptionMap.values()) {
      data.onerror({reason, details})
    }
    tryCloseConnection(details)
  }

  const connect = util.asyncCache(() => {
    if (connection && connection.isOpen) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      connection = new Connection({
        url: url,
        realm,
        create_transport,
        getAuthTokenQuerystring,
        shouldTryAgain,
      })
      connection.onopen = () => {
        resolve()

        // 如果建立了连接，则监听事件
        connection.onopen = onopen
        connection.onclose = onclose
      }
      connection.onclose = (reason, details) => {
        const err = new Error(reason)
        err.reason = reason
        err.details = details
        reject(err)
      }
      connection.open()
    })
  })

  const subscribe = ({
    schema_name,
    where,
    event_type,
    onerror,
    oninit,
    onevent,
  }) => {
    const topic = resolveTopic({schema_name, event_type})
    const options = resolveOptions({where}) || {}

    const key = util.generateKey()
    subscriptionMap.set(key, {
      key,
      topic,
      options,
      onerror,
      oninit,
      onevent,
    })

    const unsubscribe = () => {
      const found = subscriptionMap.get(key)
      if (!found) {
        return Promise.resolve()
      }

      if (!found.subscription) {
        subscriptionMap.delete(key)
        tryCloseConnection()
        return Promise.resolve()
      }

      if (!connection) {
        return Promise.resolve()
      }

      return connection.session
        .unsubscribe(found.subscription)
        .then(() => {
          subscriptionMap.delete(key)
          tryCloseConnection()
        })
    }

    connect()
      .then(() => {
        _subscribe(key)
      })
      .catch(onerror)

    return {unsubscribe}
  }

  return subscribe
}

module.exports = subscriber
