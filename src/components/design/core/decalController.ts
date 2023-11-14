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
  private _position = null
  get position() {
    return this._position
  }

    // 贴纸尺寸限制
    minSize: number
    maxSize: number
  
    // 尺寸比 0 - 1 最小尺寸 到最大尺寸
    sizeRatio = 1
  // 尺寸
  _size = 0.1
  get size() {
    return new Vector3(this._size, this._size / this.imgAspectRatio, this._size);
  }

  // 角度
  private _rotation = null
  get rotation() {
    return this._rotation
  }

  // 保存当前的decal实例
  decal = null;

  // 当前使用的材质信息

  // 记录贴花添加时的鼠标位置
  get mousePositon() {
    return new Vector2(this.modelController.mouse.x, this.modelController.mouse.y)
  }

  get mesh() {
    return this.modelController.mainMesh;
  }

  // 记录贴画时摄像机的位置
  cameraPosition = null

  info = null

   constructor(modelController: ModelController, img: HTMLImageElement, info) {
    this.modelController = modelController;
    this.img = img;
    this.info = info;
    this.imgAspectRatio = this.img.width / this.img.height;
    this.initTexture();
    this.modelController.decalControllers.push(this);
    showDecalControlDialog.value = true;
    operatingDecal.value = this
  }

   initTexture(){
    const textureLoader = new TextureLoader();
    textureLoader.setWithCredentials(true)
    textureLoader.setCrossOrigin('*')
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
  }

  // 创建该贴纸
  create() {
    // 检查是否已创建，并清除旧贴纸
    if (this.decal) {
      this.modelController.scene.remove(this.decal);
    }
    
    var decalGeometry = new DecalGeometry(this.mesh, this.position, this.rotation, this.size);
    this.decal = new Mesh(decalGeometry, this.material);
    this.modelController.scene.add(this.decal);
  }

  //  销毁该贴纸
  destroy() {
    this.remove()
    this.modelController.decalControllers.splice(this.modelController.decalControllers.indexOf(this), 1)
    operatingDecal.value = null
  }

  // 当前贴纸被点击时
  onClick(cb) {
  }

  // 在当前鼠标位置进行贴图
  stickToMousePosition() {

    if(!this.mesh){
      return
    }

    const raycaster = new Raycaster();
    raycaster.setFromCamera(this.modelController.mouse, this.modelController.camera);
    const intersects = raycaster.intersectObject(this.mesh, true);

    if (intersects.length == 0) {
      // 未选中
      return;
    }

    const position = intersects[0].point;

    this._position = position;
    const copy = intersects[0].face.normal.clone();
    copy.transformDirection(this.mesh.matrixWorld);
    copy.add(position);
    const helper = new Object3D();
    helper.position.copy(position);
    helper.lookAt(copy);
    let rotation = helper.rotation;
    this._rotation = rotation;
    this.create()
  }


  // 移除当前贴纸
  remove(){
    this.modelController.scene.remove(this.decal);
  }


  // 旋转
  rotate(rotation){
    this.rotation.z = rotation;
    this.create()
  }

  // 移动
  move(){

  }

  // 缩放
  scale(ratio){
    this._size = ratio
    this.create()
  }
}


