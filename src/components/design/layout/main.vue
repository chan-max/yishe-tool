<template>
  <loading v-if="isLoading"></loading>
  <div
    id="layout-container"
    style="width: 100%; height: 100%; display: flex; flex-direction: column"
  >
    <div id="layout-header" style="height: var(--1s-header-height)">
      <div v-if="showHeader" style="width: 100%; height: 100%; display: flex">
        <header-menu />
      </div>
    </div>

    <div
      id="layout-body"
      style="display: flex; height: calc(100% - var(--1s-header-height))"
    >
      <div id="layout-left-menu" style="height: 100%; border-right: 2px solid #f6f6f6">
        <left-menu v-if="showLeftMenu"></left-menu>
      </div>

      <div id="layout-left" style="height: 100%; display: flex">
        <div style="height: 100%">
          <component :is="leftComponent"></component>
        </div>
      </div>

      <div id="layout-canvas">
        <screenshot ref="screenshotInstance"></screenshot>
        <div
          v-show="des.showThreeCanvas"
          id="threejs-canvas"
          style="width: 100%; height: 100%"
          ref="mountContainer"
        ></div>

        <div
          v-show="des.showBasicCanvas"
          id="basic-canvas"
          style="width: 100%; height: 100%"
          ref="basicCanvasRef"
        ></div>
      </div>

      <div id="layout-right" style="display: flex">
        <div style="height: 100%">
          <component :is="rightComponent"></component>
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
    :animation="basicContainerAnimation"
  >
    <image-upload></image-upload>
  </diydialog>

  <div
    v-if="showBottomMenu"
    style="
      height: var(--1s-bottom-menu-height);
      position: absolute;
      z-index: 9;
      bottom: 30px;
    "
  >
    <bottom-menu></bottom-menu>
  </div>

  <diydialog
    :show="showBaseModelSelect"
    @close="showBaseModelSelect = false"
    :animation="basicContainerAnimation"
  >
    <template #title> 选择基础模型</template>
    <base-model-select></base-model-select>
  </diydialog>

  <diydialog
    :show="showFontUpload"
    @close="showFontUpload = false"
    :animation="basicContainerAnimation"
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
    :animation="basicContainerAnimation"
  >
    <font-list></font-list>
  </diydialog>

  <diydialog
    :show="showUpload"
    title="资源上传"
    @close="showUpload = false"
    :animation="basicContainerAnimation"
  >
    <upload></upload>
  </diydialog>

  <diydialog
    :show="showSaveModel"
    title="保存模型"
    @close="showSaveModel = false"
    :animation="basicContainerAnimation"
  >
    <save-model></save-model>
  </diydialog>
</template>
<script setup>
import { computed, onMounted, ref, watchEffect, watch, nextTick } from "vue";
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
  showSticker,
  showThreeCanvas,
  showBasicCanvas,
  useDesignStore,
  showQrcode,
  showUpload,
  showStamp,
} from "../store";
import leftMenu from "./leftMenu.vue";
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
import decoration from "./decoration/index.vue";
import screenshot from "../components/screenshot.vue";
import sticker from "./sticker/index.vue";
import qrcode from "./qrcode/index.vue";
import { DirectionalLight, AmbientLight, PointLight } from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { initWebsocket } from "../utils/websocket.ts";
import upload from "./upload/index.vue";
import stamp from "./stamp/index.vue";

// initWebsocket();

const des = useDesignStore();

window.des = des;

const basicContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  "leave-active-class": "animate__animated animate__bounceOut",
  duration: 100,
});

const screenshotInstance = ref();

function takephoto() {
  const base64 = currentController.value.getScreenshotBase64();
  screenshotInstance.value.execScreenshot(base64);
}

const basicCanvasRef = ref();

const leftComponent = computed(() => {
  return showImageSticker.value
    ? imageSticker
    : showTextSticker.value
    ? textSticker
    : showCustomTextSticker.value
    ? customTextSticker
    : showSticker.value
    ? sticker
    : showQrcode.value
    ? qrcode
    : showStamp.value
    ? stamp
    : null;
});

const rightComponent = computed(() => {
  return showWorkspace.value
    ? workspace
    : showModelInfo.value
    ? modelInfo
    : showDecalControl.value
    ? decalControl
    : showDecalList.value
    ? decalList
    : null;
});

// 挂载容器
const mountContainer = ref();

const modelController = new ModelController();

const { scene } = modelController;

currentController.value = modelController;

/*
  切换主模型
  需要保留之前的操作
*/

watch(
  currentOperatingBaseModelInfo,
  async () => {
    if (!currentOperatingBaseModelInfo.value.url) {
      return;
    }
    await nextTick();
    modelController.setMainModel(currentOperatingBaseModelInfo.value.url);
  },
  {
    immediate: true,
  }
);

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
#threejs-canvas {
  background: #fff;
  overflow: hidden;
}

#layout-canvas {
  height: 100%;
  flex: 1;
  position: relative;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

#layout-header {
  border-bottom: 2px solid #f6f6f6;
  border-top: 2px solid #f6f6f6;
}

#threejs-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

#basics-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>
