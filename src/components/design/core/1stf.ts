import { resolveFilePath } from "@/api/url";
import { ModelController } from "./controller";
import { canvasBgColor, currentBaseModelUrl, isDarkMode } from "../store";

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
        position,
        rotation,
        size,
        img: dc.img.src,
      };
    });

    debugger

    var _ = {
      baseModelUrl: resolveFilePath(currentBaseModelUrl.value),
      decals,
      isDarkMode: isDarkMode.value,
      canvasBgColor: canvasBgColor.value,
      camera:{
        position: {
          x:modelController.camera.position.x,
          y:modelController.camera.position.y,
          z:modelController.camera.position.z,
        }
      }
    };

    
    return _;
  };
};
