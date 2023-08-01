<template>
  <div class="gltf-viewer" ref="gltfViewer">
    <div class="gltf-viewer-loading" v-if="loading">加载中...</div>
    <div class="gltf-viewer-menu">
      <el-icon title="开启/关闭全屏"><FullScreen /></el-icon>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted, render, watch, nextTick, shallowRef } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  Box3,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { debounce } from "@/common/utils/debounce";
import { gltfLoader } from "../../common/threejsHelper";

/*
    props :
    data : 模型相关数据
*/

const props = defineProps(["url"]);

const loading = ref(false);

const gltfViewer = ref();

const scene = new Scene();

const currentGltf = shallowRef();

const renderer = new WebGLRenderer({
  alpha: true, // 透明背景
});

const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 1);

const getWidth = (el) => Number(window.getComputedStyle(el).width.slice(0, -2));
const getHeight = (el) => Number(window.getComputedStyle(el).height.slice(0, -2));

function initImportedModel(gltf) {
  let object = gltf.scene;
  // 先处理尺寸，再居中
  const sizeBox = new Box3().setFromObject(object);
  let size = new Vector3();
  sizeBox.getSize(size);
  let length = size.length();
  object.scale.set(1 / length, 1 / length, 1 / length);
  const centerBox = new Box3().setFromObject(object);
  const center = centerBox.getCenter(new Vector3());
  object.position.x += object.position.x - center.x;
  object.position.y += object.position.y - center.y;
  object.position.z += object.position.z - center.z;
}

async function initModel() {
  let url = props.url;

  if (!url) {
    scene.remove(currentGltf.value.scene);
    currentGltf.value = null;
    return;
  }

  loading.value = true;
  let el = gltfViewer.value;
  let gltf = await gltfLoader(url);

  const controler = new OrbitControls(camera, renderer.domElement);

  controler.enablePan = false; // 禁止右键拖拽

  let resizeOb = new ResizeObserver(
    debounce(() => {
      let width = getWidth(el);
      let height = getHeight(el);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    })
  );

  resizeOb.observe(el);

  renderer.setSize(getWidth(el), getHeight(el));

  initImportedModel(gltf);

  currentGltf.value = gltf;
  scene.add(gltf.scene);

  const dl = new DirectionalLight(0xffffff, 1);
  dl.position.set(0, 0, 10);
  const dl2 = new DirectionalLight(0xffffff, 1);
  dl2.position.set(0, 0, -10);
  scene.add(dl);
  scene.add(dl2);

  function render() {
    requestAnimationFrame(render);
    gltf.scene.rotation.y += 0.003;
    renderer.render(scene, camera);
  }

  el.appendChild(renderer.domElement);
  render();
  loading.value = false;
}

watch(
  () => props.url,
  async () => {
    await nextTick();
    initModel();
  }
);
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
  cursor: pointer;
  background-color: #141719;
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
  .el-icon {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    margin: 5px;
    &:hover {
      color: #fff;
    }
  }
}
</style>
