import { resolveFilePath, toRealPath } from "@/api/url";
import { ModelController } from "./controller";
import { canvasBgColor, currentOperatingModelInfo, isDarkMode } from '../store';

export const _1stfExporterMixin = (modelController: ModelController) => {
  modelController.exportTo1stf = () => {
    const decals = modelController.decalControllers.map((dc: any) => {
      const position = {
        x: dc.position.x,
        y: dc.position.y,
        z: dc.position.z,
      };

      const rotation = {
        x: dc.rotation.x,
        y: dc.rotation.y,
        z: dc.rotation.z,
      };

      const size = {
        x: dc.size.x,
        y: dc.size.y,
        z: dc.size.z,
      };

      return {
        decalId: dc.info.id,
        position,
        rotation,
        size,
      };
    });
    
    return {
      baseModelId: currentOperatingModelInfo.value.id,
      decals,
      isDarkMode: isDarkMode.value,
      canvasBgColor: canvasBgColor.value,
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
