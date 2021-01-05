const BaaS = require('../baas')
const HError = require('../HError')

const subscriber = require('./subscriber')

function resolveTopic({schema_name, event_type}) {
  return `${BaaS._config.WS_BASE_TOPIC}.${schema_name}.on_${event_type}`
}

function resolveOptions({where}) {
  if (where) {
    return {where}
  }
  return {}
}

// 自定义触发自动重连
function shouldTryAgain() {
  return false
}

function errorify(onerror) {
  const lookup = {
    'unreachable': 601,
    'wamp.error.not_authorized': 603,
  }

  return (err) => {
    let message = err.message
    let reason = err.reason
    let details = err.details

    if (details && details.reason) {
      reason = details.reason
    }
    if (details && details.message) {
      message = details.message
    }

    if (!message && reason) {
      message = reason
    }

    const code = lookup[reason] || 0
    const h = new HError(code, message)
    h.reason = reason
    h.details = details

    onerror(h)
  }
}

function getAuthTokenQuerystring() {
  const qs = []
  qs.push(`x-hydrogen-client-id=${BaaS._config.CLIENT_ID}`)
  if (BaaS._config.ENV) {
    qs.push(`x-hydrogen-env-id=${BaaS._config.ENV}`)
  }
  return BaaS.getAuthToken().then(authToken => {
    if (authToken) {
      qs.push(`authorization=${encodeURIComponent(BaaS._config.AUTH_PREFIX + ' ' + authToken)}`)
    }
    return qs.join('&')
  })
}

let _subscribe = null

const subscribe = ({
  schema_name,
  where,
  event_type,
  onerror,
  oninit,
  onevent,
}) => {
  if (!_subscribe) {
    const host = BaaS._polyfill.getWSHost()
    const url =  host.replace(/\/$/, '') + '/' + BaaS._config.WS_PATH

    _subscribe = subscriber({
      WebSocket: BaaS._polyfill.WebSocket,
      url,
      realm: BaaS._config.WS_REALM,
      resolveOptions,
      resolveTopic,
      getAuthTokenQuerystring,
      shouldTryAgain,
    })
  }

  onerror = onerror || (() => {})
  oninit = oninit || (() => {})
  onevent = onevent || (() => {})

  return _subscribe({
    schema_name,
    where,
    event_type,
    onerror: errorify(onerror),
    oninit,
    onevent,
  })
}

module.exports = {
  subscribe,
}
