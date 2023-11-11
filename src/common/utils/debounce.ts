
export function debounce(fn: Function, wait: number = 200) {
    let timeoutId: any = null
    return () => {
        if (timeoutId !== null) {
            // 存在任务
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn()
            timeoutId = null
        }, wait);
    }
}