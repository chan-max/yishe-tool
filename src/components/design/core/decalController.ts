import {
  Box3,
  BoxGeometry,
  Euler,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  Raycaster,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,

} from "three";
import { message } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { v4 } from 'uuid'
import Utils from '@/common/utils'

import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { currentModelController, currentOperatingDecalController, showDecalControl } from '../store';

export interface DecalControllerParams {
  // 定义贴纸的类型
  type: 'image' | 'composition',
  // 贴纸的资源id,如果不是上传的文件则不需要
  id?: any,
  // 使用的图片元素
  img?: HTMLImageElement
  // 用来区分使用的是网络资源还是本地资源,本地资源保存时需要上传
  local: boolean,
  // 该贴纸使用的base64编码
  base64?: string,
  // 用于缓存的本地url
  objectUrl: string,
  // 该贴纸的宽高比
  aspectRatio: number
}



export class DecalController {

  // 用于响应式的状态
  state = reactive({
    id: null
  })

  id = ref()


  context = null

  // 该贴纸的创建时间
  createdAt = new Date()

  // 更新时间
  updatedAt = new Date()

  constructor(info: any) {
    this.state.id = this.id.value = v4()

    this.context = this
    this.info = info
    if (!this.info.src) {
      this.info.src = this.info.thumbnail
    }

    if(this.info.isLocalResource){
      this.info.src = this.info.base64
    }

    this.img = info.img
  }

  // 确认添加该贴纸到场景
  ensureAdd() {
    this.initDecalClickEvent();
    this.initMousemoveEvent();
    currentModelController.value.decalControllers.push(this);
    currentOperatingDecalController.value = this
  }


  // 当前贴花使用的图片
  private img = null;

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

  // 是否是本地资源
  get isLocalResource() {
    return this.info.local
  }

  // 当前使用的材质信息

  // 记录贴花添加时的鼠标位置
  get mouse() {
    return new Vector2(currentModelController.value.mouse.x, currentModelController.value.mouse.y)
  }

  get parentMesh() {
    return currentModelController.value.mesh;
  }

  // 记录贴画时摄像机的位置
  cameraPosition = null

  // params
  info = null

  async initTexture() {

    // 初始化材质

    const basicTextureOptions = {
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      wireframe: false,
    }


    // 材质
    var texture = null

    const textureLoader = new TextureLoader();
    textureLoader.setWithCredentials(true)
    textureLoader.setCrossOrigin('*')


    // 该种方式也会重新请求图片
    // texture = new Texture(this.img)

    // 加载图片比较费时间
    // let objectUrl = await Utils.transform.createImgObjectURL(this.info.img)
    // let base64 = await  Utils.transform.imgToBase64(this.info.img)

    if (this.info.isLocalResource) {
      const image = new Image();
      image.src = this.info.base64;

      // 创建纹理
      texture = new Texture(image);
      image.onload = function () {
        texture.needsUpdate = true; // 更新纹理
      };
    } else {
      texture = await textureLoader.loadAsync(this.img?.src || this.info.src || this.info.thumbnail)
    }


    this.imgAspectRatio = (texture.image.naturalWidth || texture.image.width) / (texture.image.naturalHeight || texture.image.height);

    this.material = new MeshPhongMaterial({
      map: texture,
      ...basicTextureOptions
    });
  }

  // 创建该贴纸
  create() {
    // 检查是否已创建，并清除旧贴纸
    if (this.mesh) {
      currentModelController.value.scene.remove(this.mesh);
    }

    var decalGeometry = new DecalGeometry(this.parentMesh, this.position, this.rotation, this.size);
    this.mesh = new Mesh(decalGeometry, this.material);
    currentModelController.value.scene.add(this.mesh);
  }

  //  销毁该贴纸
  remove() {
    this.removeMesh()
    // 从贴纸中移除
    currentModelController.value.decalControllers.splice(currentModelController.value.decalControllers.indexOf(this), 1)
    currentOperatingDecalController.value = null
  }


  // 当前的鼠标位置 ， 需要提前记录
  currentMousePosition = null

  // 在当前鼠标位置进行贴图
  async stickToMousePosition(cb?) {
    if (!this.parentMesh) {
      message.info('请先选择一个商品模型')
      return
    }

    message.loading({ type: 'info', content: '正在渲染贴纸', key: 'sticking', duration: 0 })

    this.currentMousePosition = currentModelController.value.mouse.clone()

    const raycaster = new Raycaster();

    raycaster.setFromCamera(this.currentMousePosition, currentModelController.value.camera);

    const intersects = raycaster.intersectObject(this.parentMesh, true);

    if (intersects.length == 0) {
      // 未选中
      message.info({ content: '要将贴纸放在模型上', key: 'sticking' })
      return Promise.reject();
    }

    // 初始化材质
    if (!this.material) {
      await this.initTexture()
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

    this.ensureAdd()

    if (cb) {
      cb()
    }

    this.currentMousePosition = null
    message.success({ content: '贴纸添加成功', key: 'sticking' })
  }

  // 在随机位置贴图
  async stickToRandomPosition() {
    let { position, rotation } = currentModelController.value.getRandomPosition();
    this._position = position
    this._rotation = rotation
    if (!this.material) {
      await this.initTexture()
    }
    this.create()
    this.ensureAdd()
  }


  // 移除当前贴纸
  private removeMesh() {
    currentModelController.value.scene.remove(this.mesh);
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


  private initDecalClickEvent() {
    function decalClick() {
      if (!this.mesh) {
        return
      }
      const raycaster = new Raycaster()
      raycaster.setFromCamera(currentModelController.value.mouse, currentModelController.value.camera)
      const intersects = raycaster.intersectObject(this.mesh, true)
      const intersect = intersects[0]
      if (!intersect) {
        return
      }
      currentOperatingDecalController.value = this
      showDecalControl.value = true
    }

    // 绑定点击事件
    currentModelController.value.onClick(decalClick.bind(this))
  }




  // 鼠标是否覆盖在元素上
  mouseover = ref(false)

  private initMousemoveEvent() {
    function decalHover() {
      if (!this.mesh) {
        return
      }
      const raycaster = new Raycaster()
      raycaster.setFromCamera(currentModelController.value.mouse, currentModelController.value.camera)

      const intersects = raycaster.intersectObject(this.mesh, true)
      const intersect = intersects[0]
      if (!intersect) {
        return this.mouseover.value = false
      }
      this.mouseover.value = true
    }

    // 绑定点击事件
    currentModelController.value.onMousemove(decalHover.bind(this))
  }




  // 导出该信息
  export() {

    if (!this.position) {
      return
    }

    const position = {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
    };

    const rotation = {
      x: this.rotation.x,
      y: this.rotation.y,
      z: this.rotation.z,
    };

    const size = {
      x: this.size.x,
      y: this.size.y,
      z: this.size.z,
    };


    return {
      type: this.info.type,
      id: this.info.id,
      position,
      rotation,
      size,
    };
  }
}


