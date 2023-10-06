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
  Texture
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce, onWindowResize } from "./utils/utils";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { gltfLoader, textureLoader } from '../../common/threejsHelper';
import { ref } from 'vue'
import { useMouse } from "@vueuse/core";
import { ElMessage } from "element-plus";


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
  private _mouse = new Vector2();

  // 记录原始摄像机位置
  public defaultCameraPosition= new Vector3(0,0.2,1)

  public get mouse() {
    this._mouse.x = (this.x.value / this.width) * 2 - 1;
    this._mouse.y = -(this.y.value / this.height) * 2 + 1;
    return this._mouse
  }

  // 是否在加载模型
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


  // 初始化容器
  private initCanvasContainer(canvasContainer: any) {
    this.canvasContainer = canvasContainer;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

    this.renderer.setSize(this.width, this.height);
    this.camera.lookAt(0, 0, 0);
    this.camera.position.copy(this.defaultCameraPosition);

    this.controler = new OrbitControls(this.camera, this.renderer.domElement);
    this.controler.enablePan = false
    this.canvasContainer.appendChild(this.renderer.domElement);
    this.resizeObserver = new ResizeObserver(debounce(() => { this.camera.aspect = this.width / this.height; this.camera.updateProjectionMatrix(); this.renderer.setSize(this.width, this.height); }, 10))
    this.resizeObserver.observe(canvasContainer);
    this.initClickEvent();
    this.initMousePositionHandler();
  }


  // 记录已渲染的帧数
  public frameCount = 0;


  private doRender() {
    requestAnimationFrame(this.doRender.bind(this));
    this.frameCount++;
    this.execAnimation()
    this.renderer.render(this.scene, this.camera);
  }


  isMounted = false

  public render(target: any) {
    if(this.isMounted){
      return
    }
    this.initCanvasContainer(target);
    this.doRender();
    this.isMounted = true
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


  gltf:any = null

  public async setMainModel(url: any) {
    this.loading.value = true
    this.removeMainModel()
    let gltf: any = await gltfLoader(url);
    this.mainModel = gltf;
    this.initModelPosition();
    this.scene.add(gltf.scene);
    this.mainMesh = this.findMainMesh(gltf);
    this.loading.value = false
  }

  // 移除主模型
  public removeMainModel() {
    if (!this.mainModel) {
      return
    }
    this.scene.remove(this.mainModel.scene);
    this.mainMesh = null
    this.mainModel = null
  }

  // 模型居中和调整尺寸
  private initModelPosition( flag = 1) {
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
    let mousedownX = null
    let mousedownY = null
    let radius = 5

    this.canvasContainer.addEventListener('mousedown', (event: any) => {
      mousedownX = event.offsetX
      mousedownY = event.offsetY
    })

    this.canvasContainer.addEventListener('mouseup', (event: any) => {
      let mouseupX = event.offsetX
      let mouseupY = event.offsetY
      if (Math.abs(mousedownX - mouseupX) <= radius && Math.abs(mousedownY - mouseupY) <= radius) {
        // 确定 点击
        this._onClickCbs.forEach((cb: any) => cb.call(this, this))
      }
    })
  }

  // 保存鼠标坐标信息
  private x = null
  private y = null
  private initMousePositionHandler() {
    const { x, y } = useMouse();
    this.x = x
    this.y = y
  }

  public onMainModelClick(cb) {
    this.onClick(() => {
      if (!this.mainModel) {
        return
      }
    })
  }


  private skybox = null

  removeSkybox() {
    if (this.skybox) {
      this.scene.remove(this.skybox)
    }
  }

  // 球形天空盒子
  async setSkybox(source) {
    this.removeSkybox()

    // 方形天空盒子
    if (Array.isArray(source)) {
      let textures = await Promise.all(source.map(textureLoader))
      let materials = textures.map((texture: any) => new MeshBasicMaterial({ map: texture, side: DoubleSide }))
      let skybox = new Mesh(new BoxGeometry(100, 100, 100), materials)
      this.scene.add(skybox)
      this.skybox = skybox
      return
    }

    // 球形天空盒子
    if (source.endsWith('.jpg')) {
      const texture: any = await textureLoader(source)
      const geometry = new SphereGeometry(100, 100, 100);
      const material = new MeshBasicMaterial({
        side: DoubleSide,
        map: texture
      });
      const skybox = new Mesh(geometry, material);
      this.scene.add(skybox);
      this.skybox = skybox
      return
    }

    // 场景天空盒子
    if (source.endsWith('.glb')) {
    }
  }


  // 进行贴图
  stick(img){
    let mesh = this.mainMesh;

    if (!mesh) {
      ElMessage.info('please select model before stick')
      return;
    } 
  
    const aspectRatio = img.width / img.height;
  
    let raycaster = new Raycaster();
  
    raycaster.setFromCamera(this.mouse, this.camera);
  
    const intersects = raycaster.intersectObject(mesh, true);
  
    if (intersects.length > 0) {
      var position = intersects[0].point;
      var size = new Vector3(0.1, 0.1 / aspectRatio, 0.1);
      var n = intersects[0].face.normal.clone();
      n.transformDirection(mesh.matrixWorld);
      n.add(intersects[0].point);
      let helper = new Object3D();
      helper.position.copy(intersects[0].point);
      helper.lookAt(n);
      let euler = helper.rotation;
      var decalGeometry = new DecalGeometry(mesh, position, euler, size);
  
      let texture = new Texture(img);
      texture.needsUpdate = true;
      var decal = new Mesh(
        decalGeometry,
        new MeshBasicMaterial({ map: texture, transparent: true })
      );
      this.scene.add(decal);
    }
  }

  // 恢复模型模型位置
  resetPosition(){
    this.camera.position.copy(this.defaultCameraPosition)
    this.controler.update()
  }


  // 执行动画

  animate = false

  execAnimation(){
    if(!this.mainModel || !this.animate){
      return
    }
    this.mainModel.scene.rotation.y += 0.008
  }
}


