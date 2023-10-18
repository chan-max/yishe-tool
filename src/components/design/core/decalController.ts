import { ElMessage } from "element-plus";
import { ModelController } from "./controller";
import { Mesh, MeshPhongMaterial, Object3D, Raycaster, TextureLoader, Vector3 } from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

export class DecalController {

    modelController:ModelController = null

    img = null

    aspectRatio = 1

    material = null

    constructor(modelController:ModelController,img:HTMLImageElement){
        this.modelController = modelController
        this.img = img
        this.aspectRatio = this.img.width / this.img.height ;    
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(this.img.src);
        this.material =  new MeshPhongMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          wireframe: false,
        })
    }

    create(){
      const mesh = this.modelController.mainMesh;
      if (!mesh) {
        ElMessage.info("请先选择一个基础模型");
        return;
    }


    let raycaster = new Raycaster();

    raycaster.setFromCamera(this.modelController.mouse, this.modelController.camera);
    
    const intersects = raycaster.intersectObject(mesh, true);

    if (intersects.length == 0) {
      return;
    }
    
    var position = intersects[0].point;

    var size = new Vector3(0.1, 0.1 / this.aspectRatio, 0.1);
    var n = intersects[0].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.add(intersects[0].point);

    


    let helper = new Object3D();
    helper.position.copy(intersects[0].point);

    helper.lookAt(n);

    let euler = helper.rotation;

    var decalGeometry = new DecalGeometry(mesh, position, euler, size);

    var decal = new Mesh(
      decalGeometry,
      this.material
    );

    this.modelController.scene.add(decal);

    }



    destroy(){
    }
}