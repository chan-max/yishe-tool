<template>
  <loading v-if="isFirstPageLoading"></loading>

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
      <div id="layout-left-menu" style="height: 100%; border-right: 1px solid #f3f3f3">
        <left-menu v-if="showLeftMenu"></left-menu>
      </div>

      <div id="layout-left" style="height: 100%; display: flex">
        <div style="height: 100%">
          <!-- <keep-alive> -->
          <component :is="leftComponent"></component>
          <!-- </keep-alive> -->
        </div>
      </div>

      <div id="layout-canvas">
        <!-- 截屏组件 -->
        <screenshot ref="screenshotInstance"></screenshot>

        <div
          v-show="showThreeCanvas"
          style="position: absolute; top: 0; left: 0; z-index: 2; width: 100%"
          class="flex justify-center"
        >
          <!-- <threeCanvasTopBar></threeCanvasTopBar> -->
        </div>

        <div
          v-show="showThreeCanvas"
          @contextmenu="onContextMenu"
          id="threejs-canvas"
          style="width: 100%; height: 100%"
          ref="mountContainer"
          :style="{ background: currentCanvasBackground?.backgroundCss }"
        ></div>

        <basic-canvas
          v-show="showBasicCanvas"
          style="width: 100%; height: 100%; z-index: 3"
          ref="basicCanvasRef"
        ></basic-canvas>

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
      </div>

      <div id="layout-right" style="display: flex" v-if="rightComponent">
        <div style="height: 100%">
          <component :is="rightComponent"></component>
        </div>
      </div>
    </div>
  </div>

  <diydialog
    :show="showBaseModelSelect"
    @close="showBaseModelSelect = false"
    :animation="basicContainerAnimation"
  >
    <template #title> 选择基础模型</template>
    <base-model-select></base-model-select>
  </diydialog>

  <diydialog title="设置场景" :show="showSceneControl" @close="showSceneControl = false">
    <scene-control></scene-control>
  </diydialog>

  <fontModal></fontModal>

  <diydialog
    :show="viewDisplayController.showStickerModal"
    title="贴纸"
    @close="viewDisplayController.showStickerModal = false"
    :animation="basicContainerAnimation"
  >
    <sticker-modal></sticker-modal>
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

  <!-- 个人项目弹层 -->
  <diydialog
    :show="viewDisplayController.showProject"
    title="创作资源"
    @close="viewDisplayController.showProject = false"
    :animation="basicContainerAnimation"
  >
    <projectModal></projectModal>
  </diydialog>

  <!-- 贴纸详细信息弹层 -->
  <stickerDetailModal></stickerDetailModal>
  <!-- 自定义模型弹层 -->
  <customModelDetailModal></customModelDetailModal>

  <!-- 贴纸覆盖时显示的提示框 -->
  <decalTooltip></decalTooltip>

  <!-- 材质弹层 -->
  <materialModal></materialModal>

  <!-- 材质详细信息弹层 -->
  <materialDetailModal></materialDetailModal>

  <!-- 卡片分享弹层 -->
  <shareCardModal></shareCardModal>

  <!-- 自动创建弹层 -->
  <autocreateModal></autocreateModal>
