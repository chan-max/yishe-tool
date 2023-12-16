

// 摄像头是否可用
export function cameraUsable() {
    return !!navigator?.mediaDevices.getUserMedia
}

export const facingModeUserOption = { video: { facingMode: "user" } }

export const facingModeEnvironmentOption = {
    video: {
        facingMode: { exact: "environment" }
    }
}

