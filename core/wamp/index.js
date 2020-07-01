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
// 如果是因为 token 过期，则主动调用一下获取当前用户的接口，刷新 token
function shouldTryAgain(reason) {
  if (reason === 'wamp.error.not_authorized') {
    return true
  }
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
    _subscribe = subscriber({
      WebSocket: BaaS._polyfill.WebSocket,
      url: BaaS._config.WS_HOST + BaaS._config.WS_PATH,
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
