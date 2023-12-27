<template>
  <div id="designiy-canvas-container" ref="mountContainer" style="z-index: 0"></div>
  <loading v-if="isLoading"></loading>
  <div
    id="layout-container"
    style="
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;
    "
  >
    <div id="layout-header">
      <diycontainer
        :show="showHeader"
        style="width: 100%; height: var(--1s-header-height)"
      >
        <header-menu />
      </diycontainer>
    </div>

    <div
      id="layout-body"
      style="
        display: flex;
        flex: 1;
        flex-shrink: 0;
        height: calc(100% - var(--1s-header-height));
      "
    >
      <diycontainer :show="showLeftMenu" style="height: 100%">
        <left-menu></left-menu>
      </diycontainer>

      <div id="layout-left" style="height: 100%;display:flex;">
        <diycontainer :show="showTextSticker" style="height: 100%">
          <text-sticker></text-sticker>
        </diycontainer>

        <diycontainer :show="showImageSticker" style="height: 100%">
          <image-sticker></image-sticker>
        </diycontainer>
      </div>

      <diycontainer :show="showCustomTextSticker" style="height: 100%">
        <custom-text-sticker></custom-text-sticker>
      </diycontainer>


      <div id="layout-right" style="height:100%;display:flex;flex-direction: column;flex:1;">

      <div id="layout-right-header">
        <diycontainer
        :show="showSubHeader"
        style="width: auto; height: var(--1s-sub-header-height); flex: 1"
      >
        <sub-header-menu />
      </diycontainer>
      </div>        

      <div id="layout-right-body" style="flex:1;display:flex;height:calc(100% - var(--1s-sub-header-height));">

        <div id="layout-placeholder" style="height:100%;flex:1;"></div>

        <diycontainer :show="showWorkspace" style="height: 100%">
          <workspace></workspace>
        </diycontainer>

        <diycontainer :show="showDecalList" style="height: 100%">
          <decal-list></decal-list>
        </diycontainer>

        <diycontainer :show="showModelInfo" style="height: 100%">
          <model-info></model-info>
        </diycontainer>

        <diycontainer :show="showDecalControl" style="height: 100%">
          <decal-control></decal-control>
        </diycontainer>
      </div>
      </div>
    </div>
  </div>

  <diydialog
    title="图片上传"
    :header="true"
    mask="true"
    :show="showImageUplaod"
    @close="showImageUplaod = false"
    :animation="{
      'enter-active-class': 'animate__animated animate__bounceIn',
      'leave-active-class': 'animate__animated animate__bounceOut',
      duration: 100,
    }"
  >
    <image-upload></image-upload>
  </diydialog>

  <diycontainer
    :show="showBottomMenu"
    style="
      height: var(--1s-bottom-menu-height);
      position: absolute;
      z-index: 9;
      bottom: 30px;
    "
  >
    <bottom-menu></bottom-menu>
  </diycontainer>

  <diydialog
    :show="showBaseModelSelect"
    @close="showBaseModelSelect = false"
    :animation="{
      'enter-active-class': 'animate__animated animate__bounceIn',
      'leave-active-class': 'animate__animated animate__bounceOut',
      duration: 100,
    }"
  >
    <template #title> 选择基础模型</template>
    <base-model-select></base-model-select>
  </diydialog>

  <diydialog
    :show="showFontUpload"
    @close="showFontUpload = false"
    :animation="{
      'enter-active-class': 'animate__animated animate__bounceIn',
      'leave-active-class': 'animate__animated animate__bounceOut',
      duration: 100,
    }"
  >
    <template #title> 字体上传 </template>
    <font-upload></font-upload>
  </diydialog>

  <diydialog title="设置场景" :show="showSceneControl" @close="showSceneControl = false">
    <scene-control></scene-control>
  </diydialog>

  <diydialog
    :show="showFontList"
    title="字体"
    @close="showFontList = false"
    :animation="{
      'enter-active-class': 'animate__animated animate__bounceIn',
      'leave-active-class': 'animate__animated animate__bounceOut',
      duration: 100,
    }"
  >
    <font-list></font-list>
  </diydialog>

  <diydialog
    :show="showSaveModel"
    title="保存该模型"
    @close="showSaveModel = false"
    :animation="{
      'enter-active-class': 'animate__animated animate__bounceIn',
      'leave-active-class': 'animate__animated animate__bounceOut',
      duration: 100,
    }"
  >
    <save-model></save-model>
  </diydialog>
</template>
<script setup>
import { computed, onMounted, ref, watchEffect, watch } from "vue";
import { ModelController } from "../core/controller";
import headerMenu from "./headerMenu.vue";
import loading from "./loading.vue";
import {
  currentController,
  canvasBgColor,
  canvasBgOpacity,
  showBaseModelSelect,
  currentOperatingBaseModelInfo,
  showSceneControl,
  showImageSticker,
  showTextSticker,
  showWorkspace,
  showDecalControl,
  isLoading,
  showImageUplaod,
  showCustomTextSticker,
  showFontUpload,
  showFontList,
  showModelInfo,
  showDecalList,
  showHeader,
  showSubHeader,
  showLeftMenu,
  showBottomMenu,
  showSaveModel,
} from "../store";
import leftMenu from "./leftMenu.vue";
import diycontainer from "../components/container.vue";
import diydialog from "../components/dialog.vue";
import baseModelSelect from "./baseModelSelect/index.vue";
import sceneControl from "./sceneControl/index.vue";
import imageSticker from "./imageSticker/index.vue";
import textSticker from "./textSticker/index.vue";
import workspace from "./workspace/index.vue";
import bottomMenu from "./bottomMenu.vue";
import decalControl from "./decalControl/index.vue";
import imageUpload from "./imageUpload/index.vue";
import customTextSticker from "./customTextSticker/index.vue";
import fontUpload from "./fontUpload/index.vue";
import fontList from "./fontList/index.vue";
import subHeaderMenu from "./subHeaderMenu/index.vue";
import modelInfo from "./modelInfo/index.vue";
import decalList from "./decalList/index.vue";
import saveModel from "./saveModel/index.vue";
import { CubeTextureLoader } from "three";
import decoration from "./decoration/index.vue";

import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Texture,
  TextureLoader,
  Vector3,
  BoxGeometry,
  Euler,
  DirectionalLight,
  AmbientLight,
  PointLight,
  AxesHelper,
  GridHelper,
  MeshPhongMaterial,
  DoubleSide,
} from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { initWebsocket } from "../utils/websocket.ts";

initWebsocket();

// 挂载容器
const mountContainer = ref();

const modelController = new ModelController();

const { scene } = modelController;

currentController.value = modelController;

// 模型转换
watch(currentOperatingBaseModelInfo, () => {
  modelController.setMainModel(currentOperatingBaseModelInfo.value.preview_file);
});

// 创建场景、相机和渲染器等...

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

// scene.add(new AxesHelper(0.5))

// 改变画布背景颜色
watchEffect(() => modelController.setBgColor(canvasBgColor.value, canvasBgOpacity.value));

// 渲染动画

onMounted(() => {
  modelController.render(mountContainer.value);
  // currentController.value.setSkyballBackground()
});
</script>

<style lang="less">
#designiy-canvas-container {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}


/* 顺序不能乱 */
#layout-container{
  pointer-events: none;
}


#layout-body {
  pointer-events: none;
}

#layout-right{
  pointer-events: none;
}

#layout-right-body{
  pointer-events: none;
}
#layout-placeholder{
  pointer-events: none;
}

</style>
