<template>
  <div class="gltf-viewer" ref="gltfViewer">
    <div class="gltf-viewer-loading" v-if="loading">
      ...
    </div>
    <div class="screenshot"></div>
    <div class="gltf-viewer-menu">
    </div>
  </div>
</template>
<script setup>
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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
Vector2
} from "three";
import { debounce } from "@/common/utils/debounce";
import { gltfLoader } from "@/common/threejsHelper";
import { format1stf } from '@/api/format';
import {getBaseModel,getImage} from '@/api'
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

const props = defineProps(['model']);

const emits = defineEmits(["screenshot", 'load']);

const loading = ref(false);

const gltfViewer = ref();

const scene = new Scene();


// 添加环境光
const ambientLight = new AmbientLight(0xffffff, 0.1); // 设置颜色和强度
scene.add(ambientLight);


const renderer = new WebGLRenderer({
  alpha: true, // 透明背景
});

const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

camera.lookAt(0, 0, 0);

camera.position.set(0, 0, .7);


const getWidth = (el) => Number(window.getComputedStyle(el).width.slice(0, -2));
const getHeight = (el) => Number(window.getComputedStyle(el).height.slice(0, -2));

function initImportedModel(gltf) {
  let flag = 1
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

async function initModel() {

  const model = format1stf(props.model)
  
  if(!model){
    return
  }

  loading.value = true;
  var baseModelUrl = model.baseModelUrl

  if(!baseModelUrl && model.baseModelId){
    baseModelUrl = (await getBaseModel({id:model.baseModelId}))[0].fileFullpath
  }



  renderer.setClearColor(model.canvasBgColor || '#474e56');

  var currentMesh = null

  let gltf = await gltfLoader(baseModelUrl);

  currentMesh = findMainMesh(gltf)
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
    camera.position.set(model.camera.position.x, model.camera.position.y, model.camera.position.z);
    camera.rotation.set(model.camera.rotation.x, model.camera.rotation.y, model.camera.rotation.z);
    camera.fov = model.camera.fov;
    camera.near = model.camera.near;
    camera.far = model.camera.far;
  }

  let el = gltfViewer.value;

  function resetCameraAspect() {
    let width = getWidth(el);
    let height = getHeight(el);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  resetCameraAspect()

  const controller = new OrbitControls(camera, renderer.domElement);

  controller.enablePan = false; // 禁止右键拖拽

  let resizeOb = new ResizeObserver(
    debounce(resetCameraAspect)
  );

  resizeOb.observe(el);

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


  if (model.decals) {
    model.decals.forEach(async decal => {
      var { decalId, position, rotation, size } = decal
      const image = (await getImage({id:decalId}))[0]

      position = new Vector3(position.x, position.y, position.z)

      // 判断是否在网格上
      var raycaster = new Raycaster();
      raycaster.set(position, new Vector3(0, -1, 0));
      // 使用射线投射器检查模型是否与射线相交。
      var intersects = raycaster.intersectObject(currentMesh);
      // 如果有交点，那么这个点就在模型上。
      if (intersects.length <= 0) {
          console.log("贴花位置错误");
          return
      }

      rotation = new Euler(rotation.x, rotation.y, rotation.z,)
      size = new Vector3(size.x, size.y, size.z)
      const textureLoader = new TextureLoader();
      const texture = textureLoader.load(image.fullpath);
      const material = new MeshPhongMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false,
      });

      const decalGeometry = new DecalGeometry(currentMesh, position, rotation, size)
      var decalMesh = new Mesh(decalGeometry, material);
      scene.add(decalMesh);
    });
  }


  function render() {
    requestAnimationFrame(render);
    // currentMesh.rotation.y+=.01
    renderer.render(scene, camera);
  }

  el.appendChild(renderer.domElement);
  render();
  loading.value = false;
  emits('load')
}

watch(
  () => props.model,
  async () => {
    await nextTick();
    initModel();
  }
  , { immediate: true });


defineExpose({
  getScreenshot() {
    renderer.render(scene, camera); // 截取会出现白图片
    return renderer.domElement.toDataURL("image/png");
  },
});

function screenshot() {
  renderer.render(scene, camera); // 截取会出现白图片
  var img = renderer.domElement.toDataURL("image/png"); // base64
  // var win = window.open("", "_blank");
  // win.document.write('<img src="' + img + '"/>');
  emits("screenshot", img);
}

</script>
<style lang="less">
.gltf-viewer {
  background: transparent;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gltf-viewer-loading {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
}

.gltf-viewer-menu {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0;
  display: flex;
  justify-content: end;
  align-items: center;

  color: #fff;
  padding: 0 20px;

  svg:hover {
    cursor: pointer;
  }
}
</style>
