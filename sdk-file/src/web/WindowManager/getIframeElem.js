let iframeElem = null

const createIframeElem = () => {
    iframeElem = document.createElement('iframe')
    iframeElem.style.position = 'fixed'
    iframeElem.style.left = 0
    iframeElem.style.top = 0
    iframeElem.style.width = '100vw'
    iframeElem.style.height = '100vh'
    iframeElem.style.zIndex = 1000
    iframeElem.style.backgroundColor = '#fff'
    iframeElem.style.display = 'none'
    document.body.append(iframeElem)
}

const getIframeElem = () => {
  if (!iframeElem) {
    createIframeElem()
  }
  return iframeElem
}

window.addEventListener('load', () => {
  getIframeElem()
})

module.exports = getIframeElem
