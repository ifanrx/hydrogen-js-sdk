const {Connection} = require('./connection')
const {transporter} = require('./transporter')

const wamper = ({
  WebSocket,
  realm,
  resolveError,
  resolveEvent,
  resolveOptions,
  resolveTopic,
  url,
}) => {
  const create_transport = transporter(WebSocket)
  let connection
  const subscriptionMap = new Map()

  const _subscribe = (key) => {
    const found = subscriptionMap.get(key)
    if (!found) {
      return
    }
    connection.session.subscribe(
      found.topic,
      (args, kwargs) => found.onevent(resolveEvent({
        args,
        kwargs,
        event_type: found.event_type,
      })),
      found.options,
    )
      .then(subscription => {
        found.subscription = subscription
        subscriptionMap.set(key, found)
        found.oninit()
      })
      .catch((e) => {
        found.onerror(resolveError(e))
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
      data.onerror(resolveError({reason, details}))
    }
  }

  const connect = asyncCache((key) => {
    if (connection) {
      _subscribe(key)
      return Promise.resolve(connection)
    }
    return new Promise((resolve, reject) => {
      connection = new Connection({
        url,
        realm,
        create_transport,
      })
      connection.onopen = () => {
        onopen()
        resolve()
        connection.onopen = onopen
      }
      connection.onclose = (reason, details) => {
        const err = new Error(reason)
        err.reason = reason
        err.details = details
        reject(err)
        if (connection) {
          connection.onclose = onclose
        }
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

    onerror = onerror || (() => {})
    oninit = oninit || (() => {})
    onevent = onevent || (() => {})

    const key = resolveSubscriptionKey()
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
        return Promise.resolve()
      }

      return connection.session
        .unsubscribe(found.subscription)
        .then(() => {
          subscriptionMap.delete(key)

          if (subscriptionMap.size === 0) {
            connection.close()
            connection = null
          }
        })
    }

    connect(key).catch(err => {
      onclose(err.reason, err.details)
    })

    return {unsubscribe}
  }

  return {subscribe}
}

let _key = 1
function resolveSubscriptionKey() {
  return _key++
}

function asyncCache(fn) {
  let inProgress = false
  let bufferList = []

  return (...args) => {
    return new Promise(async (resolve, reject) => {
      bufferList.push({resolve, reject})
      
      if (!inProgress) {
        inProgress = true

        try {
          const result = await fn(...args)
          for (const {resolve: success} of bufferList) {
            success(result)
          }
        } catch (e) {
          for (const {reject: error} of bufferList) {
            error(e)
          }
        }

        inProgress = false
        bufferList = []
      }
    })
  }
}

module.exports = {
  wamper,
}
