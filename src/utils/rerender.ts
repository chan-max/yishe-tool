export function onWindowResize(callback: any, immediate: boolean = true) {
    window.onresize = callback

    immediate && callback()

    return () => window.onresize = null
}