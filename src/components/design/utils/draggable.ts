// 使元素可拖拽




const draggingImage = document.createElement('img');
draggingImage.style.position = 'fixed';
draggingImage.style.pointerEvents = 'none';
draggingImage.style.maxWidth = '160px'
draggingImage.style.maxHeight = '160px'

draggingImage.style.minWidth = '80px'
draggingImage.style.minHeight = '80px'

draggingImage.style.zIndex = '999999';
draggingImage.style.cursor = 'pointer'
draggingImage.style.objectFit = 'contain';
draggingImage.style.boxShadow =  `rgba(115, 0, 255, 0.9) 0px 0px 0px 3px`;
draggingImage.style.cursor = 'grab';

draggingImage.style.display = 'none';

document.body.appendChild(draggingImage);



export const initDraggableElement = (el, cb, sourceOrGetter = null) => {

    sourceOrGetter ||= el.src

    el._src = typeof sourceOrGetter === 'function' ? sourceOrGetter() : sourceOrGetter

    // 保证同一元素只初始化一次,需要保证src能够更新
    if (el._isDraggable) {
        return
    }

    // 创建一个新的 image 元素
    el.addEventListener('dragstart', (e) => {
        e.preventDefault()
    })

    // 记录初始鼠标位置和元素位置

    // 鼠标按下事件处理函数

    var clickX, clickY, isDown = false

    function onMouseDown(event) {
        isDown = true
        clickX = event.clientX;
        clickY = event.clientY;
        // 添加鼠标移动和释放事件监听器
        document.addEventListener('mousemove', onMouseMove);
        draggingImage.src = el._src;
    }

    // 鼠标移动事件处理函数
    function onMouseMove(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        // 限制拖拽条件
        if (!clickX || !clickY || Math.abs(mouseX - clickX) < 10 || Math.abs(mouseY - clickY) < 10) {
            if (!isDown) {
                document.removeEventListener('mousemove', onMouseMove);
            }
            return
        }

        draggingImage.style.display = 'block';
        // 设置image元素的位置
        draggingImage.style.left = mouseX - draggingImage.width / 2 + "px";
        draggingImage.style.top = mouseY - draggingImage.height / 2 + "px";
        document.addEventListener('mouseup', onMouseUp);
    }

    // 鼠标释放事件处理函数
    function onMouseUp(event) {
        console.log('mouseUp')
        draggingImage.style.display = 'none'
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        cb(draggingImage, event)
    }

    function onDoMouseUp() {
        isDown = false
    }

    // 添加鼠标按下事件监听器
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseup', onDoMouseUp);

    // 返回拖动结束时的事件回调函数
    el._isDraggable = true
    return 
}