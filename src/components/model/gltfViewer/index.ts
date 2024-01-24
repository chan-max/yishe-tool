/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-13 13:25:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 05:19:00
 * @FilePath: /1s/src/components/model/gltfViewer/index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { gltfLoader } from "@/common/threejsHelper";
import { format1stf } from "@/api/format";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
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
    getBaseModel,
    getImage,
    getImageById,
    getBaseModelById,
    getTextStickerById,
} from "@/api";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { debounce } from "@/common/utils/debounce";


const getWidth = (el) => {
    if (!el) {
        return;
    }
    return Number(window.getComputedStyle(el).width.slice(0, -2));
};
const getHeight = (el) => {
    if (!el) {
        return;
    }
    return Number(window.getComputedStyle(el).height.slice(0, -2));
};

function initImportedModel(gltf) {
    let flag = 1;
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



export const useViewer = (gltfViewerRef,props,emits) => {
    const scene = new Scene();

    function startAnimate() {
        animate.value = true;
    }
    
    function stopAnimate() {
        animate.value = false;
    }
    
    // 是否执行动画
    const animate = ref(true);
    
    const loading = ref(false);
    
    var currentMesh = null;

    // 添加环境光
    const ambientLight = new AmbientLight(0xffffff, 0.1); // 设置颜色和强度
    scene.add(ambientLight);
    
    const renderer = new WebGLRenderer({
        alpha: true, // 透明背景
    });
    
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    
    camera.lookAt(0, 0, 0);
    
    camera.position.set(0, 0, 0.7);


    const controller = new OrbitControls(camera, renderer.domElement);
    
    controller.enablePan = false; // 禁止右键拖拽
    controller.minDistance = 0.5;
    controller.maxDistance = 5;
    controller.enableDamping = true;
    controller.dampingFactor = 1;
    controller.autoRotate = true

    controller.addEventListener( 'start', function() { 
        emits('dragStart')
    }); 

    function enableController(){
        controller.enabled = true;
    }

    function disableController(){
        controller.enabled = false;
    }

    async function initModel() {
        emits('beforeLoad')
        const model = format1stf(props.model);
        
        if (!model) {
            return;
        }
    
        loading.value = true;
        var baseModelUrl = model.baseModelUrl;
    
        if (!baseModelUrl && model.baseModelId) {
            baseModelUrl = ((await getBaseModelById(model.baseModelId)) as any).preview_file;
        }
        
        if (props.transparent) {
            renderer.setClearColor(null, 0);
        } else {
            renderer.setClearColor(0xeeeeee, 0);
        }
    
    
        let gltf: any = await gltfLoader(baseModelUrl);
    
        currentMesh = findMainMesh(gltf);
        function findMainMesh(gltf) {
            let mesh = null;
            gltf.scene.traverse((child) => {
                if (child.isMesh && !mesh) {
                    mesh = child;
                }
            });
            return mesh;
        }
    
        // 同步摄像机位置
    
        if (model.camera) {
            camera.position.set(
                model.camera.position.x,
                model.camera.position.y,
                model.camera.position.z
            );
            camera.rotation.set(
                model.camera.rotation.x,
                model.camera.rotation.y,
                model.camera.rotation.z
            );
            camera.fov = model.camera.fov;
            camera.near = model.camera.near;
            camera.far = model.camera.far;
        }
    
        let el = gltfViewerRef.value;
    
        if (!el) {
            return;
        }
    
        function resetCameraAspect() {
            let width = getWidth(el);
            let height = getHeight(el);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    
        resetCameraAspect();
    

        const resizeOb = new ResizeObserver(debounce(resetCameraAspect));
    
        
        el && resizeOb.observe(el);
    
        renderer.setSize(getWidth(el), getHeight(el));
    
        initImportedModel(gltf);
    
        scene.add(gltf.scene);
    
        // 添加环境光
        const ambientLight = new AmbientLight(0xffffff, 0.5); // 设置颜色和强度
        scene.add(ambientLight);
    
        // 添加平行光
        const directionalLight1 = new DirectionalLight(0xffffff, 0.4); // 设置颜色和强度
        directionalLight1.position.set(1, 1, 1); // 设置光源位置
        scene.add(directionalLight1);
    
        // 添加平行光
        const directionalLight2 = new DirectionalLight(0xffffff, 0.4); // 设置颜色和强度
        directionalLight2.position.set(-1, -1, -1); // 设置光源位置
        scene.add(directionalLight2);
    
        // 添加点光源
        const pointLight = new PointLight(0xffffff, 0.4); // 设置颜色和强度
        pointLight.position.set(0, 0, 2); // 设置光源位置
        scene.add(pointLight);
    
        // 初始化贴纸
        if (model.decals) {

            await Promise.all(model.decals.map((decal) => {
                return new Promise(async (resolve, reject) => {

                    var { decalId, position, rotation, size, type } = decal;
    
                    if (!decalId) {
                        return;
                    }
        
                    var url = null;
                    if (type == "image") {
                        const image: any = await getImageById(decalId);
                        if (!image) {
                            return;
                        }
                        url = image.preview_img;
                    }
        
                    if (type == "text") {
                        const text: any = await getTextStickerById(decalId);
                        if (!text) {
                            return;
                        }
                        url = text.preview_img;
                    }
        
                    position = new Vector3(position.x, position.y, position.z);
        
                    // 判断是否在网格上
                    var raycaster = new Raycaster();
                    raycaster.set(position, new Vector3(0, -1, 0));
                    // 使用射线投射器检查模型是否与射线相交。
                    var intersects = raycaster.intersectObject(currentMesh);
                    // 如果有交点，那么这个点就在模型上。
                    if (intersects.length <= 0) {
                        console.log("贴花位置错误");
                        resolve(void 0)
                        return;
                    }
                    
                    rotation = new Euler(rotation.x, rotation.y, rotation.z);
                    size = new Vector3(size.x, size.y, size.z);
                    const textureLoader = new TextureLoader();
                    const texture = await textureLoader.loadAsync(url);
                    const material = new MeshPhongMaterial({
                        map: texture,
                        transparent: true,
                        depthTest: true,
                        depthWrite: false,
                        polygonOffset: true,
                        polygonOffsetFactor: -4,
                        wireframe: false,
                    });
        
                    const decalGeometry = new DecalGeometry(currentMesh, position, rotation, size);
                    var decalMesh = new Mesh(decalGeometry, material);
                    scene.add(decalMesh);
                    resolve(void 0)
                })
            }))
        }
    

        function render() {
            requestAnimationFrame(render);
            if (animate.value) {
                controller.autoRotate = true
                controller.update()
            } else {
                controller.autoRotate = false
            }
            renderer.render(scene, camera);
        }
    
        el.appendChild(renderer.domElement);
        render();
        loading.value = false;
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



    return {
        emits,
        loading,
        props,
        startAnimate,
        stopAnimate,
        gltfViewerRef,
        controller,
    }
}