</template>
<script setup lang="tsx">
import { computed, onMounted, ref, watchEffect, watch, nextTick } from "vue";
import { ModelController } from "../core/controller";
import headerMenu from "./headerMenu.vue";
import loading from "./loading.vue";
import { useLoginStatusStore } from "@/store/stores/login";
import {
  currentModelController,
  canvasBgColor,
  canvasBgOpacity,
  showBaseModelSelect,
  currentOperatingBaseModelInfo,
  showSceneControl,
  showImageSticker,
  showTextSticker,
  showWorkspace,
  showDecalControl,
  isFirstPageLoading,
  showCustomTextSticker,
  showFontModal,
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
  showUpload,
  showStamp,
  screenshotInstance,
  showCustomModel,
  showSvgCanvas,
  showCanvasLayout,
  viewDisplayController,
  startSyncDesignStorage,
  lastModifiedTime,
  currentCanvasBackground,
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
import fontModal from "./font/index.vue";
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
import basicCanvas from "./basic-canvas/index.vue";
import stickerModal from "./sticker/modal.vue";
import { Modal } from "ant-design-vue";
import Utils from "@/common/utils";
import { createVNode } from "vue";
import { isLogin } from "@/store/stores/loginAction";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import Api from "@/api";
import projectModal from "./project/index.vue";
import ContextMenu from "@imengyu/vue3-context-menu";
import { useRoute, useRouter } from "vue-router";
import {
  openLoginDialog,
  showLoginFormModal,
} from "@/modules/main/view/user/login/index.tsx";
import { useStickerDetailModal } from "@/components/design/layout/project/sticker/stickerModal";

import { useCustomModelDetailModal } from "@/components/design/layout/project/customModel/customModelModal";
import decalTooltip from "./decalTooltip/index.vue";
import materialModal from "./material/modal.vue";
import materialDetailModal from "./material/detailModal.vue";
import shareCardModal from "@/components/design/layout/shareCard/modal.vue";
import material from "@/components/design/layout/material/index.vue";
import autocreateModal from "./autocreate/modal.vue";
import videoClip from "./videoClip/index.vue";

const { component: stickerDetailModal } = useStickerDetailModal();
const { component: customModelDetailModal } = useCustomModelDetailModal();

const router = useRouter();
const loginStore = useLoginStatusStore();

const des = useDesignStore();

const basicContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  "leave-active-class": "animate__animated animate__bounceOut",
  duration: 66,
});

const basicCanvasRef = ref();

const leftComponent = computed(() => {
  if (showDecalControl.value) {
    return decalControl;
  }

  if (showWorkspace.value) {
    return workspace;
  }

  if (showCanvasLayout.value) {
    return canvasLayout;
  }

  if (showSticker.value) {
    return sticker;
  }

  if (viewDisplayController.value.showMaterialControl) {
    return material;
  }

  if (viewDisplayController.value.showVideoClip) {
    return videoClip;
  }
});

const rightComponent = computed(() => {
  if (showDecalList.value) {
    return decalList;
  }
});

// 挂载容器
const mountContainer = ref();

// 渲染动画

isFirstPageLoading.value = true;

const modelController = new ModelController();

onMounted(async () => {
  modelController.render(mountContainer.value);
  await Utils.sleep(1200);
  isFirstPageLoading.value = false;
});

initAction();

async function initAction() {
  // 提示用户登录
  if (!loginStore.isLogin) {
    await Modal.confirm({
      content: (
        <div>
          建议登录后可以解锁全部功能
          <ul>
            <li> 工作台 </li>
            <li> 发布与保存 </li>
            <li> 分享评论 </li>
          </ul>
        </div>
      ),
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        openLoginDialog();
      },
      okText: <div>登录</div>,
      cancelText: "暂不",
      onCancel() {
        Modal.destroyAll();
      },
    });
  } else {
    /* 获取数据并同步 */

    const data = await Api.getUserMeta({
      metaKey: "designStorage",
    });

    if (!Utils.isEmptyObject(data)) {
      des.$patch(data);
      lastModifiedTime.value = data.lastModifiedTime;
    }

    startSyncDesignStorage();
    /*
      开启实时同步更新
    */
  }
}

/**
 * 画布右键菜单
 */
function onContextMenu(e) {
  return;
  //prevent the browser's default menu
  e.preventDefault();
  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: "A menu item",
        onClick: () => {
          alert("You click a menu item");
        },
      },
      {
        label: "A submenu",
        children: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
      },
    ],
  });
}
</script>

<style lang="less">
#threejs-canvas {
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
  z-index: 11;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
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
  border-right: 1px solid #eee;
}

#layout-right {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  z-index: 4;
}
</style>
