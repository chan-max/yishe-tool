import { resolveFilePath } from "@/api/url";
import { ModelController } from "./controller";

export const _1stfExporterMixin = (modelController: ModelController) => {
  modelController.exportTo1stf = () => {
    const baseModelUrl = resolveFilePath(modelController.baseModelUrl);
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
        img: dc.img.src
      }
    });

    return {
      baseModelUrl,
      decals
    };
  };
};
