import {
  Box3,
  BoxGeometry,
  Euler,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,

} from "three";
import { message } from 'ant-design-vue'
import { ref, reactive, computed, shallowRef, watch } from 'vue'
import { v4 } from 'uuid'
import Utils from '@/common/utils'
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { currentModelController, currentOperatingDecalController, showDecalControl } from '../store';
import { useLoginStatusStore } from "@/store/stores/login";

import Api from '@/api'
import { useDebounceFn } from "@vueuse/core";


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


/**
 * @declare 当前鼠标正在覆盖的贴花
*/
export const currentHoveringDecalController = shallowRef()

watch(currentHoveringDecalController, (val) => {
  document.body.style.cursor = val ? 'pointer' : ''
})

export class DecalController {

  // 用于响应式的状态
  state = reactive({
    id: null,
    info: null,
    isLocalResource: false,
    url: null, // 贴纸的路径，用于贴花和展示
    src: null, // 等同于 url

    // 外部绑定的 旋转和尺寸值，位置是固定的所以不需要输入
    modelValueRotate: null,
    modelValueSize: 20,

    rotation: null,
    position: null,

    initialPosition: null, // 保存 最初始的位置
    isHover: false, // 鼠标是否在覆盖模型上

    imgAspectRatio: 1, // 当前贴花图的宽高比

    roughness: .9, // 粗糙度 
    metalness: 0, // 金属感觉

    renderOrder: 1,

    polygonOffsetFactor: -12,
  })

  id = ref()

  context = null

  // 该贴纸的创建时间
  createTime = new Date()

  // 更新时间
  updateTime = new Date()

  constructor(info?) {

    // 处理配置
    this.context = this
    if (!info) {
      return
    }

    this.state.id = this.id.value = (info.id || v4()) // 如果是本地的贴纸，随机分配一个id
    this.state.isLocalResource = info.isLocalResource
    this.state.src = this.state.url = info.url || info.src || info.img?.src || info.base64 || info.thumbnail?.url
    this.info = info
    this.state.info = info
    if (this.state.isLocalResource) {
      this.info.src = this.info.base64
    }
    this.img = info.img


    // 绑定事件
    // 0 - 360
    watch(() => this.state.modelValueRotate, useDebounceFn((value) => {
      if (!value && value !== 0) {
        return
      }
      this?.rotate((2 * Math.PI * value) / 360);
    }, 11), {
      immediate: true
    })

    // 0 -  100
    watch(() => this.state.modelValueSize, useDebounceFn((value, oldValue) => {


      if (!value) {
        return
      }

      this?.scale(value / 100);
    }, 11), {
      immediate: true
    })

    // 0 - 1 
    watch(() => this.state.roughness, useDebounceFn((value) => {
      if (!value) {
        return
      }
      this?.setRoughness(value)
    }, 11), {
      immediate: true
    })

    // 0 - 1 
    watch(() => this.state.metalness, useDebounceFn((value) => {
      if (!value) {
        return
      }
      this?.setMetalness(value)
    }, 11), {
      immediate: true
    })
  }

  // 确认添加该贴纸到场景
  ensureAdd() {
    this.initClickEvent();
    this.initMousemoveEvent();
    currentModelController.value.decalControllers.push(this);
    currentOperatingDecalController.value = this
  }


  // 当前贴花使用的图片
  private img = null;

  // 材质
  material = null;


  // 贴纸尺寸限制
  minSize: number

  maxSize: number

  // 尺寸比 0 - 1 最小尺寸 到最大尺寸
  sizeRatio = 1


  // 尺寸
  size = computed(() => {
    return new Vector3(this.state.modelValueSize / 100, this.state.modelValueSize / 100 / this.state.imgAspectRatio, this.state.modelValueSize / 100);
  })



