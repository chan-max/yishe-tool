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
    RepeatWrapping,
    PlaneGeometry,
    PCFSoftShadowMap,
    EquirectangularReflectionMapping
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
import { currentModelController, isUsingClickDelaySticker, clickDelaySticker, viewDisplayController, currentCanvasBackgroundImageId, builtInCanvasBackgroundImages } from '@/components/design/store'
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
import { CameraController } from "./cameraController";

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
            textureInfo: null, // 材质信息就是贴纸信息
            metalness: 0,    // 金属
            roughness: .7,   // 粗糙度
            textureRepeat: 2,
        },
        // 画布背景色
        canvasBackground: {
            color: '#eee',
            opacity: 1
        }
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
    // 地面平面
    private groundPlane: any = null;

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


    cameraController = null

    constructor(opts = {}) {
        mixins.forEach((mixin) => mixin(this));

        this.renderer = new WebGLRenderer({
            antialias: true,
        });
        currentModelController.value = this;
        window.mc = this

        this.renderer.setPixelRatio(window.devicePixelRatio)
        // 启用阴影渲染器，但不添加地面阴影
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        // 初始化时暴露场景和渲染器
        this.meta = meta
        this.mode = "mb"
        this.isMobile = true

        this.cameraController = new CameraController(this)
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


    // 地面阴影配置
    private shadowConfig = {
        enabled: false,
        groundPlane: null,
        directionalLight: null,
        groundSize: 10,
        groundPosition: -0.5,
        lightPosition: new Vector3(5, 5, 5),
        lightIntensity: 1,
        shadowMapSize: 1024
    }

    // 启用/禁用地面阴影
    public setGroundShadow(enabled: boolean) {
        this.shadowConfig.enabled = enabled;
        
        if (enabled) {
            this.addGroundPlane();
            this.addShadowLight();
        } else {
            this.removeGroundPlane();
            this.removeShadowLight();
        }
    }

    // 添加地面平面
    private addGroundPlane() {
        if (this.shadowConfig.groundPlane) {
            this.scene.remove(this.shadowConfig.groundPlane);
        }

        const groundGeometry = new PlaneGeometry(
            this.shadowConfig.groundSize, 
            this.shadowConfig.groundSize
        );
        const groundMaterial = new MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.shadowConfig.groundPlane = new Mesh(groundGeometry, groundMaterial);
        this.shadowConfig.groundPlane.rotation.x = -Math.PI / 2;
        this.shadowConfig.groundPlane.position.y = this.shadowConfig.groundPosition;
        this.shadowConfig.groundPlane.receiveShadow = true;
        
        this.scene.add(this.shadowConfig.groundPlane);
    }

    // 移除地面平面
    private removeGroundPlane() {
        if (this.shadowConfig.groundPlane) {
            this.scene.remove(this.shadowConfig.groundPlane);
            this.shadowConfig.groundPlane = null;
        }
    }

    // 添加阴影光源
    private addShadowLight() {
        if (this.shadowConfig.directionalLight) {
            this.scene.remove(this.shadowConfig.directionalLight);
        }

        const directionalLight = new DirectionalLight(
            0xffffff, 
            this.shadowConfig.lightIntensity
        );
        directionalLight.position.copy(this.shadowConfig.lightPosition);
        directionalLight.castShadow = true;
        
        // 设置阴影属性
        directionalLight.shadow.mapSize.width = this.shadowConfig.shadowMapSize;
        directionalLight.shadow.mapSize.height = this.shadowConfig.shadowMapSize;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        
        this.shadowConfig.directionalLight = directionalLight;
        this.scene.add(directionalLight);
    }

    // 移除阴影光源
    private removeShadowLight() {
        if (this.shadowConfig.directionalLight) {
            this.scene.remove(this.shadowConfig.directionalLight);
            this.shadowConfig.directionalLight = null;
        }
    }

    // 正式执行渲染
    public render(target: any) {
        if (this.isMounted) {
            return;
        }

        this.initCanvasContainer(target);

        // 设置初始背景色
    

        if (currentOperatingBaseModelInfo.value?.url) {
            this.setMainModel(currentOperatingBaseModelInfo.value?.url);
        }

        // 初始化HDR环境
        initHdr(this.renderer, this.scene)

        // 设置默认背景

        // this.setCanvasBackground('#eee', 1);

        if(currentCanvasBackgroundImageId.value){
            const selectedImage = builtInCanvasBackgroundImages.value.find(item => item.id === currentCanvasBackgroundImageId.value);
            if(selectedImage && selectedImage.url){
                this.setBackground(selectedImage.url)
            }
        }

        watch(() => this.state.material, async () => {
            console.log('set material')
            this.setMaterial()
        }, {
            deep: true
        })

        this.execRender();

        this.isMounted = true;
    }


    // 设置材质
    // 当前使用的材质
    public material = null
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

    // 设置背景图片
    public setBackground(imageUrl: string = '') {
        // hdr 和 jpg 的效果是一样的
        console.log('开始加载背景图片:', imageUrl);
        
        const extension = imageUrl.split('.').pop()?.toLowerCase();
        
         if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
            // 使用 TextureLoader 加载普通图片
            const loader = new TextureLoader();
            loader.load(
                imageUrl,
                (texture) => {
                    console.log('普通背景图片加载成功');
                    // 设置背景 为 可动还是固定
                    // texture.mapping = EquirectangularReflectionMapping;
                    this.scene.background = texture;

                },
                (progress) => {
                    console.log('普通图片加载进度:', progress);
                },
                (error) => {
                    console.error('普通背景图片加载失败:', error);
                }
            );
        } else {
            console.error('不支持的背景图片格式:', extension);
        }
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


    clear() {
        this.removeMainModel();
        this.removeDecals()
        this.material = null
        this.state.material.textureInfo = null
    }



    // 根据url 获取模型
    public async setMainModel(url) {

        // if(this.gltf){
        //     return message.info('当前控制台中存在模型，请先清理')
        // }

        // 清除之前的模型和贴纸和材质
        this.clear()
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

        // 设置模型阴影
        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // 添加地面平面
        // this.addGroundPlane();
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
        
        // 如果启用了地面阴影，重新添加地面平面
        if (this.shadowConfig.enabled) {
            this.addGroundPlane();
        }
    }


    modelSizeFlag = 1.5

    // 模型居中和调整尺寸
    private initModelPosition() {
        let object = this.gltf.scene;
        let flag = this.modelSizeFlag
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
        const srcCanvas = this.renderer.domElement;
        // 创建一个新的canvas用于合成水印
        const canvas = document.createElement('canvas');
        canvas.width = srcCanvas.width;
        canvas.height = srcCanvas.height;
        const ctx = canvas.getContext('2d');
        // 先绘制threejs渲染内容
        ctx.drawImage(srcCanvas, 0, 0);
        // 再绘制水印
        const text = 'Presented by 1s.design';
        const fontSize = Math.floor(canvas.height * 0.025); // 更小的字号
        ctx.save();
        ctx.font = `italic bold ${fontSize}px sans-serif`; // 斜体
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'right';
        const padding = fontSize * 1.2; // 更大的边距
        // 阴影效果
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(text, canvas.width - padding, canvas.height - padding);
        ctx.restore();
        // 返回带水印的base64
        return canvas.toDataURL('image/png');
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


    doAnimation() {

        let camera = this.camera

        gsap.to(camera.position, {
            x: 3,
            duration: 2,
            ease: "power1.inOut",
            repeat: 1,
            yoyo: true
        });
    }





    // 是否已使用模式正在渲染
    isUsingModelInfo = false
    /**
     * 根据模型信息初始化当前场景
    */
    async useModelInfo(modelInfo) {

        this.isUsingModelInfo = true
        // 清空当前工作台

        let { baseModelId } = modelInfo

        this.removeMainModel();
        this.removeDecals()

        var baseModel = await Api.getProductModelById(baseModelId)

        currentOperatingBaseModelInfo.value = baseModel

        // 先加载模型在加载贴纸

        await this.setMainModel(baseModel.url)

        // 需要先加载主模型

        // 赋值 状态
        Object.assign(this.state, modelInfo.state)

        // 设置背景色
        if (modelInfo.state?.canvasBackground) {
            this.setCanvasBackground(
                modelInfo.state.canvasBackground.color,
                modelInfo.state.canvasBackground.opacity
            );
        } else {
            this.setCanvasBackground('#eee', 1);
        }

        this.setMaterial()

        let mesh = this.mesh
        let scene = this.scene
        let camera = this.camera

        // 初始化贴纸

        message.loading({
            content: '正在加载贴纸',
            key: 'loadsticker'
        })


        if (modelInfo.decals) {
            await Promise.all(modelInfo.decals.map((decal) => {
                return new Promise(async (resolve, reject) => {

                    var { id, position, rotation, modelValueRotate, modelValueSize, metalness, roughness,isDraft } = decal;

                    if (!id) {
                        return resolve(new Error('贴纸不存在'));
                    }

                    const sticker = isDraft ? await Api.getDraftById(id) : await Api.getStickerById(id)


                    let decalController = new DecalController(sticker)

                    decalController.state.position = new Vector3(position.x, position.y, position.z)
                    decalController.state.rotation = new Euler(rotation.x, rotation.y, rotation.z)
                    decalController.state.modelValueRotate = modelValueRotate
                    decalController.state.modelValueSize = modelValueSize
                    decalController.state.roughness = roughness
                    decalController.state.metalness = metalness

                    await decalController.create()
                    decalController.ensureAdd()
                    resolve(void 0)
                })
            }))

        }

        viewDisplayController.value.showProject = false
        message.success({
            content: '模型加载成功',
            key: 'loadsticker'
        })
        this.isUsingModelInfo = false
    }




    activeMediaRecorder = null


    // 记录所有的录制
    mediaRecorders = shallowRef([])

    isMediaRecording = ref(false)

    startMediaRecord(opts) {
        let $this = this

        $this.isMediaRecording.value = true
        opts = {
            frame: opts.frame || 120, // 提高帧率到120fps
            ...opts
        }

        const canvas = this.renderer.domElement

        const stream = canvas.captureStream(opts.frame);
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
                time: Date.now()
            })

            $this.isMediaRecording.value = false
            message.success('视频录制成功,已自动导出')
            
            // 调用 onStop 回调
            if (opts.onStop) {
                opts.onStop(blob);
            }
        };

        mediaRecorder.start();
    }

    stopMediaRecord() {
        this.activeMediaRecorder?.stop();
        this.activeMediaRecorder = null;
    }

    // 角度配置数组
    angleConfigs = [
        // 正方向
        { name: 'front', label: '正面', description: '模型正前方视角', position: new Vector3(0, 0, 1), group: 'front' },
        { name: 'back', label: '背面', description: '模型正后方视角', position: new Vector3(0, 0, -1), group: 'front' },
        { name: 'left', label: '左侧', description: '模型正左侧视角', position: new Vector3(-1, 0, 0), group: 'front' },
        { name: 'right', label: '右侧', description: '模型正右侧视角', position: new Vector3(1, 0, 0), group: 'front' },
        { name: 'top', label: '顶部', description: '模型正上方视角', position: new Vector3(0, 1, 0), group: 'front' },
        { name: 'bottom', label: '底部', description: '模型正下方视角', position: new Vector3(0, -1, 0), group: 'front' },
        
        // 45度斜角 - 水平面
        { name: 'frontRight', label: '前右', description: '前右45度视角', position: new Vector3(1, 0, 1).normalize(), group: '45deg' },
        { name: 'frontLeft', label: '前左', description: '前左45度视角', position: new Vector3(-1, 0, 1).normalize(), group: '45deg' },
        { name: 'backRight', label: '后右', description: '后右45度视角', position: new Vector3(1, 0, -1).normalize(), group: '45deg' },
        { name: 'backLeft', label: '后左', description: '后左45度视角', position: new Vector3(-1, 0, -1).normalize(), group: '45deg' },
        
        // 45度斜角 - 垂直面
        { name: 'frontTop', label: '前上', description: '前上45度视角', position: new Vector3(0, 1, 1).normalize(), group: '45deg' },
        { name: 'frontBottom', label: '前下', description: '前下45度视角', position: new Vector3(0, -1, 1).normalize(), group: '45deg' },
        { name: 'backTop', label: '后上', description: '后上45度视角', position: new Vector3(0, 1, -1).normalize(), group: '45deg' },
        { name: 'backBottom', label: '后下', description: '后下45度视角', position: new Vector3(0, -1, -1).normalize(), group: '45deg' },
        { name: 'leftTop', label: '左上', description: '左上45度视角', position: new Vector3(-1, 1, 0).normalize(), group: '45deg' },
        { name: 'leftBottom', label: '左下', description: '左下45度视角', position: new Vector3(-1, -1, 0).normalize(), group: '45deg' },
        { name: 'rightTop', label: '右上', description: '右上45度视角', position: new Vector3(1, 1, 0).normalize(), group: '45deg' },
        { name: 'rightBottom', label: '右下', description: '右下45度视角', position: new Vector3(1, -1, 0).normalize(), group: '45deg' },
        
        // 45度斜角 - 三维对角线
        { name: 'frontRightTop', label: '前右上', description: '前右上45度视角', position: new Vector3(1, 1, 1).normalize(), group: 'diagonal' },
        { name: 'frontRightBottom', label: '前右下', description: '前右下45度视角', position: new Vector3(1, -1, 1).normalize(), group: 'diagonal' },
        { name: 'frontLeftTop', label: '前左上', description: '前左上45度视角', position: new Vector3(-1, 1, 1).normalize(), group: 'diagonal' },
        { name: 'frontLeftBottom', label: '前左下', description: '前左下45度视角', position: new Vector3(-1, -1, 1).normalize(), group: 'diagonal' },
        { name: 'backRightTop', label: '后右上', description: '后右上45度视角', position: new Vector3(1, 1, -1).normalize(), group: 'diagonal' },
        { name: 'backRightBottom', label: '后右下', description: '后右下45度视角', position: new Vector3(1, -1, -1).normalize(), group: 'diagonal' },
        { name: 'backLeftTop', label: '后左上', description: '后左上45度视角', position: new Vector3(-1, 1, -1).normalize(), group: 'diagonal' },
        { name: 'backLeftBottom', label: '后左下', description: '后左下45度视角', position: new Vector3(-1, -1, -1).normalize(), group: 'diagonal' },
        
        // 30度斜角 - 水平面
        { name: 'frontRight30', label: '前右30°', description: '前右30度视角', position: new Vector3(Math.cos(Math.PI/6), 0, Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'frontLeft30', label: '前左30°', description: '前左30度视角', position: new Vector3(-Math.cos(Math.PI/6), 0, Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'backRight30', label: '后右30°', description: '后右30度视角', position: new Vector3(Math.cos(Math.PI/6), 0, -Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'backLeft30', label: '后左30°', description: '后左30度视角', position: new Vector3(-Math.cos(Math.PI/6), 0, -Math.sin(Math.PI/6)), group: '30deg' },
        
        // 30度斜角 - 垂直面
        { name: 'frontTop30', label: '前上30°', description: '前上30度视角', position: new Vector3(0, Math.cos(Math.PI/6), Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'frontBottom30', label: '前下30°', description: '前下30度视角', position: new Vector3(0, -Math.cos(Math.PI/6), Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'backTop30', label: '后上30°', description: '后上30度视角', position: new Vector3(0, Math.cos(Math.PI/6), -Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'backBottom30', label: '后下30°', description: '后下30度视角', position: new Vector3(0, -Math.cos(Math.PI/6), -Math.sin(Math.PI/6)), group: '30deg' },
        { name: 'leftTop30', label: '左上30°', description: '左上30度视角', position: new Vector3(-Math.sin(Math.PI/6), Math.cos(Math.PI/6), 0), group: '30deg' },
        { name: 'leftBottom30', label: '左下30°', description: '左下30度视角', position: new Vector3(-Math.sin(Math.PI/6), -Math.cos(Math.PI/6), 0), group: '30deg' },
        { name: 'rightTop30', label: '右上30°', description: '右上30度视角', position: new Vector3(Math.sin(Math.PI/6), Math.cos(Math.PI/6), 0), group: '30deg' },
        { name: 'rightBottom30', label: '右下30°', description: '右下30度视角', position: new Vector3(Math.sin(Math.PI/6), -Math.cos(Math.PI/6), 0), group: '30deg' },
        
        // 60度斜角 - 水平面
        { name: 'frontRight60', label: '前右60°', description: '前右60度视角', position: new Vector3(Math.cos(Math.PI/3), 0, Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'frontLeft60', label: '前左60°', description: '前左60度视角', position: new Vector3(-Math.cos(Math.PI/3), 0, Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'backRight60', label: '后右60°', description: '后右60度视角', position: new Vector3(Math.cos(Math.PI/3), 0, -Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'backLeft60', label: '后左60°', description: '后左60度视角', position: new Vector3(-Math.cos(Math.PI/3), 0, -Math.sin(Math.PI/3)), group: '60deg' },
        
        // 60度斜角 - 垂直面
        { name: 'frontTop60', label: '前上60°', description: '前上60度视角', position: new Vector3(0, Math.cos(Math.PI/3), Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'frontBottom60', label: '前下60°', description: '前下60度视角', position: new Vector3(0, -Math.cos(Math.PI/3), Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'backTop60', label: '后上60°', description: '后上60度视角', position: new Vector3(0, Math.cos(Math.PI/3), -Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'backBottom60', label: '后下60°', description: '后下60度视角', position: new Vector3(0, -Math.cos(Math.PI/3), -Math.sin(Math.PI/3)), group: '60deg' },
        { name: 'leftTop60', label: '左上60°', description: '左上60度视角', position: new Vector3(-Math.sin(Math.PI/3), Math.cos(Math.PI/3), 0), group: '60deg' },
        { name: 'leftBottom60', label: '左下60°', description: '左下60度视角', position: new Vector3(-Math.sin(Math.PI/3), -Math.cos(Math.PI/3), 0), group: '60deg' },
        { name: 'rightTop60', label: '右上60°', description: '右上60度视角', position: new Vector3(Math.sin(Math.PI/3), Math.cos(Math.PI/3), 0), group: '60deg' },
        { name: 'rightBottom60', label: '右下60°', description: '右下60度视角', position: new Vector3(Math.sin(Math.PI/3), -Math.cos(Math.PI/3), 0), group: '60deg' }
    ];

    // 获取所有可用的角度配置
    getAvailableAngles() {
        return this.angleConfigs;
    }

    // 获取角度组配置
    getAngleGroups() {
        return [
            { key: 'front', label: '正方向', description: '前、后、左、右、上、下' },
            { key: '45deg', label: '45度斜角', description: '水平面和垂直面45度视角' },
            { key: '30deg', label: '30度斜角', description: '30度视角组合' },
            { key: '60deg', label: '60度斜角', description: '60度视角组合' },
            { key: 'diagonal', label: '三维对角线', description: '45度三维对角线视角' }
        ];
    }

    // 获取默认选中的角度（前后左右）
    getDefaultSelectedAngles() {
        return ['front', 'back', 'left', 'right'];
    }

    // 导出多角度图片
    async exportMultiAngleImages(angleNames?: string[]) {
        const allAngles = this.getAvailableAngles();
        let anglesToExport = allAngles;

        // 如果传递了角度name数组，则只导出这些角度
        if (Array.isArray(angleNames) && angleNames.length > 0) {
            anglesToExport = allAngles.filter(angle => angleNames.includes(angle.name));
        }

        // 如果没有角度要导出，返回空数组
        if (anglesToExport.length === 0) {
            return [];
        }

        const images = [];
        const originalPosition = this.camera.position.clone();
        const originalRotation = this.camera.rotation.clone();
        const distance = originalPosition.length();

        for (const angle of anglesToExport) {
            // 设置相机位置，保持距离不变
            const newPosition = angle.position.clone().multiplyScalar(distance);
            this.camera.position.copy(newPosition);
            this.camera.lookAt(0, 0, 0);
            
            // 等待一帧以确保渲染完成
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            // 获取截图
            const base64 = this.getScreenshotBase64();
            images.push({
                name: angle.name,
                label: angle.label,
                description: angle.description,
                base64
            });
        }

        // 恢复原始相机位置
        this.camera.position.copy(originalPosition);
        this.camera.rotation.copy(originalRotation);
        this.renderer.render(this.scene, this.camera);

        return images;
    }

    // 下载多角度图片
    async downloadMultiAngleImages(options: {
        angles?: string[], // 指定要导出的角度名称数组
        angleGroups?: string[], // 指定要导出的角度组
        excludeAngles?: string[], // 指定要排除的角度名称数组
        includeAll?: boolean, // 是否包含所有角度（默认true）
        filename?: string // 文件名前缀，默认为 'model'
    } = {}) {
        const images = await this.exportMultiAngleImages(options.angles);
        const filename = options.filename || 'model';
        
        // 下载每个图片
        images.forEach(image => {
            const link = document.createElement('a');
            link.href = image.base64;
            link.download = `${filename}_${image.name}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        return images;
    }

    // 批量下载多角度图片（可选择角度）
    async batchDownloadMultiAngleImages(options: {
        angles?: string[], // 指定要导出的角度名称数组
        angleGroups?: string[], // 指定要导出的角度组
        excludeAngles?: string[], // 指定要排除的角度名称数组
        includeAll?: boolean, // 是否包含所有角度（默认true）
        filename?: string // 文件名前缀，默认为 'model'
    } = {}) {
        const filename = options.filename || 'model';

        try {
            const images = await this.exportMultiAngleImages(options.angles);
            
            // 批量下载
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const link = document.createElement('a');
                link.href = image.base64;
                link.download = `${filename}_${image.name}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 添加小延迟避免浏览器阻止多个下载
                if (i < images.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            return images;
        } catch (error) {
            throw error;
        }
    }

    // 设置画布背景色
    public setCanvasBackground(color: string, opacity: number = 1) {
        this.state.canvasBackground.color = color;
        this.state.canvasBackground.opacity = opacity;
        this.setBgColor(color, opacity);
    }

}



