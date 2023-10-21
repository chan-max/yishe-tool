import {
  Box3,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  Vector3,
  Box3Helper,
  Vector2,
  Object3D,
  SphereGeometry,
  DoubleSide,
  Raycaster,
  Texture,
  Euler,
  MeshPhongMaterial,
  TextureLoader,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce, onWindowResize } from "../utils/utils";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { gltfLoader, textureLoader } from "../../../common/threejsHelper";
import { reactive, ref } from "vue";
import { reactify, useMouse } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { base64ToFile } from "@/common/transform/base64ToFile";
import { DecalController } from "./decalController";
import { _1stfExporterMixin } from "./1stf";


const mixins = [
  _1stfExporterMixin
]

export class ModelController {
  // 场景
  public scene: Scene;
  // 渲染器
  public renderer: WebGLRenderer;
  // 摄像机
  public camera: any;
  // 当前画布容器
  private canvasContainer: any;
  // 控制器
  public controller: any;
  // 尺寸侦听器
  public resizeObserver: any;
  // 保存当前鼠标坐标
  private _mouse = new Vector2();

  // 记录原始摄像机位置
  public defaultCameraPosition = new Vector3(0, 0, 1);

  public get mouse() {
    this._mouse.x = (this.x.value / this.width) * 2 - 1;
    this._mouse.y = -(this.y.value / this.height) * 2 + 1;
    return this._mouse;
  }

  // 是否在加载模型
  public loading = ref(false);

  // 当前界面宽度
  private get width() {
    return Number(
      window.getComputedStyle(this.canvasContainer).width.slice(0, -2)
    );
  }

  // 当前页面高度
  private get height() {
    return Number(
      window.getComputedStyle(this.canvasContainer).height.slice(0, -2)
    );
  }

  constructor() {
    // 初始化时暴露场景和渲染器
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    mixins.forEach((mixin) => mixin(this))
  }

  // 初始化容器
  private initCanvasContainer(canvasContainer: any) {
    this.canvasContainer = canvasContainer;
    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );

    this.renderer.setSize(this.width, this.height);
    this.camera.lookAt(0, 0, 0);
    this.camera.position.copy(this.defaultCameraPosition);

    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controller.enablePan = false
    this.canvasContainer.appendChild(this.renderer.domElement);
    this.resizeObserver = new ResizeObserver(
      debounce(() => {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      }, 10)
    );
    this.resizeObserver.observe(canvasContainer);
    this.initClickEvent();
    this.initMousePositionHandler();
  }

  // 记录已渲染的帧数
  public frameCount = 0;

  private doRender() {
    requestAnimationFrame(this.doRender.bind(this));
    this.frameCount++;
    this.execAnimation();
    this.renderer.render(this.scene, this.camera);
  }

  isMounted = false;

  public render(target: any) {
    if (this.isMounted) {
      return;
    }
    this.initCanvasContainer(target);
    this.doRender();
    this.isMounted = true;
  }

  // 设置背景颜色
  public setBgColor(color: any, alpha = 1) {
    this.renderer.setClearColor(color, alpha);
  }

  // 设置透明度
  public setBgAlpha(alpha: any) {
    this.renderer.setClearAlpha(alpha);
  }

  // 设置 css 背景
  public setCssBg(background: any) {
    this.canvasContainer.style.background = background;
  }

  // 主模型
  mainModel: any = null;
  // 主网格
  mainMesh: any = null;

  // 寻找模型中的网格
  private findMainMesh(gltf) {
    let mainMesh = null;
    gltf.scene.traverse((child) => {
      if (child.isMesh && !mainMesh) {
        mainMesh = child;
      }
    });
    return mainMesh;
  }

  gltf: any = null;

  baseModelUrl:any = null

  public async setMainModel(url: any) {
    this.loading.value = true;
    this.removeMainModel();
    let gltf: any = await gltfLoader(url);
    this.mainModel = gltf;
    this.baseModelUrl = url
    this.initModelPosition();
    this.scene.add(gltf.scene);
    this.mainMesh = this.findMainMesh(gltf);
    this.loading.value = false;
  }

  // 移除主模型
  public removeMainModel() {
    if (!this.mainModel) {
      return;
    }
    this.scene.remove(this.mainModel.scene);
    this.mainMesh = null;
    this.mainModel = null;
  }

  // 模型居中和调整尺寸
  private initModelPosition(flag = 1.5) {
    let object = this.mainModel.scene;
    // 先处理尺寸，再居中
    const sizeBox = new Box3().setFromObject(object);
    let size = new Vector3();
    sizeBox.getSize(size);
    let length = size.length();
    object.scale.set(flag / length, flag / length, flag / length);
    const centerBox = new Box3().setFromObject(object);
    const center = centerBox.getCenter(new Vector3());
    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;
  }

  // 添加环境光
  public addAmientLight(color: any, intensity: any) {
    this.scene.add(new AmbientLight(color, intensity));
  }

  public addDirectionalLight(
    color: any,
    intensity: any,
    x: any,
    y: any,
    z: any
  ) {
    var light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  // click 事件只会在渲染后触发
  private _onClickCbs = new Set();
  public onClick(cb: any) {
    this._onClickCbs.add(cb);
  }

  private initClickEvent() {
    // 禁止滑动触发点击事件
    let mousedownX = null;
    let mousedownY = null;
    let radius = 5;

    this.canvasContainer.addEventListener("mousedown", (event: any) => {
      mousedownX = event.offsetX;
      mousedownY = event.offsetY;
    });

    this.canvasContainer.addEventListener("mouseup", (event: any) => {
      let mouseupX = event.offsetX;
      let mouseupY = event.offsetY;
      if (
        Math.abs(mousedownX - mouseupX) <= radius &&
        Math.abs(mousedownY - mouseupY) <= radius
      ) {
        // 确定 点击
        this._onClickCbs.forEach((cb: any) => cb.call(this, this));
      }
    });
  }

  // 保存鼠标坐标信息
  private x = null;
  private y = null;
  private initMousePositionHandler() {
    const { x, y } = useMouse();
    this.x = x;
    this.y = y;
  }

  public onMainModelClick(cb) {
    this.onClick(() => {
      if (!this.mainModel) {
        return;
      }
    });
  }

   

  decalControllers:any = []

  // 进行贴图
  stickOnMousePosition(img) {
    var decal = new DecalController(this,img)
    decal.create()
    this.decalControllers.push(decal)
  }


  // 实时保存所有贴纸
  public stickers = reactive([]);

  // 恢复模型模型位置
  resetPosition() {
    this.camera.position.copy(this.defaultCameraPosition);
    this.controller.update();
  }

  // 执行动画

  animate = false;

  execAnimation() {
    if (!this.mainModel || !this.animate) {
      return;
    }
    this.mainModel.scene.rotation.y += 0.008;
  }


  // 导出 1stf 格式化信息

  parse1stf(){

  }

  getScreenShotFile(){
    this.renderer.render(this.scene, this.camera); // 截取会出现白图片
    var base64 = this.renderer.domElement.toDataURL("image/png"); // base64
    return base64ToFile(base64);
  }

  // 导出 1stf 格式化信息
  exportTo1stf = null
}





