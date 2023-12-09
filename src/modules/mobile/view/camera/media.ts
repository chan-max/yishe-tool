

// 摄像头是否可用
export function cameraUsable(){
    return !!navigator?.mediaDevices.getUserMedia
}


