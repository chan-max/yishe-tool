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

    var clickX,clickY,isDown = false

    function onMouseDown(event) {

        isDown = true
        clickX = event.clientX;
        clickY = event.clientY;
        // 添加鼠标移动和释放事件监听器
        document.addEventListener('mousemove', onMouseMove);
    }
    

    // 鼠标移动事件处理函数
    function onMouseMove(event) {

        var mouseX  = event.clientX;
        var mouseY  = event.clientY;

        if(!clickX || !clickY || Math.abs(mouseX - clickX) < 10 || Math.abs(mouseY - clickY) < 10){
            if(!isDown){
               document.removeEventListener('mousemove', onMouseMove);
            }
            return
        }

        draggableImage.src = imageElement.src;
        draggableImage.style.display = 'block';
        // 设置image元素的位置
        draggableImage.style.left = mouseX - draggableImage.width /2 + "px";
        draggableImage.style.top = mouseY - draggableImage.height/2 + "px";
        document.addEventListener('mouseup', onMouseUp);
    }
  
    // 鼠标释放事件处理函数
    function onMouseUp(event) {

      draggableImage.style.display = 'none'
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      cb(draggableImage,event)
    }

    function onDoMouseUp(){
        isDown = false
    }
  
    // 添加鼠标按下事件监听器
    imageElement.addEventListener('mousedown', onMouseDown);
    imageElement.addEventListener('mouseup', onDoMouseUp);
  
    // 返回拖动结束时的事件回调函数
    return 
  }