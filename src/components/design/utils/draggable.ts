// 使元素可拖拽

const draggingImage = document.createElement('img');
draggingImage.style.position = 'fixed';
draggingImage.style.pointerEvents = 'none';
draggingImage.style.width = '100px'
draggingImage.style.zIndex = '999999';
draggingImage.style.cursor  = 'pointer'
draggingImage.style.objectFit = 'contain';
document.body.appendChild(draggingImage);
    
export const initDraggableElement = (drager,cb,src = drager.src) => {
    // 创建一个新的 image 元素
    drager.addEventListener('dragstart',(e) => {
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

        draggingImage.src = src;
        draggingImage.style.display = 'block';
        // 设置image元素的位置
        draggingImage.style.left = mouseX - draggingImage.width /2 + "px";
        draggingImage.style.top = mouseY - draggingImage.height/2 + "px";
        document.addEventListener('mouseup', onMouseUp);
    }
  
    // 鼠标释放事件处理函数
    function onMouseUp(event) {

      draggingImage.style.display = 'none'
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      cb(draggingImage,event)
    }

    function onDoMouseUp(){
        isDown = false
    }
  
    // 添加鼠标按下事件监听器
    drager.addEventListener('mousedown', onMouseDown);
    drager.addEventListener('mouseup', onDoMouseUp);
  
    // 返回拖动结束时的事件回调函数
    return 
  }