// 使元素可拖拽

const draggableImage = document.createElement('img');
draggableImage.style.position = 'fixed';
draggableImage.style.pointerEvents = 'none';
draggableImage.style.width = '100px'
draggableImage.style.zIndex = '999999';
draggableImage.style.cursor  = 'pointer'
document.body.appendChild(draggableImage);

export const initDraggableElement = (imageElement,cb) => {
    // 创建一个新的 image 元素
    imageElement.addEventListener('dragstart',(e) => {
        e.preventDefault()
    })
    
    // 记录初始鼠标位置和元素位置

    // 鼠标按下事件处理函数
    function onMouseDown(event) {
        draggableImage.src = imageElement.src;
        // 添加鼠标移动和释放事件监听器
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
  
    // 鼠标移动事件处理函数
    function onMouseMove(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        draggableImage.style.display = 'block';
        // 设置image元素的位置
        draggableImage.style.left = mouseX - draggableImage.width /2 + "px";
        draggableImage.style.top = mouseY - draggableImage.height/2 + "px";
    }
  
    // 鼠标释放事件处理函数
    function onMouseUp(e) {
      // 移除鼠标移动和释放事件监听器
      draggableImage.style.display = 'none'
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      cb(draggableImage,e)
    }
  
    // 添加鼠标按下事件监听器
    imageElement.addEventListener('mousedown', onMouseDown);
  
    // 返回拖动结束时的事件回调函数
    return 
  }