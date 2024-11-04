

export class CameraController {

    modelController = null


    get camera() {
        return this.modelController.camera
    }

    constructor(modelController) {
        this.modelController = modelController; // 保存传入的相机对象
    }

    // 设置正视图
    setFrontView(distance = 5) {
        this.camera.position.set(0, 0, distance);
        this.camera.lookAt(0, 0, 0);
    }

    // 设置俯视图
    setTopView(distance = 5) {
        this.camera.position.set(0, distance, 0);
        this.camera.lookAt(0, 0, 0);
    }

    // 设置侧视图（右侧）
    setRightSideView(distance = 5) {
        this.camera.position.set(distance, 0, 0);
        this.camera.lookAt(0, 0, 0);
    }

    // 设置侧视图（左侧）
    setLeftSideView(distance = 5) {
        this.camera.position.set(-distance, 0, 0);
        this.camera.lookAt(0, 0, 0);
    }

    // 设置前斜视图
    setFrontRightIsometricView(distance = 5) {
        this.camera.position.set(distance, distance, distance);
        this.camera.lookAt(0, 0, 0);
    }

    // 设置后斜视图
    setBackIsometricView(distance = 5) {
        this.camera.position.set(-distance, -distance, -distance);
        this.camera.lookAt(0, 0, 0);
    }
}
