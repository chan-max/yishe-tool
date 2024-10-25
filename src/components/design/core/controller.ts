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
    CubeTextureLoader,
    BackSide,
    PointLight,
    MathUtils,
    PMREMGenerator,
    MeshStandardMaterial,
    RepeatWrapping
} from "three";


import { message } from 'ant-design-vue';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce, onWindowResize } from "../utils/utils";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { gltfLoader } from "../../../common/threejsHelper";
import { reactive, ref, shallowReactive, nextTick, shallowRef, watch } from "vue";
import { reactify, useDebounceFn, useMouse, useMouseInElement } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { base64ToFile } from "@/common/transform/base64ToFile";
import { DecalController } from "./decalController";
import { _1stfExporterMixin } from "./1stf";
import { currentModelController, isUsingClickDelaySticker, clickDelaySticker, viewDisplayController } from '@/components/design/store'
import { eventMixin } from "./event";
import { meta } from '../meta'
import { Base } from './base'
import { gsap } from 'gsap';
import { saveAs } from 'file-saver';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import WebGL from 'three/examples/jsm/capabilities/WebGL.js';



import {
    currentOperatingBaseModelInfo,
} from "@/components/design/store.ts";

import Api from '@/api'
import Utils from '@/common/utils'

import { createMaterialFromOptions, initBasicLight, initHdr } from './controllerHelper'


const mixins = [
    _1stfExporterMixin,
    eventMixin
];

export function createModelController(opts) {
    return new ModelController(opts)
}

export class ModelController {

    // 模式 , 暂时不支持 mb
    mode = 'pc' // pc 或 mb

    // 是否在移动端
    isMobile = false

    // 元数据
    meta: any = meta

    /**
     *  用于保存当前所有状态的仓库
    */
    state = reactive({
        currentOperatingBaseModelInfo: null, // 当前操作的模型信息
        //  主模型的材质
        material: {
            textureInfo: null,
            metalness: 0,    // 金属
            roughness: .7,   // 粗糙度
            textureRepeat: 2,
        },
    })

    // 场景
    public scene: Scene = new Scene();
    // 渲染器
    public renderer: WebGLRenderer = null
    // 摄像机
    public camera: any;
    // 当前画布容器
    private canvasContainer: any;
    // 控制器
    public controller: any;
    // 尺寸侦听器
    public resizeObserver: any;

    // 记录原始摄像机位置 , 正前方
    public defaultCameraPosition = new Vector3(0, 0, 1);

    // 天空盒子背景是否随着模型移动
    private backgroundFixed = true

    private background: any = null

    public initialCameraPosition = new Vector3();


    // 是否在模型上点击, 用于在点击事件中判断
    public get isMeshClicked() {
        return !!this.getClickIntersects().length
    }

    // 获取点击焦点
    public getClickIntersects() {
        const raycaster = new Raycaster();
        raycaster.setFromCamera(this.mouse.clone(), this.camera);
        const intersects = raycaster.intersectObject(this.mesh, true);
        return intersects
    }

    // 保存当前鼠标坐标
    private _mouse = new Vector2();

    public get mouse() {
        this._mouse.x = (this.x.value / this.width) * 2 - 1;
        this._mouse.y = -(this.y.value / this.height) * 2 + 1;
        return this._mouse;
    }

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

