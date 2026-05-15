/**
 * Panzoom 实例共享 store
 * 用于在画布和子元素之间共享 panzoom 实例，以便控制画布的拖动和缩放
 */

let panzoomInstance: any = null

export function setPanzoomInstance(instance: any) {
  panzoomInstance = instance
}

export function getPanzoomInstance() {
  return panzoomInstance
}

/**
 * 临时暂停画布拖动（用于子元素交互时）
 */
export function pauseCanvasDrag() {
  if (panzoomInstance && typeof panzoomInstance.pause === 'function') {
    panzoomInstance.pause()
  }
}

/**
 * 恢复画布拖动
 */
export function resumeCanvasDrag() {
  if (panzoomInstance && typeof panzoomInstance.resume === 'function') {
    panzoomInstance.resume()
  }
}
