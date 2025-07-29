/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-13 13:25:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-28 08:55:15
 * @FilePath: /1s/src/components/model/gltfViewer/index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { gltfLoader } from "@/common/threejsHelper";
import { format1stf } from "@/api/format";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import Utils from '@/common/utils'

import {
    Box3,
    BoxGeometry,
    BufferGeometry,
    DirectionalLight,
    Euler,
    Float32BufferAttribute,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer,
    PointLight,
    AmbientLight,
    Raycaster,
    AxesHelper,
    Vector2,
    SRGBColorSpace,
    MeshStandardMaterial,
} from "three";

import {
    defineProps,
    ref,
    onMounted,
    render,
    watch,
    nextTick,
    shallowRef,
    defineEmits,
    defineExpose,
} from "vue";

import {
    getStickerById,
    getProductModelById,
    getTextStickerById,
    getDraftById,
} from "@/api";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce } from "@/common/utils/debounce";
import { ModelController } from "@/components/design/core/controller";
import { createMaterialFromOptions, initBasicLight, initHdr } from "@/components/design/core/controllerHelper";

function initImportedModel(gltf) {
    let flag = 1.5;
    let object = gltf.scene;
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

export const useViewer = (gltfViewerRef, props, emits) => {

    if (!Utils.three.isSupport) {
        return {
            isSupport: ref(false)
        }
    }

    const scene = new Scene();

    function startAnimate() {
        animate.value = true;
    }

    function stopAnimate() {
        animate.value = false;
    }

    // 是否执行动画
    const animate = ref(false);

    // 是否加载中
    const loading = ref(false);

    const loadingMessage = ref('加载中...')

    var mesh = null;

    const renderer = new WebGLRenderer({
        alpha: true, // 透明背景
    });

    renderer.setPixelRatio(window.devicePixelRatio)

    // 初始化白色服装专用灯光系统
    function initSceneLight() {
        // 1. 主光源 - 模拟太阳光或主要光源
        const mainLight = new DirectionalLight(0xffffff, 1.6);
        mainLight.position.set(2, 3, 2);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        scene.add(mainLight);
        
        // 2. 填充光 - 减少阴影的硬边
        const fillLight = new DirectionalLight(0xffffff, 1.1);
        fillLight.position.set(-1, 2, -1);
        scene.add(fillLight);
        
        // 3. 环境光 - 提供基础照明
        const ambientLight = new AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        // 4. 顶部光 - 模拟天空光
        const topLight = new DirectionalLight(0xffffff, 1.2);
        topLight.position.set(0, 4, 0);
        scene.add(topLight);
        
        // 5. 前方光 - 确保模型正面明亮
        const frontLight = new DirectionalLight(0xffffff, 0.6);
        frontLight.position.set(0, 1, 2);
        scene.add(frontLight);
        
        // 6. 侧边光 - 增加细节
        const sideLight1 = new DirectionalLight(0xffffff, 0.8);
        sideLight1.position.set(3, 1, 0);
        scene.add(sideLight1);
        
        const sideLight2 = new DirectionalLight(0xffffff, 0.8);
        sideLight2.position.set(-3, 1, 0);
        scene.add(sideLight2);
        
        // 7. 点光源 - 增加局部高光
        const pointLight = new PointLight(0xffffff, 1.5, 12);
        pointLight.position.set(0, 2, 3);
        scene.add(pointLight);
        
        // 8. 暖色调补光 - 模拟室内灯光，但强度较低
        const warmLight = new PointLight(0xfff4e6, 0.4, 8);
        warmLight.position.set(-2, 1, -2);
        scene.add(warmLight);
    }

    initSceneLight();

    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

    camera.lookAt(0, 0, 0);

    camera.position.set(0, 0, 0.7);

    const controller = new OrbitControls(camera, renderer.domElement);

    controller.enablePan = false; // 禁止右键拖拽
    controller.minDistance = 0.5;
    controller.maxDistance = 5;
    controller.enableDamping = true;
    controller.dampingFactor = .1;
    controller.autoRotate = true

    controller.addEventListener('start', function () {
        emits('dragStart')
    });

    async function initModel() {
        emits('beforeLoad')

        const modelInfo = format1stf(props.model);

        if (!modelInfo) {
            return;
        }

        loading.value = true
        loadingMessage.value = '正在获取基础模型信息...'

        var baseModel = modelInfo.fetchResult || await getProductModelById(modelInfo.baseModelId)

        loading.value = false
        loadingMessage.value = ''

        if (props.transparent) {
            renderer.setClearColor(null, 0);
        } else {
            renderer.setClearColor(0xeeeeee, 0);
        }

        let url = Utils.formatUrl(baseModel.url, { nocache: false })

        loading.value = true
        loadingMessage.value = '正在加载模型文件...'

        let gltf: any = await gltfLoader(url);

        loading.value = false
        loadingMessage.value = ''

        let mesher = Utils.three.findMainMeshFromGltfAndMergeGeometries(gltf);

        mesh = mesher.mergedMesh

        // 同步摄像机位置
        if (modelInfo.camera) {
            camera.position.set(
                modelInfo.camera.position.x,
                modelInfo.camera.position.y,
                modelInfo.camera.position.z
            );
            camera.rotation.set(
                modelInfo.camera.rotation.x,
                modelInfo.camera.rotation.y,
                modelInfo.camera.rotation.z
            );
            camera.fov = modelInfo.camera.fov;
            camera.near = modelInfo.camera.near;
            camera.far = modelInfo.camera.far;
        }

        let el = gltfViewerRef.value;

        if (!el) {
            return;
        }

        function resetCameraAspect() {
            let width = Utils.getComputedWidth(el);
            let height = Utils.getComputedHeight(el);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        resetCameraAspect();

        const resizeOb = new ResizeObserver(debounce(resetCameraAspect));

        el && resizeOb.observe(el);

        renderer.setSize(Utils.getComputedWidth(el), Utils.getComputedHeight(el));

        initImportedModel(gltf);

        scene.add(gltf.scene);

        if (modelInfo.state?.material) {
            let material = await createMaterialFromOptions(modelInfo.state.material)
            if (!material) {
                return
            }

            mesh.material = material
        }

        if (modelInfo.decals?.length) {

            loading.value = true
            loadingMessage.value = '正在加载贴纸...'

            await Promise.all(modelInfo.decals.map((decal) => {
                return new Promise(async (resolve) => {
                    try {
                        var { id, position, rotation, size, } = decal;
                        if (!id) return resolve(void 0);

                        loading.value = true;
                        loadingMessage.value = '正在获取贴纸信息...';

                        let sticker;
                        try {
                            sticker = decal.fetchResult || (await getStickerById(id));
                        } catch (e) {
                            console.error('获取贴纸信息失败', e);
                            return resolve(void 0);
                        }

                        var { url } = sticker || {};
                        if (!url) {
                            console.warn('贴纸无图片', sticker);
                            return resolve(void 0);
                        }

                        // 根据模型缩放调整贴纸位置
                        let scaleFactor = 1.0; // 默认缩放因子
                        
                        // 安全地计算缩放因子
                        if (mesh && mesh.geometry) {
                            if (mesh.geometry.boundingSphere && mesh.geometry.boundingSphere.radius) {
                                scaleFactor = 1.5 / mesh.geometry.boundingSphere.radius;
                            } else {
                                // 如果没有boundingSphere，使用boundingBox计算
                                const box = new Box3().setFromObject(mesh);
                                const size = new Vector3();
                                box.getSize(size);
                                const length = size.length();
                                if (length > 0) {
                                    scaleFactor = 1.5 / length;
                                }
                            }
                        }
                        
                        position = new Vector3(
                            position.x * scaleFactor,
                            position.y * scaleFactor,
                            position.z * scaleFactor
                        );

                        // 确保mesh的世界矩阵是最新的
                        mesh.updateMatrixWorld();

                        // 改进的射线检测策略 - 尝试多个方向
                        const directions = [
                            new Vector3(0, -1, 0),  // 向下
                            new Vector3(0, 1, 0),   // 向上
                            new Vector3(1, 0, 0),   // 向右
                            new Vector3(-1, 0, 0),  // 向左
                            new Vector3(0, 0, 1),   // 向前
                            new Vector3(0, 0, -1),  // 向后
                        ];

                        var raycaster = new Raycaster();
                        let validIntersection = null;
                        let finalPosition = position;

                        for (const direction of directions) {
                            raycaster.set(position, direction);
                            const intersects = raycaster.intersectObject(mesh, true);
                            if (intersects.length > 0) {
                                validIntersection = intersects[0];
                                finalPosition = validIntersection.point;
                                break;
                            }
                        }

                        // 如果所有方向都失败，提示错误并跳过
                        if (!validIntersection) {
                            console.error("贴纸位置错误：无法在模型表面找到有效位置", {
                                originalPosition: position,
                                meshName: mesh.name || 'unknown',
                                decalId: id
                            });
                            return resolve(void 0);
                        }

                        rotation = new Euler(rotation.x, rotation.y, rotation.z);
                        size = new Vector3(size.x, size.y, size.z);

                        const textureLoader = new TextureLoader();
                        let imgUrl = Utils.formatUrl(url, { nocache: true });

                        loading.value = true;
                        loadingMessage.value = '正在获取贴纸...';

                        let texture;
                        try {
                            texture = await textureLoader.loadAsync(imgUrl);
                        } catch (e) {
                            console.error('贴纸图片加载失败', e);
                            return resolve(void 0);
                        }

                        texture.colorSpace = SRGBColorSpace;

                        const material = new MeshStandardMaterial({
                            map: texture,
                            transparent: true,
                            depthTest: true,
                            depthWrite: true,
                            polygonOffset: true,
                            polygonOffsetFactor: -1,
                            wireframe: false,
                            metalness: decal.metalness,
                            roughness: decal.roughness,
                        });

                        const decalGeometry = new DecalGeometry(mesh, finalPosition, rotation, size);
                        var decalMesh = new Mesh(decalGeometry, material);
                        scene.add(decalMesh);
                        decalMesh.frustumCulled = false;
                        decalMesh.renderOrder = 1;
                    } catch (e) {
                        console.error('贴纸渲染异常', e);
                    } finally {
                        loading.value = false;
                        loadingMessage.value = '';
                        resolve(void 0);
                    }
                });
            }))
        }

        function render() {
            requestAnimationFrame(render);
            if (animate.value) {
                // controller.autoRotate = true
            } else {
                controller.autoRotate = false
            }
            // 不写这个会导致阻尼感失效
            controller.update()
            renderer.render(scene, camera);
        }

        el.appendChild(renderer.domElement);
        render();
        emits("loaded");
    }

    function screenshot() {
        renderer.render(scene, camera); // 截取会出现白图片
        var img = renderer.domElement.toDataURL("image/png"); // base64
        // var win = window.open("", "_blank");
        // win.document.write('<img src="' + img + '"/>');
        emits("screenshot", img);
    }

    watch(
        () => props.model,
        async () => {
            await nextTick();
            initModel();
        },
        { immediate: true }
    );

    function getScreenshot() {
        renderer.render(scene, camera); // 截取会出现白图片
        return renderer.domElement.toDataURL("image/png");
    }

    return {
        isSupport: ref(true),
        emits,
        loading,
        loadingMessage,
        props,
        startAnimate,
        stopAnimate,
        gltfViewerRef,
        controller,
        getScreenshot
    }
}