    constructor(opts = {}) {

        mixins.forEach((mixin) => mixin(this));

        this.renderer = new WebGLRenderer({
            antialias: true,
        });
        currentModelController.value = this;
        window.mc = this

        this.renderer.setPixelRatio(window.devicePixelRatio)
        // 初始化时暴露场景和渲染器

        this.meta = meta
        this.mode = "mb"
        this.isMobile = true

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
        this.scene.add(this.camera);

        this.renderer.setSize(this.width, this.height);
        this.camera.lookAt(0, 0, 0);

        this.controller = new OrbitControls(this.camera, this.renderer.domElement);
        this.controller.minDistance = 0.5
        this.controller.maxDistance = 3
        this.controller.enablePan = false

        this.controller.enableDamping = true
        this.controller.dampingFactor = 0.1;

        this.camera.position.copy(this.defaultCameraPosition);
        this.canvasContainer.appendChild(this.renderer.domElement);
        this.resizeObserver = new ResizeObserver(
            () => {
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.width, this.height);
            }
        );
        this.resizeObserver.observe(canvasContainer);
        this.initClickEvent();
        this.initMousemoveEvent();
        this.initMousePositionHandler(this.canvasContainer);
    }

    // 记录已渲染的帧数
    public frameCount = 0;

    private execRender() {
        requestAnimationFrame(this.execRender.bind(this));

        // 记录渲染帧数
        this.frameCount++;

        // 执行动画
        this.execAnimation();

        // 处理背景相关
        if (this.background && this.backgroundFixed) {
            // 这样可以让背景不随着模型缩放
            // this.background.position.copy(this.camera.position)
        }

        this.controller?.update();

        this.renderer.render(this.scene, this.camera);
    }

    public isMounted = false;


    // 正式执行渲染
    public render(target: any) {
        if (this.isMounted) {
            return;
        }
        this.initCanvasContainer(target);
        // initBasicLight(this.scene)

        // 先不设置 bg ，需要保留无背景
        this.setBgColor('#eee', 0)

        if (currentOperatingBaseModelInfo.value?.url) {
            this.setMainModel(currentOperatingBaseModelInfo.value?.url);
        }

        initHdr(this.renderer, this.scene)

        watch(() => this.state.material, async () => {
            this.setMaterial()
        }, {
            deep: true
        })

        this.execRender();

        this.isMounted = true;
    }

    async setMaterial() {
        let material = await createMaterialFromOptions(this.state.material)

        this.material = material
        if (this.mesh) {
            this.mesh.material = material
        }
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
    gltf: any = null;
    // 主网格
    mesh: any = null;

    group = null

    baseModelUrl: any = null;


    removeDecals() {
        for (let i = this.decalControllers.length; i > 0; i--) {
            this.decalControllers[i - 1].remove()
        }
    }

    // 调用钩子函数
    callHook(hook) {
        if (hook && typeof hook == 'function') {
            hook.call(this)
        }
    }

    public async setMainModel(url) {

        // if(this.gltf){
        //     return message.info('当前控制台中存在模型，请先清理')
        // }

        // 清除之前的模型和贴纸和材质
        this.removeMainModel();
        this.removeDecals()
        this.material = null
        this.state.material.textureInfo = null

        this.callHook(this.meta.onMainModelLoading)

        try {
            this.gltf = await gltfLoader(url);
            this.callHook(this.meta.onMainModelLoaded)

            // 防止先设置材质但模型还没加载完成的情况
            this.setMaterial()
        } catch (e) {
            this.callHook(this.meta.onMainModelLoadedError)
            return
        }

        // 合并当前模型
        let mesher = Utils.three.findMainMeshFromGltfAndMergeGeometries(this.gltf);
        this.mesh = mesher.mergedMesh

        // this.mesh = Utils.three.findMainMeshFromGltf(this.gltf);

        this.initModelPosition();

        this.initialCameraPosition.copy(this.camera.position);

        // 这个顺序很重要
        this.scene.add(this.gltf.scene);
        this.doOpenAnimation()
    }


    clearAllMeshes(scene) {
        // 创建一个数组来存储要删除的网格
        const meshesToRemove = [];

        // 遍历场景中的所有对象
        scene.traverse((object) => {
            if (object.isMesh) {
                // 将网格添加到待删除数组
                meshesToRemove.push(object);
            }
        });

        // 遍历待删除数组，释放内存并从场景中移除
        meshesToRemove.forEach((mesh) => {
            // 释放几何体和材质
            if (mesh.geometry) {
                mesh.geometry.dispose();
            }
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(material => {
                        material.dispose();
                    });
                } else {
                    mesh.material.dispose();
                }
            }
            // 从场景中移除网格对象
            scene.remove(mesh);
        });
    }


    // 移除主模型
    public removeMainModel() {
        if (!this.gltf) {
            return;
        }

        const modelToRemove = this.scene.getObjectByName(this.gltf.scene.name);
        if (modelToRemove) {
            this.scene.remove(modelToRemove);
        }

        this.scene.remove(this.gltf.scene);
        this.clearAllMeshes(this.scene)
        this.mesh = null;
        this.gltf = null;
    }

    // 模型居中和调整尺寸
    private initModelPosition() {
        let object = this.gltf.scene;
        let flag = 1
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
        const _this = this
        this._onClickCbs.add(cb);
        return () => _this._onClickCbs.delete(cb)
    }



    // 鼠标移动
    private _onMousemove = new Set();
    public onMousemove(cb: any) {
        this._onMousemove.add(cb);
    }

    private initMousemoveEvent() {

        let callback = useDebounceFn((event: any) => {
            this._onMousemove.forEach((cb: any) => cb.call(this, this));
        }, 11)

        this.canvasContainer.addEventListener("mousemove", callback);
    }

    private initClickEvent() {
        // 禁止滑动触发点击事件
        let mousedownX = null;
        let mousedownY = null;
        let radius = 3;

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
    private initMousePositionHandler(target = document.body) {
        const { x, y, elementX, elementY } = useMouseInElement(target);
        this.x = elementX;
        this.y = elementY;
    }

    // 保存所有的贴纸
    decalControllers: any = shallowReactive([]);

    // 进行贴图
    async stickToMousePosition(info, cb) {
        const decal = new DecalController(info)
        await decal.stickToMousePosition(cb)
    }


    // 添加延迟点击贴纸
    addClickDelaySticker(stickerInfo) {
        isUsingClickDelaySticker.value = true
        clickDelaySticker.value = stickerInfo

        const remove = this.onClick(async () => {
            if (this.isMeshClicked) {
                const decal = new DecalController({
                    ...stickerInfo
                })
                await decal.stickToMousePosition()
                isUsingClickDelaySticker.value = false
                clickDelaySticker.value = null
                remove()
            } else {
                // 给点提示
                return
            }
        })

        this.callHook(this.meta.onClickDelayStickerCreate)
        document.body.click()
    }

    // 恢复模型模型位置
    resetPosition() {
        this.camera.position.copy(this.defaultCameraPosition);
        this.controller.update();
    }


    // 执行动画

    animate = false;

    execAnimation() {
        if (!this.gltf || !this.animate) {
            return;
        }
        this.controller.update();
    }

    // 解析 1stf 格式化信息 ， 并初始化系统
    parse1stf() {
    }

    getScreenShotFile() {
        this.renderer.render(this.scene, this.camera); // 截取会出现白图片
        var base64 = this.renderer.domElement.toDataURL("image/png"); // base64
        return base64ToFile(base64);
    }

    // 导出 1stf 格式化信息
    exportTo1stf = null;

    getScreenshotBase64() {
        this.renderer.render(this.scene, this.camera); // 截取会出现白图片
        return this.renderer.domElement.toDataURL("image/png");
    }

    downloadScreenshot() {
        let base64 = this.getScreenshotBase64()
        let file = base64ToFile(base64)
        let a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = file.name
        a.click()
    }


    // 上一步
    prevStep(step = 1) {

    }

    // 下一步
    nextStep(step = 1) {

    }

    // 操作队列

    operationQuene = shallowReactive([])


    setCameraPosition(x, y, z) {
        x && (this.camera.position.x = x)
        y && (this.camera.position.y = y)
        z && (this.camera.position.z = z)
    }

    lookFront() {
        this.camera.position.copy(this.initialCameraPosition)
    }

    lookBack() {
        let v = new Vector3(this.initialCameraPosition.x, this.initialCameraPosition.y, -this.initialCameraPosition.z)
        this.camera.position.copy(v)
    }

    lookTop() {

    }

    lookBottom() {

    }

    lookLeft() {

    }

    lookRight() {

    }

    getFullViewImages() {

    }


    getRandomPosition() {
        // 随机选取一个面
        let geometry = this.mesh.geometry;
        let position = geometry.attributes.position;
        let randomIndex = Math.floor(Math.random() * position.count);
        let randomPoint = new Vector3();
        randomPoint.fromBufferAttribute(position, randomIndex);
        this.mesh.updateMatrixWorld();  // 更新模型的世界矩阵
        randomPoint.applyMatrix4(this.mesh.matrixWorld);


        // const copy = intersects[0].face.normal.clone();
        // copy.transformDirection(this.parentMesh.matrixWorld);
        // copy.add(position);


        // const helper = new Object3D();
        // helper.position.copy(position);
        // helper.lookAt(copy);
        // let rotation = helper.rotation;

        return {
            position: randomPoint,
            rotation: new Vector3(0, 0, 0)
        }
    }



    // 打开模型的动画
    doOpenAnimation() {
        this.camera.position.set(2 * Math.random(), 2 * Math.random(), 2 * Math.random())
        gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: 1,
            duration: 1, // 动画持续时间（秒）
            ease: "back.out", // 缓动函数，使动画更自然
            onUpdate: () => {
                this.camera.lookAt(this.scene.position);
            }
        });
    }



    /**
     * 根据模型信息初始化当前场景
    */
    async useModelInfo(modelInfo) {

        // 清空当前工作台

        let { baseModelId } = modelInfo

        this.removeMainModel();
        this.removeDecals()

        var baseModel = await Api.getProductModelById(baseModelId)

        currentOperatingBaseModelInfo.value = baseModel

        // 先加载模型在加载贴纸
        await this.setMainModel(baseModel.url)

        // 需要先加载主模型

        Object.assign(this.state, modelInfo.state)

        let mesh = this.mesh
        let scene = this.scene
        let camera = this.camera

        // 初始化贴纸
        if (modelInfo.decals) {
            await Promise.all(modelInfo.decals.map((decal) => {
                return new Promise(async (resolve, reject) => {

                    var { id, position, rotation, ruleSize, modelValueRotate, modelValueSize } = decal;

                    if (!id) {
                        return resolve(new Error('贴纸不存在'));
                    }

                    const sticker = await Api.getStickerById(id)

                    let decalController = new DecalController(sticker)

                    decalController.state.position = new Vector3(position.x, position.y, position.z)
                    decalController.state.rotation = new Euler(rotation.x, rotation.y, rotation.z)
                    decalController.state.ruleSize = ruleSize
                    decalController.state.ruleSize = ruleSize
                    decalController.state.modelValueRotate = modelValueRotate
                    decalController.state.modelValueSize = modelValueSize

                    await decalController.create()
                    decalController.ensureAdd()
                    resolve(void 0)
                })
            }))
        }

        viewDisplayController.value.showProject = false
        message.success('模型加载成功')
    }




    activeMediaRecorder = null

    mediaRecorders = shallowRef([])

    startMediaRecord() {
        let $this = this
        const canvas = this.renderer.domElement

        const stream = canvas.captureStream(30); // 每秒30帧
        const mediaRecorder = this.activeMediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = function (event) {
            chunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
            const blob = new Blob(chunks, { type: 'video/webm' });
            let file = new File([blob], 'video', { type: 'video/webm' })
            const url = URL.createObjectURL(file);

            saveAs(url)
            $this.mediaRecorders.value.push({
                file: file,
            })
            message.success('视频录制成功,已自动导出')
            // 可以在这里下载或播放视频
        };

        mediaRecorder.start();
        // 停止录制
    }

    stopMediaRecord() {
        this.activeMediaRecorder.stop();
        this.activeMediaRecorder = null;
    }



    // 设置材质

    // 当前使用的材质
    material = null





}


