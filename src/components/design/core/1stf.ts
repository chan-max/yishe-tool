import { ModelController } from "./controller";

export const _1stfExporterMixin = (modelController: ModelController) => {
  modelController.exportTo1stf = () => {

    const baseModelUrl = modelController.baseModelUrl;
    
    const decals = modelController.decalControllers.map((dc: any) => {
      const position = {
        x: dc.position.x,
        y: dc.position.x,
        z: dc.position.x,
      };

      const rotation = {
        x: dc.rotation.x,
        y: dc.rotation.x,
        z: dc.rotation.x,
      };

      const size = {
        x: dc.size.x,
        y: dc.size.x,
        z: dc.size.x,
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
