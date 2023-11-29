import { ElMessage } from "element-plus";
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
import { currentController, operatingDecal, showDecalControl } from '../store';
import { urlToImageElement } from "@/common/transform/urlToImageElement";

export interface DecalControllerParams {
  // 定义贴纸的类型
  type: 'image' | 'text',
  // 贴纸的资源id,如果不是上传的文件则不需要
  id?: any,
  // 使用的图片元素
  img?: HTMLImageElement

  // 用来区分使用的是网络资源还是本地资源,本地资源保存时需要上传
  local:boolean
}

export class DecalController {

  // 该贴纸的创建时间
  createdAt = new Date()

  // 更新时间
  updatedAt = new Date()

  // 该贴纸的来源
  origin = null

  constructor(info: any) {
    this.info = info

    const {
      img
    } = info

    this.img = img

    this.initDecalClickEvent()
    currentController.value.decalControllers.push(this);
    operatingDecal.value = this
  }

  // 核心控制器
  // 当前贴花使用的图片
  private img = null;

  // 图片的资源路径
  url = null

  // 图片的相对资源路径
  rawUrl = null

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
  mesh = null;

  // 当前使用的材质信息

  // 记录贴花添加时的鼠标位置
  get mouse() {
    return new Vector2(currentController.value.mouse.x, currentController.value.mouse.y)
  }

  get parentMesh() {
    return currentController.value.mesh;
  }

  // 记录贴画时摄像机的位置
  cameraPosition = null

  // params

  info = null



  async initTexture() {
    const textureLoader = new TextureLoader();
    textureLoader.setWithCredentials(true)
    textureLoader.setCrossOrigin('*')
    const texture = await textureLoader.loadAsync(this.img?.src || this.info.src);
    this.imgAspectRatio = (texture.image.naturalWidth || texture.image.width) / (texture.image.naturalHeight || texture.image.height);
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
    if (this.mesh) {
      currentController.value.scene.remove(this.mesh);
    }

    var decalGeometry = new DecalGeometry(this.parentMesh, this.position, this.rotation, this.size);
    this.mesh = new Mesh(decalGeometry, this.material);
    currentController.value.scene.add(this.mesh);
  }

  //  销毁该贴纸
  destroy() {
    this.remove()
    currentController.value.decalControllers.splice(currentController.value.decalControllers.indexOf(this), 1)
    operatingDecal.value = null
  }


  // 在当前鼠标位置进行贴图
  async stickToMousePosition() {

    if (!this.parentMesh) {
      return
    }

    if (!this.material) {
      await this.initTexture()
    }

    const raycaster = new Raycaster();
    raycaster.setFromCamera(currentController.value.mouse, currentController.value.camera);
    const intersects = raycaster.intersectObject(this.parentMesh, true);

    if (intersects.length == 0) {
      // 未选中
      return;
    }

    const position = intersects[0].point;

    this._position = position;
    const copy = intersects[0].face.normal.clone();
    copy.transformDirection(this.parentMesh.matrixWorld);
    copy.add(position);
    const helper = new Object3D();
    helper.position.copy(position);
    helper.lookAt(copy);
    let rotation = helper.rotation;
    this._rotation = rotation;
    this.create()
  }


  // 移除当前贴纸
  remove() {
    currentController.value.scene.remove(this.mesh);
  }


  // 旋转
  rotate(rotation) {
    this.rotation.z = rotation;
    this.create()
  }

  // 移动
  move() {

  }

  // 缩放
  scale(ratio) {
    this._size = ratio
    this.create()
  }

  // 当前贴纸被点击时
  onClick(cb) {
  }

  private initDecalClickEvent() {
    function decalClick() {
      const raycaster = new Raycaster()
      raycaster.setFromCamera(currentController.value.mouse, currentController.value.camera)
      const intersects = raycaster.intersectObject(this.mesh, true)
      const intersect = intersects[0]
      if (!intersect) {
        return
      }
      operatingDecal.value = this
      showDecalControl.value = true
    }
    currentController.value.onClick(decalClick.bind(this))
  }
}


