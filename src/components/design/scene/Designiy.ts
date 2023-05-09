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
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce, onWindowResize } from "../utils/utils";

export class Designiy {
  public scene: Scene;
  public renderer: WebGLRenderer;
  private camera: any;
  private container: any;
  private controler: any;

  private resizeObserver: any;

  private get width() {
    return Number(window.getComputedStyle(this.container).width.slice(0, -2));
  }

  private get height() {
    return Number(window.getComputedStyle(this.container).height.slice(0, -2));
  }

  constructor() {
    // 初始化时暴露场景和渲染器
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
  }

  private initContanier(container: any) {
    this.container = container;
    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.renderer.setSize(this.width, this.height);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    this.controler = new OrbitControls(this.camera, this.renderer.domElement);
    this.container.appendChild(this.renderer.domElement);

    this.resizeObserver = new ResizeObserver(
      debounce(() => {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      }, 10)
    );
    this.resizeObserver.observe(container);
  }

  public frameCount = 0;

  private doRender() {
    requestAnimationFrame(this.doRender.bind(this));
    this.frameCount++;
    this.renderer.render(this.scene, this.camera);
  }

  public render(target: any) {
    this.initContanier(target);
    this.doRender();
  }

  public setBgColor(color: any) {
    this.renderer.setClearColor(color);
  }

  public setBgAlpha(alpha: any) {
    this.renderer.setClearAlpha(alpha);
  }

  public setCssBg(background: any) {
    this.container.style.background = background;
  }

  public load(source: any) {
    const loader = new GLTFLoader();
    let isUrl = source.startsWith("http") || source.startsWith("https");
    // 默认引入 piblic/model 下的模型
    let sourceUrl = isUrl ? source : "model/" + source;
    return new Promise((resolve: any) => {
      loader.load(sourceUrl, (gltf) => {
        resolve(gltf);
      });
    });
  }

  private addedModelMap: Record<string, any> = {};

  public async addModel(source: any) {
    let gltf: any = await this.load(source);
    this.scene.add(gltf.scene);
    this.addedModelMap[source] = gltf;
    this.initImportedModel(gltf);
  }

  // 模型居中
  private initImportedModel(gltf) {
    let object = gltf.scene;

    // 先处理尺寸，再居中
    const box = new Box3().setFromObject(object);
    let size = new Vector3();
    box.getSize(size);
    let length = size.length()
    object.scale.set(10/length,10/length,10/length);


    const centerBox = new Box3().setFromObject(object);

    const center = centerBox.getCenter(new Vector3());
    
    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

  }

  public removeModel(source: any) {
    let gltf = this.addedModelMap[source];
    this.scene.remove(gltf.scene);
    this.addedModelMap[source] = null;
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
}
