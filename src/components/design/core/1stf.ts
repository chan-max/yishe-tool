import { ModelController } from "./controller";
import { canvasBgColor, currentOperatingBaseModelInfo, isDarkMode, canvasBgOpacity } from '../store';
import Utils from '@/common/utils';

export const _1stfExporterMixin = (modelController: ModelController) => {

  modelController.exportTo1stf = async () => {

    const decals = await Promise.all(
      modelController.decalControllers.map((decal) => decal.export())
    )

    return {
      // 基础模型 id
      baseModelId: currentOperatingBaseModelInfo.value.id,
      // 所有的贴花，具体信息见贴花
      decals,

      // 存储 模型的一些状态信息
      state: Utils.clone(modelController.state),
      isDarkMode: isDarkMode.value,

      
      // 相机角度
      camera: {
        position: {
          x: modelController.camera.position.x,
          y: modelController.camera.position.y,
          z: modelController.camera.position.z,
        },
        rotation: {
          x: modelController.camera.rotation.x,
          y: modelController.camera.rotation.y,
          z: modelController.camera.rotation.z,
        },
        fov: modelController.camera.fov,
        // 根据试图尺寸自适应
        aspect: modelController.camera.aspect,
        near: modelController.camera.near,
        far: modelController.camera.far
      }
    };
  };
};
