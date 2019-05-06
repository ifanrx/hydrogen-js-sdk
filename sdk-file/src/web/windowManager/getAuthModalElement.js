let iframe = null
let container = null
let closeBtn = null
const ELEMENT_ID = {
  CONTAINER: 'auth-iframe__container',
  IFRAME: 'auth-iframe__iframe',
  CLOSE_BUTTON: 'auth-iframe__close-btn',
}

let closeBtnIcon = "" +
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACpUlEQVR4Xu2bbVEDMRCG3yoAB4ADH" +
"IADcAAoAAmgAFAAOMAB4AAJOAAcMMu0zLWTy71J9iOlzZ/+aGaS58nmLrnZnWHD22zD+bEVsI2AcQPHAC4BHM67vAJ4AiC/Pbfh" +
"vL8AvAO4AfCRmvTYFjgH8DBCeQHgsVMDtwCuSuadEiAGXyYAe5QgCyYLl2sHq5GQEvAM4IRY4Z4kMPCCdL8aISkBnwB2CQHSpQc" +
"JLLzM9w2ARPhfSwmQB8cOKSBaQgk8LYDdAkNHEZFQCk9vAeYhmAoQTwk18DJn6iEoHXOvwdzu8JBQC5+cW+4o3KMEVXhZyam7QE" +
"8S1OEZAb1sBxN4VkC0BDP4EgFREkzhSwV4SzCHrxHgJcEFvlaAtQQ3+BYBVhJc4VsFaEtwh9cQoCUhBF5LQKuEI+JLjtnla+ooX" +
"PBZoPoCVTLGoq/apUtTQEsklEhQg9fcAkOA2gsUI0EV3kqAVSSow1sK0JZgAm8tQEuCGbyHgFYJpvBeAmoPOTK/tRfQAq/+zk+9" +
"ZrTPAcMxNODNJVgJ0IQ3lWAhwALeTIK2AEt4EwmaAjzg1SVoCaiFl9ectLFslNz9QOUVqSGgBX6RalN7gWqW0CpAA36xyiESWgR" +
"owodJqBVgAR8ioUaAJby7hFIBHvCuEkoEeMK7SWAFRMC7SGAERMKbS5gS0AO8qYScgJ7gzSSMCbibp8rnzuKp/5qPpsSAqifG2m" +
"zxKPjWSKASJdclVbYmEqTgYymlvjVb3OXLbWZblEqgssWltGSP2IvR8DXbgRIgd/QzQoDHA4+Yxm8XNhKoggkmW7wneDYSvucFY" +
"EvFU/+taGosEgT+NFXxljsI7QO4BiC/0qT8TM4HyfIzNlYd+kmZn1SOUfOeOgo7zDd2iK2AWP/xo298BPwAGl7JQYFN8oYAAAAA" +
"SUVORK5CYII="

const createAuthModal = () => {
  container = document.createElement('div')
  container.id = ELEMENT_ID.CONTAINER
  container.style.cssText = `
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    border: none;
    background-color: #fff;
    z-index: 1000;
  `

  iframe = document.createElement('iframe')
  iframe.id = ELEMENT_ID.IFRAME
  iframe.style.cssText = `
    border: none;
    width: 100vw;
    height: 100vh;
  `

  closeBtn = document.createElement('div')
  closeBtn.id = ELEMENT_ID.CLOSE_BUTTON
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    background: url(${closeBtnIcon}) no-repeat center center/20px 20px;
    z-index: 100;
  `

  container.append(iframe)
  container.append(closeBtn)
  document.body.append(container)
}

const setStyle = (element, style) => {
  Object.keys(style).forEach(key => {
    element.style[key] = style[key]
  })
}


const getAuthModalElement = modalStyle => {
  container = document.querySelector(`#${ELEMENT_ID.CONTAINER}`)
  if (container) {
    iframe = container.querySelector(`#${ELEMENT_ID.IFRAME}`)
    closeBtn = container.querySelector(`#${ELEMENT_ID.CLOSE_BUTTON}`)
  }

  if (!container || !iframe || !closeBtn) {
    createAuthModal()
  }
  if (modalStyle && modalStyle.container) {
    setStyle(container, modalStyle.container)
  }
  if (modalStyle && modalStyle.iframe) {
    setStyle(container, modalStyle.iframe)
  }
  if (modalStyle && modalStyle.closeButton) {
    setStyle(closeBtn, modalStyle.closeButton)
  }
  return {container, iframe, closeBtn}
}

typeof window !== 'undefined' && window.addEventListener('load', () => {
  createAuthModal()
})

module.exports = getAuthModalElement
