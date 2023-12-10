

// 摄像头是否可用
export function cameraUsable() {
    return !!navigator?.mediaDevices.getUserMedia
}

export const userCameraOption = { video: { facingMode: "user" } }

export const environmentCameraOption = {
    video: {
        facingMode: { exact: "environment" }
    }
}

