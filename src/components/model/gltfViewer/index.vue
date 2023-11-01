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
  AmbientLight,
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
} from "three";
import { debounce } from "@/common/utils/debounce";
import { gltfLoader } from "@/common/threejsHelper";
import { format1stf } from '@/api/format';
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

const props = defineProps(['model']);

const emits = defineEmits(["screenshot", 'load']);

const loading = ref(false);

const gltfViewer = ref();

const scene = new Scene();

const renderer = new WebGLRenderer({
  alpha: true, // 透明背景
});

const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

camera.lookAt(0, 0, 0);

camera.position.set(0, 0, 1);


const getWidth = (el) => Number(window.getComputedStyle(el).width.slice(0, -2));
const getHeight = (el) => Number(window.getComputedStyle(el).height.slice(0, -2));

function initImportedModel(gltf) {
  let flag = 1.5
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

  const $ = format1stf(props.model)

  const url = $.baseModelUrl;

  if (!url) {
    return;
  }

  loading.value = true;

  renderer.setClearColor($.canvasBgColor || '#474e56');

  var currentMesh = null


  let gltf = await gltfLoader(url);

  currentMesh = findMainMesh(gltf)
  function findMainMesh(gltf) {
    let mainMesh = null;
    gltf.scene.traverse((child) => {
      if (child.isMesh && !mainMesh) {
        mainMesh = child;
      }
    });
    return mainMesh;
  }

  // 同步摄像机位置

  if ($.camera) {
    camera.position.set($.camera.position.x, $.camera.position.y, $.camera.position.z);
    camera.rotation.set($.camera.rotation.x, $.camera.rotation.y, $.camera.rotation.z);
    camera.fov = $.camera.fov;
    camera.near = $.camera.near;
    camera.far = $.camera.far;
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

  const dl = new DirectionalLight(0xffffff, 1);
  dl.position.set(0, 0, 10);
  const dl2 = new DirectionalLight(0xffffff, 1);
  dl2.position.set(0, 0, -10);
  scene.add(dl);
  scene.add(dl2);


  if ($.decals) {
    $.decals.forEach(decal => {
      var { src, position, rotation, size } = decal
      position = new Vector3(position.x, position.y, position.z)
      rotation = new Euler(rotation.x, rotation.y, rotation.z,)
      size = new Vector3(size.x, size.y, size.z)
      const decalGeometry = new DecalGeometry(currentMesh, position, rotation, size)

      console.log(position, rotation, size)
      
      const textureLoader = new TextureLoader();
      const texture = textureLoader.load(src);

      const material = new MeshPhongMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false,
      });

      var decalMesh = new Mesh(decalGeometry, material)
      scene.add(decalMesh);
    });
  }

  

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  el.appendChild(renderer.domElement);
  render();
  loading.value = false;
  emits('load')
}

defineExpose({
  getScreenshot() {
    renderer.render(scene, camera); // 截取会出现白图片
    return renderer.domElement.toDataURL("image/png");
  },
});

watch(
  () => props.model,
  async () => {
    await nextTick();
    initModel();
  }
  , { immediate: true });


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
