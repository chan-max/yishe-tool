import { resolveFilePath, toRealPath } from "@/api/url";
import { ModelController } from "./controller";
import { canvasBgColor, currentOperatingModelInfo, isDarkMode,canvasBgOpacity } from '../store';

export const _1stfExporterMixin = (modelController: ModelController) => {
  modelController.exportTo1stf = () => {
    const decals = modelController.decalControllers.map((decal: any) => decal.export());
    
    return {
      baseModelId: currentOperatingModelInfo.value.id,
      decals,
      isDarkMode: isDarkMode.value,
      canvasBgColor: canvasBgColor.value,
      canvasBgOpacity:canvasBgOpacity.value,
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
