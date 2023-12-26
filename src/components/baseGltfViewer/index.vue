<template>
  <div class="base-gltf-viewer" ref="gltfViewer">
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
  Vector2,
} from "three";
import { debounce } from "@/common/utils/debounce";
import { gltfLoader } from "@/common/threejsHelper";

const props = defineProps({
    src:''
});

const gltfViewer = ref();

const scene = new Scene();

const renderer = new WebGLRenderer({
  alpha: true, // 透明背景
});

const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

camera.lookAt(0, 0, 0);

camera.position.set(0, 0, 0.7);

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

async function initModel() {

  var currentMesh = null;

  let gltf = await gltfLoader(props.src);

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

  let el = gltfViewer.value;

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

  const controller = new OrbitControls(camera, renderer.domElement);

  controller.enablePan = false; // 禁止右键拖拽

  let resizeOb = new ResizeObserver(debounce(resetCameraAspect));

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


  function render() {
    requestAnimationFrame(render);
    // currentMesh.rotation.y+=.01
    renderer.render(scene, camera);
  }

  el.appendChild(renderer.domElement);
  render();
}

watch(() => props.src,initModel,{immediate:true})

</script>
<style lang="less">
.base-gltf-viewer {
  background: transparent;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.base-gltf-viewer-loading {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
}

</style>
