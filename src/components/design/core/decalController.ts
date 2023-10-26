import { ElMessage } from "element-plus";
import { ModelController } from "./controller";
import {
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Raycaster,
  TextureLoader,
  Vector3,
} from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { operatingDecal, showDecalControlDialog } from '../store';

export class DecalController {
  // 核心控制器
  modelController: ModelController = null;

  // 当前贴花使用的图片
  img = null;

  // 宽高比
  aspectRatio = 1;

  // 材质
  material = null;

  // 位置
  position = null;

  size = null;

  rotation = null;

  decal = null;

  stickerInfo = null

  constructor(modelController: ModelController, img: HTMLImageElement,stickerInfo) {
    this.modelController = modelController;
    this.img = img;
    this.stickerInfo = stickerInfo;
    this.aspectRatio = this.img.width / this.img.height;
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(this.img.src);
    this.material = new MeshPhongMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      wireframe: false,
    });

    this.create();
    modelController.decalControllers.push(this);
    showDecalControlDialog.value = true;
    operatingDecal.value = this
  }

  // 创建该贴纸
  create() {
    const mesh = this.modelController.mainMesh;
    if (!mesh) {
      ElMessage.info("请先选择一个基础模型");
      return;
    }

    let raycaster = new Raycaster();

    raycaster.setFromCamera(
      this.modelController.mouse,
      this.modelController.camera
    );
    

    const intersects = raycaster.intersectObject(mesh, true);

    if (intersects.length == 0) {
      return;
    }

    var position = intersects[0].point;

    this.position = position;

    var size = new Vector3(0.1, 0.1 / this.aspectRatio, 0.1);

    this.size = size;

    var n = intersects[0].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.add(intersects[0].point);

    let helper = new Object3D();
    helper.position.copy(intersects[0].point);

    helper.lookAt(n);

    let rotation = helper.rotation;

    this.rotation = rotation;

    var decalGeometry = new DecalGeometry(mesh, position, rotation, size);

    this.decal = new Mesh(decalGeometry, this.material);

    this.modelController.scene.add(this.decal);
  }

  //  销毁该贴纸
  destroy() {
    this.modelController.scene.remove(this.decal);
  }

  onClick(cb){
    
  }
}