  // 保存当前的decal实例
  mesh = null;

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
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: this.state.polygonOffsetFactor -= 2,
      polygonOffsetUnits: 1,
      wireframe: false,
      roughness: this.state.roughness, // 粗糙度 , 目前没啥效果
      metalness: this.state.metalness, // 金属感觉
    }


    // 材质
    var texture = null

    const textureLoader = new TextureLoader();
    textureLoader.setWithCredentials(true)
    textureLoader.setCrossOrigin('*')

    let sourceUrl = this.img?.src || this.info.src || this.info.thumbnail?.url


    // 本地穿件的图片
    if (this.state.isLocalResource) {
      const image = new Image();
      image.src = this.info.base64;
      // 创建纹理

      texture = new Texture(image);
      image.onload = function () {
        texture.needsUpdate = true; // 更新纹理
      };
    } else {
      texture = await textureLoader.loadAsync(sourceUrl)
    }

    // 这羊可以让图片颜色看起来更好
    texture.colorSpace = SRGBColorSpace;

    texture.wrapS = RepeatWrapping; // 设置水平重复
    texture.wrapT = RepeatWrapping; // 设置垂直重复

    // 设置纹理的密度
    texture.repeat.set(1, 1); // 设置重复次数
    texture.offset.set(0, 0); // 设置偏移

    this.state.imgAspectRatio = (texture.image.naturalWidth || texture.image.width) / (texture.image.naturalHeight || texture.image.height);

    this.material = new MeshStandardMaterial({
      map: texture,
      ...basicTextureOptions,
    });


  }

  // 创建该贴纸

  private isCreating = false

  private geometry = null

  async create(isUpdate = false) {

    if (this.isCreating) {
      return
    }

    this.isCreating = true

    // 初始化材质
    if (!this.material) {
      await this.initTexture()
    }

    if (!this.parentMesh) {
      return
    }

    if (!this.state.position) {
      return
    }

    if (!this.state.rotation) {
      return
    }


    if (isUpdate) {
      this.geometry = new DecalGeometry(this.parentMesh, this.state.position, this.state.rotation, this.size.value);
      this.mesh.geometry = this.geometry
    } else {
      this.geometry = new DecalGeometry(this.parentMesh, this.state.position, this.state.rotation, this.size.value);
      // 不再需要重建一个新的网格
      this.mesh = new Mesh(this.geometry, this.material);
      currentModelController.value.scene.add(this.mesh);
    }

    this.mesh.renderOrder = this.state.renderOrder++

    // this.geometry.computeFaceNormals();
    // this.geometry.computeVertexNormals();
    this.isCreating = false
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

    const position = intersects[0].point;

    this.state.position = position;

    this.state.initialPosition = new Vector3()
    this.state.initialPosition.copy(position)

    const copy = intersects[0].face.normal.clone();

    copy.transformDirection(this.parentMesh.matrixWorld);
    copy.add(position);

    const helper = new Object3D();
    helper.position.copy(position);
    helper.lookAt(copy);
    let rotation = helper.rotation;

    this.state.rotation = rotation;

    await this.create()

    this.ensureAdd()

    if (cb) {
      cb()
    }

    this.currentMousePosition = null
    message.success({ content: '贴纸添加成功', key: 'sticking' })
  }



  // 移除当前贴纸
  private removeMesh() {
    currentModelController.value.scene.remove(this.mesh);
    this.mesh = null
  }



  // 旋转
  rotate(rotation) {
    this.state.rotation.z = rotation;
    this.create(true)
  }


  setRoughness(val) {
    if (!this.material) {
      return
    }
    this.material.roughness = val
    this.material.needsUpdate = true
  }

  setMetalness(val) {
    if (!this.material) {
      return
    }
    this.material.metalness = val
    this.material.needsUpdate = true
  }

  // 缩放
  scale(ratio) {
    this.create(true)
  }


  private initClickEvent() {
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
        this.mouseover.value = false
        this.state.isHover = false

        if (currentHoveringDecalController.value == this) {
          currentHoveringDecalController.value = null
        }

        return
      }


      this.mouseover.value = true
      this.state.isHover = true
      currentHoveringDecalController.value = this
    }

    // 绑定点击事件
    currentModelController.value.onMousemove(decalHover.bind(this))
  }


  // 如果是本地创建的贴纸，则需要上传到远程
  public async upload() {
    if (!this.state.isLocalResource) {
      return Promise.resolve(void 0);
    }

    let loginStore = useLoginStatusStore()

    const file = Utils.transform.base64ToPngFile(this.info.base64)

    const cos = await Api.uploadToCOS({
      file: file
    })

    let data = await Api.createSticker({
      thumbnail: cos,
      type: 'composition',
      isPublic: false,
      meta: {
        data: this.info.data
      },
      uploaderId: loginStore.isLogin ? loginStore.userInfo.id : null
    })


    this.state.isLocalResource = false
    this.state.id = data.id
    return data
  }


  resetPosition() {
    this.state.position = new Vector3()
    this.state.position.copy(this.state.initialPosition)
    this.create(true)
  }

  private moveDistance = .005

  moveTop() {
    this.state.position.y += this.moveDistance
    this.create(true)
  }


  moveDown() {
    this.state.position.y -= this.moveDistance
    this.create(true)
  }


  moveLeft() {
    this.state.position.x -= this.moveDistance
    this.create(true)
  }

  moveRight() {
    this.state.position.x += this.moveDistance
    this.create(true)
  }


  // 导出该信息
  async export() {

    if (!this.state.position) {
      return
    }

    await this.upload()

    const position = {
      x: this.state.position.x,
      y: this.state.position.y,
      z: this.state.position.z,
    };

    const rotation = {
      x: this.state.rotation.x,
      y: this.state.rotation.y,
      z: this.state.rotation.z,
    };

    const size = {
      x: this.size.value.x,
      y: this.size.value.y,
      z: this.size.value.z,
    };


    return {
      id: this.state.id, // 为贴纸的 id
      position,
      /**
   * 真是数据不再需要
  */
      size,
      rotation,
      modelValueSize: this.state.modelValueSize,
      modelValueRotate: this.state.modelValueRotate,
      metalness: this.state.metalness,
      roughness: this.state.roughness,
    };
  }
}


