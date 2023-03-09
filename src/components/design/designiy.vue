<template>
  <loading v-if="isLoading"></loading>
  <div id="menu">
    <div style="margin-left: 10px">
      <select>
        <option disabled selected style="display: none">服装模型</option>
        <option>t恤</option>
        <option>卫衣</option>
        <option>衬衫</option>
        <option>短裤</option>
      </select>
      <select>
        <option disabled selected style="display: none">底色</option>
        <option>红色</option>
        <option>绿色</option>
        <option>蓝色</option>
        <option>黄色</option>
      </select>
      <a @click="initModel">导入</a>
      <a @click="showRightMenu = !showRightMenu"> 操作菜单 </a>
    </div>
  </div>

  <div id="right-menu">
    <transition leave-active-class="animate__animated animate__backOutRight" enter-active-class="animate__animated animate__backInRight" :duration="{ enter: 100, leave: 100 }">
      <right-menu v-show="showRightMenu"></right-menu>
    </transition>
  </div>

  <div id="designiy" class="designiy">
    <div id="container" ref="container"></div>
  </div>
</template>

<script setup>
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  MeshLambertMaterial,
  PointLight,
  TextureLoader,
  OrthographicCamera,
  RepeatWrapping,
  ClampToEdgeWrapping,
  PlaneGeometry,
  DoubleSide,
  CanvasTexture,
  FrontSide,
  SphereGeometry,
} from "three";
import loading from "./loading.vue";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { computed, getCurrentInstance, onMounted, ref, shallowRef } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { waitImage } from "../../common/waitImage";

import { onWindowResize } from "../../utils/rerender";
import { importLocalImage } from "../../common/importLocalImage";
import { sceneExportToGLTF } from "../../common/exportToGLTF";
import { importLocalModel } from "../../common/importLocalModel";
import { Loading } from "@element-plus/icons-vue";
import { importBuiltInModel } from "../../common/importBuiltInModel";

import { useDraggable } from "@vueuse/core";
import rightMenu from "./rightMenu.vue";
import { CustomTextureCanvas } from './utils/CustomTextureCanvas'

import { currentGltf, showRightMenu, isLoading, container, currentModel, currentMaterial, textureCanvas, currentCustomTextureCanvas } from './utils/store'


const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 环境光
const light = new AmbientLight(0xffffff, 10, 100);
scene.add(light);

camera.position.set(0, 0, 3);
camera.lookAt(0, 0, 0);

async function initModel() {
  isLoading.value = true;
  let gltf = await importBuiltInModel("eye.glb");
  currentGltf.value = gltf

  gltf.scene.traverse((child) => {
    if (child instanceof Mesh) {
      currentModel.value = child
      currentMaterial.value = child.material;
    }
  });

  currentMaterial.value.map.matrixAutoUpdate = false;
  scene.add(gltf.scene);
  isLoading.value = false;

}





var renderer = new WebGLRenderer();
renderer.setClearColor(0x252525); //设置背景颜色

const controler = new OrbitControls(camera, renderer.domElement);


onWindowResize(() => {
  renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染区域尺寸
  camera.aspect = window.innerWidth / window.innerHeight; // 保持缩放时模型不变形
  camera.updateProjectionMatrix();
});

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// 轨道控制器

onMounted(() => {
  container.value.appendChild(renderer.domElement); //body元素中插入canvas对象
  render();
});


</script>

<style lang="less">
#container {
  width: 100%;
  height: 100%;
}

#menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  border-bottom: 5px solid #333;
  background-color: #444;
  display: flex;
  align-items: center;
}

#menu select,
#menu a {
  margin: auto 10px;
}
#menu a {
  color: #d5d5d5;
  font-size: 14px;
  font-weight: bold;
}
#menu a:hover {
  background: #333;
  cursor: pointer;
}

#right-menu {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 45px);
  width: auto;
  top: 45px;
  right: 0;
}
</style>