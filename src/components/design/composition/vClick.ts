
// 该指令用于注册准确的点击事件

// 准确点击
export const vClick = {
    mounted(el: HTMLElement, binding) {
        // 禁止滑动触发点击事件
        let mousedownX = null;
        let mousedownY = null;
        let radius = 3;

        el.addEventListener("mousedown", (event: any) => {
            mousedownX = event.offsetX;
            mousedownY = event.offsetY;
        });

        el.addEventListener("mouseup", (event: any) => {
            let mouseupX = event.offsetX;
            let mouseupY = event.offsetY;
            if (
                Math.abs(mousedownX - mouseupX) <= radius &&
                Math.abs(mousedownY - mouseupY) <= radius
            ) {
                binding.value.call()
            }
        });
    }
}