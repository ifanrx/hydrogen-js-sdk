const util = require('./util')

// WAMP "Advanced Profile" support in AutobahnJS per role
//
let WAMP_FEATURES = {
  caller: {
    features: {
      caller_identification: true,
      //call_timeout: true,
      call_canceling: true,
      progressive_call_results: true,
    },
  },
  callee: {
    features: {
      caller_identification: true,
      //call_trustlevels: true,
      pattern_based_registration: true,
      shared_registration: true,
      //call_timeout: true,
      //call_canceling: true,
      progressive_call_results: true,
      registration_revocation: true,
    },
  },
  publisher: {
    features: {
      publisher_identification: true,
      subscriber_blackwhite_listing: true,
      publisher_exclusion: true,
    },
  },
  subscriber: {
    features: {
      publisher_identification: true,
      //publication_trustlevels: true,
      pattern_based_subscription: true,
      subscription_revocation: true,
      //event_history: true,
    },
  },
}

let Invocation = function (
  procedure,
  progress,
  caller,
  caller_authid,
  caller_authrole
) {
  let self = this

  self.procedure = procedure
  self.progress = progress
  self.caller = caller
  self.caller_authid = caller_authid
  self.caller_authrole = caller_authrole
}

let Event = function (
  publication,
  topic,
  publisher,
  publisher_authid,
  publisher_authrole,
  retained,
  forward_for
) {
  let self = this

  self.publication = publication
  self.topic = topic
  self.publisher = publisher
  self.publisher_authid = publisher_authid
  self.publisher_authrole = publisher_authrole
  self.retained = retained
  self.forward_for = forward_for
}

let Result = function (args, kwargs) {
  let self = this

  self.args = args || []
  self.kwargs = kwargs || {}
}

let Error = function (error, args, kwargs) {
  let self = this

  self.error = error
  self.args = args || []
  self.kwargs = kwargs || {}
}

let Subscription = function (topic, handler, options, session, id) {
  let self = this

  self.topic = topic
  self.handler = handler
  self.options = options || {}
  self.session = session
  self.id = id

  self.active = true

  // this will fire when the handler is unsubscribed
  self._on_unsubscribe = session._defer()

  if (self._on_unsubscribe.promise.then) {
    // whenjs has the actual user promise in an attribute
    self.on_unsubscribe = self._on_unsubscribe.promise
  } else {
    self.on_unsubscribe = self._on_unsubscribe
  }
}

Subscription.prototype.unsubscribe = function () {
  let self = this
  return self.session.unsubscribe(self)
}

let Registration = function (procedure, endpoint, options, session, id) {
  let self = this

  self.procedure = procedure
  self.endpoint = endpoint
  self.options = options || {}
  self.session = session
  self.id = id

  self.active = true

  // this will fire when the endpoint is unregistered
  self._on_unregister = session._defer()

  if (self._on_unregister.promise.then) {
    // whenjs has the actual user promise in an attribute
    self.on_unregister = self._on_unregister.promise
  } else {
    self.on_unregister = self._on_unregister
  }
}

Registration.prototype.unregister = function () {
  let self = this
  return self.session.unregister(self)
}

let Publication = function (id) {
  let self = this
  self.id = id
}

let MSG_TYPE = {
  HELLO: 1,
  WELCOME: 2,
  ABORT: 3,
  CHALLENGE: 4,
  AUTHENTICATE: 5,
  GOODBYE: 6,
  HEARTBEAT: 7,
  ERROR: 8,
  PUBLISH: 16,
  PUBLISHED: 17,
  SUBSCRIBE: 32,
  SUBSCRIBED: 33,
  UNSUBSCRIBE: 34,
  UNSUBSCRIBED: 35,
  EVENT: 36,
  CALL: 48,
  CANCEL: 49,
  RESULT: 50,
  REGISTER: 64,
  REGISTERED: 65,
  UNREGISTER: 66,
  UNREGISTERED: 67,
  INVOCATION: 68,
  INTERRUPT: 69,
  YIELD: 70,
}

