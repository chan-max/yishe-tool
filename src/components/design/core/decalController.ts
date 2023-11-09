import { ElMessage } from "element-plus";
import { ModelController } from "./controller";
import {
  Box3,
  BoxGeometry,
  Euler,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  Raycaster,
  TextureLoader,
  Vector2,
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
  imgAspectRatio = 1;

  // 材质
  material = null;

  // 位置
  position = null;

  size = null;

  rotation = null;

  // 保存当前的decal实例
  decal = null;

  // 当前使用的材质信息

  // 记录贴花添加时的鼠标位置
  mousePositon = null

  // 记录贴画时摄像机的位置
  cameraPosition = null

  constructor(modelController: ModelController, img: HTMLImageElement,stickerInfo) {

    this.modelController = modelController;
    this.img = img;
    
    this.imgAspectRatio = this.img.width / this.img.height;
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
      return;
    }

    let raycaster = new Raycaster();

    raycaster.setFromCamera(
      this.modelController.mouse,
      this.modelController.camera
    );
    
    this.mousePositon = new Vector2(this.modelController.mouse.x,this.modelController.mouse.y)
    
    const intersects = raycaster.intersectObject(mesh, true);

    if (intersects.length == 0) {
      // 未选中任何贴纸
      return;
    }

    var position = intersects[0].point;

    this.position = position;

    var n = intersects[0].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.add(position);
    
    const helper = new Object3D();
    
    helper.position.copy(position);

    helper.lookAt(n);

    let rotation = helper.rotation;

    this.rotation = rotation;

    // 贴纸旋转角度
    this.rotation.z = Math.random() * 2 * Math.PI;

    // 贴图尺寸
    var size = new Vector3(0.3, 0.3 / this.imgAspectRatio, 0.3);
    
    this.size = size;
    
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

  // 在当前鼠标位置进行贴图
  stickToMousePosition(){

  }
}


