import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce, onWindowResize } from "../../utils/utils";
export class Designiy {
    scene: Scene
    renderer: WebGLRenderer
    camera: PerspectiveCamera
    container: HTMLElement
    controler: any

    get width() {
        return Number(window.getComputedStyle(this.container).width.slice(0, -2))
    }

    get height() {
        return Number(window.getComputedStyle(this.container).height.slice(0, -2))
    }

    onWindowResize() {
        // 更新画布尺寸
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height)
    }

    constructor(baseOptions: any) {
        const { container } = baseOptions
        this.container = container
        this.scene = new Scene()
        this.renderer = new WebGLRenderer()
        this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer.setSize(this.width, this.height)
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        this.controler = new OrbitControls(this.camera, this.renderer.domElement);
        this.container.appendChild(this.renderer.domElement)
        onWindowResize(debounce(this.onWindowResize.bind(this), 10))
    }



    rendered = false

    private beforeRenderHooks: Array<(args0: Designiy) => any> = []
    beforeRender(hook: (args0: Designiy) => any) {
        this.beforeRenderHooks.push(hook)
    }

    private processBeforeRender() {
        if (this.rendered) {
            return
        }
        this.rendered = true
        this.beforeRenderHooks.forEach((hook: any) => hook.call(this, this));
    }


    frameCount = 0

    public render() {
        !this.rendered && this.processBeforeRender()
        requestAnimationFrame(this.render.bind(this))
        this.frameCount++
        this.renderer.render(this.scene, this.camera)
    }

    setBgColor(color: any) {
        this.renderer.setClearColor(color)
    }

    setBgAlpha(alpha: any) {
        this.renderer.setClearAlpha(alpha)
    }

    setCssBg(background: any) {
        this.container.style.background = background
    }
}