let Session = function (
  socket,
  defer,
  onchallenge,
  on_user_error,
  on_internal_error
) {
  let self = this

  // the transport connection (WebSocket object)
  self._socket = socket

  // the Deferred factory to use
  self._defer = defer

  // the WAMP authentication challenge handler
  self._onchallenge = onchallenge

  // custom error handlers
  self._on_user_error = on_user_error
  self._on_internal_error = on_internal_error

  // the WAMP session ID
  self._id = null

  // the WAMP realm joined
  self._realm = null

  // the WAMP features in use
  self._features = null

  // closing state
  self._goodbye_sent = false
  self._transport_is_closing = false

  // outstanding requests;
  self._publish_reqs = {}
  self._subscribe_reqs = {}
  self._unsubscribe_reqs = {}
  self._call_reqs = {}
  self._register_reqs = {}
  self._unregister_reqs = {}

  // subscriptions in place;
  self._subscriptions = {}

  // registrations in place;
  self._registrations = {}

  // incoming invocations;
  self._invocations = {}

  // prefix shortcuts for URIs
  self._prefixes = {}

  // the defaults for 'disclose_me'
  self._caller_disclose_me = false
  self._publisher_disclose_me = false

  self._send_wamp = function (msg) {
    util.debug(msg)
    // forward WAMP message to be sent to WAMP transport
    self._socket.send(msg)
  }

  self._protocol_violation = function (reason) {
    self._socket.close(3002, 'protocol violation: ' + reason)
    util.handle_error(
      self._on_internal_error,
      Error('failing transport due to protocol violation: ' + reason)
    )
  }

  self._MESSAGE_MAP = {}
  self._MESSAGE_MAP[MSG_TYPE.ERROR] = {}

  let next_req_id = 0
  self._new_request_id = function () {
    if (next_req_id < 9007199254740992) {
      next_req_id += 1
    } else {
      next_req_id = 1
    }
    return next_req_id
  }

  self._process_SUBSCRIBED = function (msg) {
    //
    // process SUBSCRIBED reply to SUBSCRIBE
    //
    let request = msg[1]
    let subscription = msg[2]

    if (request in self._subscribe_reqs) {
      let r = self._subscribe_reqs[request]

      let d = r[0]
      let topic = r[1]
      let handler = r[2]
      let options = r[3]

      if (!(subscription in self._subscriptions)) {
        self._subscriptions[subscription] = []
      }
      let sub = new Subscription(topic, handler, options, self, subscription)
      self._subscriptions[subscription].push(sub)

      d.resolve(sub)

      delete self._subscribe_reqs[request]
    } else {
      self._protocol_violation(
        'SUBSCRIBED received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.SUBSCRIBED] = self._process_SUBSCRIBED

  self._process_SUBSCRIBE_ERROR = function (msg) {
    //
    // process ERROR reply to SUBSCRIBE
    //
    let request = msg[2]
    if (request in self._subscribe_reqs) {
      let details = msg[3]
      let error = new Error(msg[4], msg[5], msg[6])

      error.reason = msg[4]
      error.details = details

      let r = self._subscribe_reqs[request]

      let d = r[0]

      d.reject(error)

      delete self._subscribe_reqs[request]
    } else {
      self._protocol_violation(
        'SUBSCRIBE-ERROR received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.ERROR][MSG_TYPE.SUBSCRIBE] =
    self._process_SUBSCRIBE_ERROR

  self._process_UNSUBSCRIBED = function (msg) {
    //
    // process UNSUBSCRIBED reply to UNSUBSCRIBE
    //
    let request = msg[1]

    if (request in self._unsubscribe_reqs) {
      let r = self._unsubscribe_reqs[request]

      let d = r[0]
      let subscription_id = r[1]

      if (subscription_id in self._subscriptions) {
        let subs = self._subscriptions[subscription_id]
        // the following should actually be NOP, since UNSUBSCRIBE was
        // only sent when subs got empty
        for (let i = 0; i < subs.length; ++i) {
          subs[i].active = false
          subs[i]._on_unsubscribe.resolve()
        }
        delete self._subscriptions[subscription_id]
      }

      d.resolve(true)

      delete self._unsubscribe_reqs[request]
    } else {
      if (request === 0) {
        // router actively revoked our subscription
        //
        let details = msg[2]
        let subscription_id = details.subscription
        let reason = details.reason

        if (subscription_id in self._subscriptions) {
          let subs = self._subscriptions[subscription_id]
          for (let i = 0; i < subs.length; ++i) {
            subs[i].active = false
            subs[i]._on_unsubscribe.resolve(reason)
          }
          delete self._subscriptions[subscription_id]
        } else {
          self._protocol_violation(
            'non-voluntary UNSUBSCRIBED received for non-existing subscription ID ' +
              subscription_id
          )
        }
      } else {
        self._protocol_violation(
          'UNSUBSCRIBED received for non-pending request ID ' + request
        )
      }
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.UNSUBSCRIBED] = self._process_UNSUBSCRIBED

  self._process_UNSUBSCRIBE_ERROR = function (msg) {
    //
    // process ERROR reply to UNSUBSCRIBE
    //
    let request = msg[2]
    if (request in self._unsubscribe_reqs) {
      let details = msg[3]
      let error = new Error(msg[4], msg[5], msg[6])

      error.reason = msg[4]
      error.details = details

      let r = self._unsubscribe_reqs[request]

      let d = r[0]
      // let subscription = r[1]

      d.reject(error)

      delete self._unsubscribe_reqs[request]
    } else {
      self._protocol_violation(
        'UNSUBSCRIBE-ERROR received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.ERROR][MSG_TYPE.UNSUBSCRIBE] =
    self._process_UNSUBSCRIBE_ERROR

  self._process_PUBLISHED = function (msg) {
    //
    // process PUBLISHED reply to PUBLISH
    //
    let request = msg[1]
    let publication = msg[2]

    if (request in self._publish_reqs) {
      let r = self._publish_reqs[request]

      let d = r[0]
      // let options = r[1]

      let pub = new Publication(publication)
      d.resolve(pub)

      delete self._publish_reqs[request]
    } else {
      self._protocol_violation(
        'PUBLISHED received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.PUBLISHED] = self._process_PUBLISHED

  self._process_PUBLISH_ERROR = function (msg) {
    //
    // process ERROR reply to PUBLISH
    //
    let request = msg[2]
    if (request in self._publish_reqs) {
      // let details = msg[3]
      let error = new Error(msg[4], msg[5], msg[6])

      let r = self._publish_reqs[request]

      let d = r[0]
      // let options = r[1]

      d.reject(error)

      delete self._publish_reqs[request]
    } else {
      self._protocol_violation(
        'PUBLISH-ERROR received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.ERROR][MSG_TYPE.PUBLISH] =
    self._process_PUBLISH_ERROR

  self._process_EVENT = function (msg) {
    //
    // process EVENT message
    //
    // [EVENT, SUBSCRIBED.Subscription|id, PUBLISHED.Publication|id, Details|dict, PUBLISH.Arguments|list, PUBLISH.ArgumentsKw|dict]

    let subscription = msg[1]

    if (subscription in self._subscriptions) {
      let publication = msg[2]
      let details = msg[3]

      let args = msg[4] || []
      let kwargs = msg[5] || {}

      let subs = self._subscriptions[subscription]

      // we want to provide the subscription topic to the handler, and may need to get this
      // from one of the subscription handler objects attached to the subscription
      // since for non-pattern subscriptions this is not sent over the wire
      let ed = new Event(
        publication,
        details.topic || (subs[0] && subs[0].topic),
        details.publisher,
        details.publisher_authid,
        details.publisher_authrole,
        details.retained || false,
        details.forward_for
      )

      for (let i = 0; i < subs.length; ++i) {
        let sub = subs[i]
        try {
          sub.handler(args, kwargs, ed, sub)
        } catch (e) {
          util.handle_error(
            self._on_user_error,
            e,
            'Exception raised in event handler:'
          )
        }
      }
    } else {
      self._protocol_violation(
        'EVENT received for non-subscribed subscription ID ' + subscription
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.EVENT] = self._process_EVENT

  self._process_REGISTERED = function (msg) {
    //
    // process REGISTERED reply to REGISTER
    //
    let request = msg[1]
    let registration = msg[2]

    if (request in self._register_reqs) {
      let r = self._register_reqs[request]

      let d = r[0]
      let procedure = r[1]
      let endpoint = r[2]
      let options = r[3]

      let reg = new Registration(
        procedure,
        endpoint,
        options,
        self,
        registration
      )

      self._registrations[registration] = reg

      d.resolve(reg)

      delete self._register_reqs[request]
    } else {
      self._protocol_violation(
        'REGISTERED received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.REGISTERED] = self._process_REGISTERED

  self._process_REGISTER_ERROR = function (msg) {
    //
    // process ERROR reply to REGISTER
    //
    let request = msg[2]
    if (request in self._register_reqs) {
      // let details = msg[3]
      let error = new Error(msg[4], msg[5], msg[6])

      let r = self._register_reqs[request]

      let d = r[0]

      d.reject(error)

      delete self._register_reqs[request]
    } else {
      self._protocol_violation(
        'REGISTER-ERROR received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.ERROR][MSG_TYPE.REGISTER] =
    self._process_REGISTER_ERROR

  self._process_UNREGISTERED = function (msg) {
    //
    // process UNREGISTERED reply to UNREGISTER
    //
    let request = msg[1]

    if (request in self._unregister_reqs) {
      let r = self._unregister_reqs[request]

      let d = r[0]
      let registration = r[1]

      if (registration.id in self._registrations) {
        delete self._registrations[registration.id]
      }

      registration.active = false
      d.resolve()

      delete self._unregister_reqs[request]
    } else {
      if (request === 0) {
        // the router actively revoked our registration
        //
        let details = msg[2]
        let registration_id = details.registration
        let reason = details.reason

        if (registration_id in self._registrations) {
          let registration = self._registrations[registration_id]
          registration.active = false
          registration._on_unregister.resolve(reason)
          delete self._registrations[registration_id]
        } else {
          self._protocol_violation(
            'non-voluntary UNREGISTERED received for non-existing registration ID ' +
              registration_id
          )
        }
      } else {
        self._protocol_violation(
          'UNREGISTERED received for non-pending request ID ' + request
        )
      }
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.UNREGISTERED] = self._process_UNREGISTERED

  self._process_UNREGISTER_ERROR = function (msg) {
    //
    // process ERROR reply to UNREGISTER
    //
    let request = msg[2]
    if (request in self._unregister_reqs) {
      // let details = msg[3]
      let error = new Error(msg[4], msg[5], msg[6])

      let r = self._unregister_reqs[request]

      let d = r[0]
      // let registration = r[1]

      d.reject(error)

      delete self._unregister_reqs[request]
    } else {
      self._protocol_violation(
        'UNREGISTER-ERROR received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.ERROR][MSG_TYPE.UNREGISTER] =
    self._process_UNREGISTER_ERROR

  self._process_RESULT = function (msg) {
    //
    // process RESULT reply to CALL
    //
    let request = msg[1]
    if (request in self._call_reqs) {
      let details = msg[2]

      let args = msg[3] || []
      let kwargs = msg[4] || {}

      // maybe wrap complex result:
      let result = null
      if (args.length > 1 || Object.keys(kwargs).length > 0) {
        // wrap complex result is more than 1 positional result OR
        // non-empty keyword result
        result = new Result(args, kwargs)
      } else if (args.length > 0) {
        // single positional result
        result = args[0]
      }

      let r = self._call_reqs[request]

      let d = r[0]
      let options = r[1]

      if (details.progress) {
        if (options && options.receive_progress) {
          d.notify(result)
        }
      } else {
        d.resolve(result)
        delete self._call_reqs[request]
      }
    } else {
      self._protocol_violation(
        'CALL-RESULT received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.RESULT] = self._process_RESULT

  self._process_CALL_ERROR = function (msg) {
    //
    // process ERROR reply to CALL
    //
    let request = msg[2]
    if (request in self._call_reqs) {
      // let details = msg[3]
      let error = new Error(msg[4], msg[5], msg[6])

      let r = self._call_reqs[request]

      let d = r[0]
      // let options = r[1]

      d.reject(error)

      delete self._call_reqs[request]
    } else {
      self._protocol_violation(
        'CALL-ERROR received for non-pending request ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.ERROR][MSG_TYPE.CALL] = self._process_CALL_ERROR

  self._process_INVOCATION = function (msg) {
    //
    // process INVOCATION message
    //
    // [INVOCATION, Request|id, REGISTERED.Registration|id, Details|dict, CALL.Arguments|list, CALL.ArgumentsKw|dict]
    //
    let request = msg[1]
    let registration = msg[2]

    let details = msg[3]
    // receive_progress
    // timeout
    // caller

    if (registration in self._registrations) {
      let reg = self._registrations[registration]

      let args = msg[4] || []
      let kwargs = msg[5] || {}

      // create progress function for invocation
      //
      let progress = null
      if (details.receive_progress) {
        progress = function (args, kwargs) {
          let progress_msg = [MSG_TYPE.YIELD, request, {progress: true}]

          args = args || []
          kwargs = kwargs || {}

          let kwargs_len = Object.keys(kwargs).length
          if (args.length || kwargs_len) {
            progress_msg.push(args)
            if (kwargs_len) {
              progress_msg.push(kwargs)
            }
          }
          self._send_wamp(progress_msg)
        }
      }

      // we want to provide the regitration procedure to the handler and may
      // need to get this from the registration object attached to the registration
      // since for non-pattern registrations this is not sent over the wire
      let cd = new Invocation(
        details.procedure || reg.procedure,
        progress,
        details.caller,
        details.caller_authid,
        details.caller_authrole
      )

      // We use the following whenjs call wrapper, which automatically
      // wraps a plain, non-promise value in a (immediately resolved) promise
      //
      // See: https://github.com/cujojs/when/blob/master/docs/api.md#fncall
      //
      util
        .promisify(reg.endpoint)(args, kwargs, cd)
        .then(
          function (res) {
            // construct YIELD message
            // FIXME: Options
            //
            let reply = [MSG_TYPE.YIELD, request, {}]

            if (res instanceof Result) {
              let kwargs_len = Object.keys(res.kwargs).length
              if (res.args.length || kwargs_len) {
                reply.push(res.args)
                if (kwargs_len) {
                  reply.push(res.kwargs)
                }
              }
            } else {
              reply.push([res])
            }

            // send WAMP message
            //
            self._send_wamp(reply)
          },

          function (err) {
            // construct ERROR message
            // [ERROR, REQUEST.Type|int, REQUEST.Request|id, Details|dict, Error|uri, Arguments|list, ArgumentsKw|dict]

            let reply = [MSG_TYPE.ERROR, MSG_TYPE.INVOCATION, request, {}]

            if (err instanceof Error) {
              reply.push(err.error)

              let kwargs_len = Object.keys(err.kwargs).length
              if (err.args.length || kwargs_len) {
                reply.push(err.args)
                if (kwargs_len) {
                  reply.push(err.kwargs)
                }
              }
            } else {
              reply.push('wamp.error.runtime_error')
              reply.push([err])
            }

            // send WAMP message
            //
            self._send_wamp(reply)
            util.handle_error(
              self._on_user_error,
              err,
              'Exception raised in invocation handler:'
            )
          }
        )
    } else {
      self._protocol_violation(
        'INVOCATION received for non-registered registration ID ' + request
      )
    }
  }
  self._MESSAGE_MAP[MSG_TYPE.INVOCATION] = self._process_INVOCATION

  // callback fired by WAMP transport on receiving a WAMP message
  //
  self._socket.onmessage = function (msg) {
    let msg_type = msg[0]

    // WAMP session not yet open
    //
    if (!self._id) {
      // the first message must be WELCOME, ABORT or CHALLENGE ..
      //
      if (msg_type === MSG_TYPE.WELCOME) {
        self._id = msg[1]

        // determine actual set of advanced features that can be used
        //
        let rf = msg[2]
        self._features = {}

        if (rf.roles.broker) {
          // "Basic Profile" is mandatory
          self._features.subscriber = {}
          self._features.publisher = {}

          // fill in features that both peers support
          if (rf.roles.broker.features) {
            for (let att in WAMP_FEATURES.publisher.features) {
              self._features.publisher[att] =
                WAMP_FEATURES.publisher.features[att] &&
                rf.roles.broker.features[att]
            }

            for (let att in WAMP_FEATURES.subscriber.features) {
              self._features.subscriber[att] =
                WAMP_FEATURES.subscriber.features[att] &&
                rf.roles.broker.features[att]
            }
          }
        }

        if (rf.roles.dealer) {
          // "Basic Profile" is mandatory
          self._features.caller = {}
          self._features.callee = {}

          // fill in features that both peers support
          if (rf.roles.dealer.features) {
            for (let att in WAMP_FEATURES.caller.features) {
              self._features.caller[att] =
                WAMP_FEATURES.caller.features[att] &&
                rf.roles.dealer.features[att]
            }

            for (let att in WAMP_FEATURES.callee.features) {
              self._features.callee[att] =
                WAMP_FEATURES.callee.features[att] &&
                rf.roles.dealer.features[att]
            }
          }
        }

        if (self.onjoin) {
          self.onjoin(msg[2])
        }
      } else if (msg_type === MSG_TYPE.ABORT) {
        let details = msg[1]
        let reason = msg[2]

        if (self.onleave) {
          self.onleave(reason, details)
        }
      } else if (msg_type === MSG_TYPE.CHALLENGE) {
        if (self._onchallenge) {
          let method = msg[1]
          let extra = msg[2]

          util
            .promisify(self._onchallenge)(self, method, extra)
            .then(
              function (signature) {
                let msg
                if (typeof signature === 'string') {
                  msg = [MSG_TYPE.AUTHENTICATE, signature, {}]
                } else if (typeof signature === 'object') {
                  let signatureString = signature[0]
                  let authExtra = signature[1]

                  msg = [MSG_TYPE.AUTHENTICATE, signatureString, authExtra]
                }

                self._send_wamp(msg)
              },
              function (err) {
                util.handle_error(
                  self._on_user_error,
                  err,
                  'onchallenge() raised: '
                )
                let msg = [
                  MSG_TYPE.ABORT,
                  {
                    message:
                      'sorry, I cannot authenticate (onchallenge handler raised an exception)',
                  },
                  'wamp.error.cannot_authenticate',
                ]
                self._send_wamp(msg)
                self._socket.close(3000)
              }
            )
        } else {
          util.handle_error(
            self._on_internal_error,
            Error('received WAMP challenge, but no onchallenge() handler set')
          )

          let msg = [
            MSG_TYPE.ABORT,
            {
              message:
                'sorry, I cannot authenticate (no onchallenge handler set)',
            },
            'wamp.error.cannot_authenticate',
          ]
          self._send_wamp(msg)
          self._socket.close(3000)
        }
      } else {
        self._protocol_violation('unexpected message type ' + msg_type)
      }

      // WAMP session is open
      //
    } else {
      if (msg_type === MSG_TYPE.GOODBYE) {
        if (!self._goodbye_sent) {
          let reply = [MSG_TYPE.GOODBYE, {}, 'wamp.error.goodbye_and_out']
          self._send_wamp(reply)
        }

        self._id = null
        self._realm = null
        self._features = null

        let details = msg[1]
        let reason = msg[2]

        if (self.onleave) {
          self.onleave(reason, details)
        }
      } else {
        if (msg_type === MSG_TYPE.ERROR) {
          let request_type = msg[1]
          if (request_type in self._MESSAGE_MAP[MSG_TYPE.ERROR]) {
            self._MESSAGE_MAP[msg_type][request_type](msg)
          } else {
            self._protocol_violation(
              'unexpected ERROR message with request_type ' + request_type
            )
          }
        } else {
          if (msg_type in self._MESSAGE_MAP) {
            self._MESSAGE_MAP[msg_type](msg)
          } else {
            self._protocol_violation('unexpected message type ' + msg_type)
          }
        }
      }
    }
  }

  // session object constructed .. track creation time
  //
  if (util.canUse('performance') && 'now' in performance) {
    self._created = performance.now()
  } else {
    self._created = Date.now()
  }
}

Object.defineProperty(Session.prototype, 'defer', {
  get: function () {
    return this._defer
  },
})

Object.defineProperty(Session.prototype, 'id', {
  get: function () {
    return this._id
  },
})

Object.defineProperty(Session.prototype, 'realm', {
  get: function () {
    return this._realm
  },
})

Object.defineProperty(Session.prototype, 'isOpen', {
  get: function () {
    return this.id !== null
  },
})

Object.defineProperty(Session.prototype, 'features', {
  get: function () {
    return this._features
  },
})

Object.defineProperty(Session.prototype, 'caller_disclose_me', {
  get: function () {
    return this._caller_disclose_me
  },
  set: function (newValue) {
    this._caller_disclose_me = newValue
  },
})

Object.defineProperty(Session.prototype, 'publisher_disclose_me', {
  get: function () {
    return this._publisher_disclose_me
  },
  set: function (newValue) {
    this._publisher_disclose_me = newValue
  },
})

Object.defineProperty(Session.prototype, 'subscriptions', {
  get: function () {
    let keys = Object.keys(this._subscriptions)
    let vals = []
    for (let i = 0; i < keys.length; ++i) {
      vals.push(this._subscriptions[keys[i]])
    }
    return vals
  },
})

Object.defineProperty(Session.prototype, 'registrations', {
  get: function () {
    let keys = Object.keys(this._registrations)
    let vals = []
    for (let i = 0; i < keys.length; ++i) {
      vals.push(this._registrations[keys[i]])
    }
    return vals
  },
})

Session.prototype.log = function () {

}

Session.prototype.join = function (realm, authmethods, authid, authextra) {
  util.assert(
    !realm || typeof realm === 'string',
    'Session.join: <realm> must be a string'
  )
  util.assert(
    !authmethods || Array.isArray(authmethods),
    'Session.join: <authmethods> must be an array []'
  )
  util.assert(
    !authid || typeof authid === 'string',
    'Session.join: <authid> must be a string'
  )

  let self = this

  if (self.isOpen) {
    throw 'session already open'
  }

  self._goodbye_sent = false
  self._realm = realm

  let details = {}
  details.roles = WAMP_FEATURES

  if (authmethods) {
    details.authmethods = authmethods
  }
  if (authid) {
    details.authid = authid
  }
  if (authextra) {
    details.authextra = authextra
  }

  let msg = [MSG_TYPE.HELLO, realm, details]
  self._send_wamp(msg)
}

Session.prototype.leave = function (reason, message) {
  util.assert(
    !reason || typeof reason === 'string',
    'Session.leave: <reason> must be a string'
  )
  util.assert(
    !message || typeof message === 'string',
    'Session.leave: <message> must be a string'
  )

  let self = this

  if (!self.isOpen) {
    throw 'session not open'
  }

  if (!reason) {
    reason = 'wamp.close.normal'
  }

  let details = {}
  if (message) {
    details.message = message
  }

  let msg = [MSG_TYPE.GOODBYE, details, reason]
  self._send_wamp(msg)
  self._goodbye_sent = true
}

Session.prototype.call = function (procedure, args, kwargs, options) {
  util.assert(
    typeof procedure === 'string',
    'Session.call: <procedure> must be a string'
  )
  util.assert(
    !args || Array.isArray(args),
    'Session.call: <args> must be an array []'
  )
  util.assert(
    !kwargs || util.is_object(kwargs),
    'Session.call: <kwargs> must be an object {}'
  )
  util.assert(
    !options || util.is_object(options),
    'Session.call: <options> must be an object {}'
  )

  let self = this

  if (!self.isOpen) {
    throw 'session not open'
  }

  options = options || {}

  // only set option if user hasn't set a value and global option is "on"
  if (options.disclose_me === undefined && self._caller_disclose_me) {
    options.disclose_me = true
  }

  // create and remember new CALL request
  //
  let d = self._defer()
  let request = self._new_request_id()
  self._call_reqs[request] = [d, options]

  // construct CALL message
  //
  let msg = [MSG_TYPE.CALL, request, options, self.resolve(procedure)]
  if (args) {
    msg.push(args)
    if (kwargs) {
      msg.push(kwargs)
    }
  } else if (kwargs) {
    msg.push([])
    msg.push(kwargs)
  }

  // send WAMP message
  //
  self._send_wamp(msg)

  let userPromise
  if (d.promise.then) {
    // whenjs has the actual user promise in an attribute
    userPromise = d.promise
  } else {
    userPromise = d
  }
  userPromise.cancel = function (cancelOptions) {
    // Cancel the call
    //
    let cancelMsg = [MSG_TYPE.CANCEL, request, cancelOptions || {}]
    self._send_wamp(cancelMsg)

    if (
      request in self._call_reqs &&
      (!cancelOptions || !cancelOptions.mode || cancelOptions.mode !== 'kill')
    ) {
      // When the mode is not 'kill' it will never receive a call result.
      // So when the request was still in the list, reject and remove it.
      let cancelledDefer = self._call_reqs[request][0]
      cancelledDefer.reject(new Error('Cancelled'))
      delete self._call_reqs[request]
    }
  }
  return userPromise
}

Session.prototype.publish = function (topic, args, kwargs, options) {
  util.assert(
    typeof topic === 'string',
    'Session.publish: <topic> must be a string'
  )
  util.assert(
    !args || Array.isArray(args),
    'Session.publish: <args> must be an array []'
  )
  util.assert(
    !kwargs || util.is_object(kwargs),
    'Session.publish: <kwargs> must be an object {}'
  )
  util.assert(
    !options || util.is_object(options),
    'Session.publish: <options> must be an object {}'
  )

  let self = this

  if (!self.isOpen) {
    throw 'session not open'
  }

  options = options || {}

  // only set option if user hasn't set a value and global option is "on"
  if (options.disclose_me === undefined && self._publisher_disclose_me) {
    options.disclose_me = true
  }

  // create and remember new PUBLISH request
  //
  let d = null
  let request = self._new_request_id()
  if (options.acknowledge) {
    d = self._defer()
    self._publish_reqs[request] = [d, options]
  }

  // construct PUBLISH message
  //
  let msg = [MSG_TYPE.PUBLISH, request, options, self.resolve(topic)]
  if (args) {
    msg.push(args)
    if (kwargs) {
      msg.push(kwargs)
    }
  } else if (kwargs) {
    msg.push([])
    msg.push(kwargs)
  }

  // send WAMP message
  //
  self._send_wamp(msg)

  if (d) {
    if (d.promise.then) {
      // whenjs has the actual user promise in an attribute
      return d.promise
    } else {
      return d
    }
  }
}

Session.prototype.subscribe = function (topic, handler, options) {
  util.assert(
    typeof topic === 'string',
    'Session.subscribe: <topic> must be a string'
  )
  util.assert(
    typeof handler === 'function',
    'Session.subscribe: <handler> must be a function'
  )
  util.assert(
    !options || util.is_object(options),
    'Session.subscribe: <options> must be an object {}'
  )

  let self = this

  if (!self.isOpen) {
    throw 'session not open'
  }

  // create an remember new SUBSCRIBE request
  //
  let request = self._new_request_id()
  let d = self._defer()
  self._subscribe_reqs[request] = [d, topic, handler, options]

  // construct SUBSCRIBE message
  //
  let msg = [MSG_TYPE.SUBSCRIBE, request]
  if (options) {
    msg.push(options)
  } else {
    msg.push({})
  }
  msg.push(self.resolve(topic))

  // send WAMP message
  //
  self._send_wamp(msg)

  if (d.promise.then) {
    // whenjs has the actual user promise in an attribute
    return d.promise
  } else {
    return d
  }
}

Session.prototype.register = function (procedure, endpoint, options) {
  util.assert(
    typeof procedure === 'string',
    'Session.register: <procedure> must be a string'
  )
  util.assert(
    typeof endpoint === 'function',
    'Session.register: <endpoint> must be a function'
  )
  util.assert(
    !options || util.is_object(options),
    'Session.register: <options> must be an object {}'
  )

  let self = this

  if (!self.isOpen) {
    throw 'session not open'
  }

  // create an remember new REGISTER request
  //
  let request = self._new_request_id()
  let d = self._defer()
  self._register_reqs[request] = [d, procedure, endpoint, options]

  // construct REGISTER message
  //
  let msg = [MSG_TYPE.REGISTER, request]
  if (options) {
    msg.push(options)
  } else {
    msg.push({})
  }
  msg.push(self.resolve(procedure))

  // send WAMP message
  //
  self._send_wamp(msg)

  if (d.promise.then) {
    // whenjs has the actual user promise in an attribute
    return d.promise
  } else {
    return d
  }
}

Session.prototype.unsubscribe = function (subscription) {
  util.assert(
    subscription instanceof Subscription,
    'Session.unsubscribe: <subscription> must be an instance of class autobahn.Subscription'
  )

  let self = this

  let subs = self._subscriptions[subscription.id]
  let i = subs.indexOf(subscription)

  if (!self.isOpen) {
    if (i !== -1) {
      // remove handler subscription
      subs.splice(i, 1)
      subscription.active = false
    }
    throw 'session not open'
  }

  if (!subscription.active || !(subscription.id in self._subscriptions)) {
    if (i !== -1) {
      // remove handler subscription
      subs.splice(i, 1)
      subscription.active = false
    }

    throw 'subscription not active'
  }

  if (i === -1) {
    throw 'subscription not active'
  }

  // remove handler subscription
  subs.splice(i, 1)
  subscription.active = false

  let d = self._defer()

  if (subs.length) {
    // there are still handlers on the subscription ..
    d.resolve(false)
  } else {
    // no handlers left ..

    // create and remember new UNSUBSCRIBE request
    //
    let request = self._new_request_id()
    self._unsubscribe_reqs[request] = [d, subscription.id]

    // construct UNSUBSCRIBE message
    //
    let msg = [MSG_TYPE.UNSUBSCRIBE, request, subscription.id]

    // send WAMP message
    //
    self._send_wamp(msg)
  }

  if (d.promise.then) {
    // whenjs has the actual user promise in an attribute
    return d.promise
  } else {
    return d
  }
}

Session.prototype.unregister = function (registration) {
  util.assert(
    registration instanceof Registration,
    'Session.unregister: <registration> must be an instance of class autobahn.Registration'
  )

  let self = this

  if (!self.isOpen) {
    throw 'session not open'
  }

  if (!registration.active || !(registration.id in self._registrations)) {
    throw 'registration not active'
  }

  // create and remember new UNREGISTER request
  //
  let request = self._new_request_id()
  let d = self._defer()
  self._unregister_reqs[request] = [d, registration]

  // construct UNREGISTER message
  //
  let msg = [MSG_TYPE.UNREGISTER, request, registration.id]

  // send WAMP message
  //
  self._send_wamp(msg)

  if (d.promise.then) {
    // whenjs has the actual user promise in an attribute
    return d.promise
  } else {
    return d
  }
}

Session.prototype.prefix = function (prefix, uri) {
  util.assert(
    typeof prefix === 'string',
    'Session.prefix: <prefix> must be a string'
  )
  util.assert(
    !uri || typeof uri === 'string',
    'Session.prefix: <uri> must be a string or falsy'
  )

  let self = this

  if (uri) {
    self._prefixes[prefix] = uri
  } else {
    if (prefix in self._prefixes) {
      delete self._prefixes[prefix]
    }
  }
}

Session.prototype.resolve = function (curie) {
  util.assert(
    typeof curie === 'string',
    'Session.resolve: <curie> must be a string'
  )

  let self = this

  // skip if not a CURIE
  let i = curie.indexOf(':')
  if (i >= 0) {
    let prefix = curie.substring(0, i)
    if (prefix in self._prefixes) {
      return self._prefixes[prefix] + '.' + curie.substring(i + 1)
    } else {
      return curie
    }
  } else {
    return curie
  }
}

module.exports = {
  Session,
  Invocation,
  Event,
  Result,
  Error,
  Subscription,
  Registration,
  Publication,
}
