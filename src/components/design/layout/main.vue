<template>
  <loading v-if="isLoading"></loading>
  <div id="layout-container" style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <div id="layout-header" style="height: var(--1s-header-height)">
      <div v-if="showHeader" style="width: 100%; height: 100%; display: flex">
        <header-menu />
      </div>
    </div>

    <div id="layout-body" style="display: flex; height: calc(100% - var(--1s-header-height))">
      <div id="layout-left-menu" style="height: 100%; border-right: 2px solid #f6f6f6">
        <left-menu v-if="showLeftMenu"></left-menu>
      </div>

      <div id="layout-left" style="height: 100%; display: flex">
        <div style="height: 100%">
          <Transition v-bind="leftContainerAnimation">
            <!-- <keep-alive> -->
            <component :is="leftComponent"></component>
            <!-- </keep-alive> -->
          </Transition>
        </div>
      </div>


      <div id="layout-canvas">
        <screenshot ref="screenshotInstance"></screenshot>
        <div v-show="showThreeCanvas" id="threejs-canvas" style="width: 100%; height: 100%" ref="mountContainer">
        </div>
        <basic-canvas v-show="showBasicCanvas" style="width: 100%; height: 100%; z-index: 1"
          ref="basicCanvasRef"></basic-canvas>
      </div>

      <div id="layout-right" style="display: flex">
        <div style="height: 100%">
          <component :is="rightComponent"></component>
        </div>
      </div>
    </div>
  </div>

  <diydialog title="图片上传" :header="true" mask="true" :show="showImageUplaod" @close="showImageUplaod = false"
    :animation="basicContainerAnimation">
    <image-upload></image-upload>
  </diydialog>

  <div v-if="showBottomMenu" style="
      height: var(--1s-bottom-menu-height);
      position: absolute;
      z-index: 9;
      bottom: 30px;
    ">
    <bottom-menu></bottom-menu>
  </div>

  <diydialog :show="showBaseModelSelect" @close="showBaseModelSelect = false" :animation="basicContainerAnimation">
    <template #title> 选择基础模型</template>
    <base-model-select></base-model-select>
  </diydialog>

  <diydialog :show="showFontUpload" @close="showFontUpload = false" :animation="basicContainerAnimation">
    <template #title> 字体上传 </template>
    <font-upload></font-upload>
  </diydialog>

  <diydialog title="设置场景" :show="showSceneControl" @close="showSceneControl = false">
    <scene-control></scene-control>
  </diydialog>

  <diydialog :show="showFontList" title="字体" @close="showFontList = false" :animation="basicContainerAnimation">
    <font-list></font-list>
  </diydialog>

  <diydialog :show="viewDisplayController.showStickerModal" title="贴纸" @close="viewDisplayController.showStickerModal = false"
    :animation="basicContainerAnimation">
    <sticker-modal></sticker-modal>
  </diydialog>

  <!-- <diydialog :show="showUpload" title="资源上传" @close="showUpload = false" :animation="basicContainerAnimation">
    <upload></upload>
  </diydialog> -->

  <!-- <diydialog :show="showSaveModel" title="保存模型" @close="showSaveModel = false" :animation="basicContainerAnimation">
    <save-model></save-model>
  </diydialog> -->
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
  screenshotInstance,
  showCustomModel,
  showSvgCanvas,
  showCanvasLayout,
  viewDisplayController
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
import customModel from "./customModel/index.vue";
import { DirectionalLight, AmbientLight, PointLight } from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { initWebsocket } from "../utils/websocket.ts";
import upload from "./upload/index.vue";
import stamp from "./stamp/index.vue";
import svgCanvas from "./svgCanvas/index.vue";
import canvasLayout from "./canvas/index.vue";
import basicCanvas from './basic-canvas/index.vue'
import stickerModal from './sticker/modal.vue'

const radio1 = ref()
// initWebsocket();

const des = useDesignStore();


const leftContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  // "leave-active-class": "animate__animated animate__bounceOut",
  duration: {
    enter: 33,
    leave: 0
  },
});

const basicContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  "leave-active-class": "animate__animated animate__bounceOut",
  duration: 100,
});

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
              : showCustomModel.value
                ? customModel
                : showSvgCanvas.value
                  ? svgCanvas
                  : showCanvasLayout.value
                    ? canvasLayout
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

// 渲染动画

onMounted(() => {
  const modelController = new ModelController();
  modelController.render(mountContainer.value);
});


</script>

<style lang="less">
#threejs-canvas {
  background: #eee;
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
  border-bottom: 1px solid #f6f6f6;
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

#layout-left {
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
}
</style>
