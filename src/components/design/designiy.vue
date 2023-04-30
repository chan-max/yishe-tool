<template>
  <loading v-if="isLoading"></loading>
  <div id="menu">
    <div style="margin-left: 10px">
      <select v-model="currentFilename">
        <option disabled selected style="display: none" value="placeholder">选择服装模型</option>
        <option v-for="model of ModelInfo" :value="model.filename">{{ model.name }}</option>
      </select>
      <select>
        <option disabled selected style="display: none">底色</option>
        <option>红色</option>
        <option>绿色</option>
        <option>蓝色</option>
        <option>黄色</option>
      </select>
      <a @click="showRightMenu = !showRightMenu"> 操作菜单 </a>
    </div>
  </div>

  <div id="right-menu">
    <transition leave-active-class="animate__animated animate__backOutRight"
      enter-active-class="animate__animated animate__backInRight" :duration="{ enter: 100, leave: 100 }">
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
  OrthographicCamera,
  RepeatWrapping,
  ClampToEdgeWrapping,
  PlaneGeometry,
  DoubleSide,
  CanvasTexture,
  FrontSide,
  SphereGeometry,
BoxHelper,
} from "three";
import loading from "./loading.vue";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { computed, getCurrentInstance, onMounted, ref, shallowRef, watch } from 'vue';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { waitImage } from "../../common/waitImage";
import { onWindowResize } from "../../utils/rerender";
import { importLocalImage } from "../../common/importLocalImage";
import { importLocalModel } from "../../common/importLocalModel";
import { Loading } from "@element-plus/icons-vue";
import { importBuiltInModel } from "../../common/importBuiltInModel";

import { useDraggable } from "@vueuse/core";
import rightMenu from "./rightMenu.vue";
import { ModelInfo } from './const'
import { currentGltf, showRightMenu, isLoading, container, currentModel, currentMaterial, textureCanvas, currentCustomTextureCanvas, currentFilename } from './utils/store';
import { setBasicLight } from './scene/lightControl';


const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);


function getFitScaleValue(obj) {
  var boxHelper = new BoxHelper(obj);
  boxHelper.geometry.computeBoundingBox();
  var box = boxHelper.geometry.boundingBox;
  var maxDiameter = Math.max((box.max.x - box.min.x), (box.max.y - box.min.y), (box.max.z - box.min.z));
  return camera.position.z / maxDiameter;
}

//设置模型到适合观察的大小
function setScaleToFitSize(obj) {
  var scaleValue = getFitScaleValue(obj);
  obj.scale.set(scaleValue, scaleValue, scaleValue);
  return scaleValue;
}

watch(currentFilename, async (filename) => renderModel(filename))

// 根据文件名渲染模型
async function renderModel(filename){
  scene.clear()
  isLoading.value = true;
  let gltf = await importBuiltInModel(filename);
  currentGltf.value = gltf
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      currentModel.value = child
      currentMaterial.value = child.material;
      child.geometry.center()
      setScaleToFitSize(child)
    }
  });
  // currentMaterial.value.map.matrixAutoUpdate = false;
  scene.add(gltf.scene);
  setBasicLight(scene)
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

onMounted(() => {
  container.value.appendChild(renderer.domElement); //body元素中插入canvas对象
  renderModel(currentFilename.value)
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