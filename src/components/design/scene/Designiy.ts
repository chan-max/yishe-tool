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
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce, onWindowResize } from "../utils/utils";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { gltfLoader } from '../../../common/threejsHelper';
import {ref} from 'vue'


export class Designiy {
  // 场景
  public scene: Scene;
  // 渲染器
  public renderer: WebGLRenderer;
  // 摄像机
  private camera: any;
  // 当前画布容器
  private canvasContainer: any;
  // 控制器
  private controler: any;
  // 尺寸侦听器
  private resizeObserver: any;
  // 保存当前鼠标坐标
  public mouse = new Vector2();

  public loading = ref(false)
  
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
  }
  


  private initCanvasContainer(canvasContainer: any) {
    this.canvasContainer = canvasContainer;
    this.camera = new PerspectiveCamera(  75,  this.width / this.height,  0.1,  1000);
    this.renderer.setSize(this.width, this.height);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    this.controler = new OrbitControls(this.camera, this.renderer.domElement);
    this.canvasContainer.appendChild(this.renderer.domElement);
    this.initClickEvent();
    this.initMousemoveEvent();
    this.resizeObserver = new ResizeObserver(debounce(() => {  this.camera.aspect = this.width / this.height;    this.camera.updateProjectionMatrix();   this.renderer.setSize(this.width, this.height); }, 10) )
    this.resizeObserver.observe(canvasContainer);
  }

  // 记录已渲染的帧数
  public frameCount = 0;

  private doRender() {
    requestAnimationFrame(this.doRender.bind(this));
    this.frameCount++;
    this.renderer.render(this.scene, this.camera);
  }

  public render(target: any) {
    this.initCanvasContainer(target);
    this.doRender();
  }

  public setBgColor(color: any) {
    this.renderer.setClearColor(color);
  }

  public setBgAlpha(alpha: any) {
    this.renderer.setClearAlpha(alpha);
  }

  public setCssBg(background: any) {
    this.canvasContainer.style.background = background;
  }


  mainModel: any = null;
  mainMesh: any = null;

  private findMainMesh(gltf) {
    let mainMesh = null;
    gltf.scene.traverse((child) => {
      if (child.isMesh && !mainMesh) {
        mainMesh = child;
      }
    });
    return mainMesh;
  }

  

  public async setMainModel(source: any) {
    this.removeMainModel()
    this.loading.value = true
    let gltf: any = await gltfLoader(source);
    this.initImportedModel(gltf);
    this.scene.add(gltf.scene);
    this.mainModel = gltf;
    this.mainMesh = this.findMainMesh(gltf);
    this.loading.value = false
  }

  public removeMainModel() {
    if(!this.mainModel){
      return
    }
    this.scene.remove(this.mainModel.scene);
    this.mainMesh = null
    this.mainModel = null
  }

  // 模型居中和调整尺寸
  private initImportedModel(gltf) {
    let object = gltf.scene;
    // 先处理尺寸，再居中
    const sizeBox = new Box3().setFromObject(object);
    let size = new Vector3();
    sizeBox.getSize(size);
    let length = size.length();
    object.scale.set(10 / length, 10 / length, 10 / length);
    const centerBox = new Box3().setFromObject(object);
    const center = centerBox.getCenter(new Vector3());
    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;
  }

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
    let mousedownX = null
    let mousedownY = null
    let radius = 5

    this.canvasContainer.addEventListener('mousedown',(event:any) => {
      mousedownX = event.offsetX
      mousedownY = event.offsetY
    })

    this.canvasContainer.addEventListener('mouseup',(event:any) => {
      let mouseupX = event.offsetX
      let mouseupY = event.offsetY
      if(Math.abs(mousedownX - mouseupX) <= radius && Math.abs(mousedownY - mouseupY) <=radius){
        // 确定 点击
        this._onClickCbs.forEach((cb:any) => cb.call(this,this))
      }
    })
  }

  // 保存鼠标坐标信息
  private initMousemoveEvent() {
    this.canvasContainer.addEventListener("mousemove", (event: any) => {
      this.mouse.x = (event.offsetX / this.width) * 2 - 1;
      this.mouse.y = -(event.offsetY / this.height) * 2 + 1;
    });
  }
}
