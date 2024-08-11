<template>
  <loading v-if="isFirstPageLoading"></loading>

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
          <!-- <keep-alive> -->
          <component :is="leftComponent"></component>
          <!-- </keep-alive> -->
        </div>
      </div>

      <div id="layout-canvas">
        <screenshot ref="screenshotInstance"></screenshot>
        <div v-show="showThreeCanvas" @contextmenu="onContextMenu" id="threejs-canvas" style="width: 100%; height: 100%"
          ref="mountContainer"></div>
        <basic-canvas v-show="showBasicCanvas" style="width: 100%; height: 100%; z-index: 1"
          ref="basicCanvasRef"></basic-canvas>


        <div v-if="showBottomMenu" style="
          height: var(--1s-bottom-menu-height);
          position: absolute;
          z-index: 9;
          bottom: 30px;
          ">
          <bottom-menu></bottom-menu>
        </div>

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

  <diydialog :show="viewDisplayController.showStickerModal" title="贴纸"
    @close="viewDisplayController.showStickerModal = false" :animation="basicContainerAnimation">
    <sticker-modal></sticker-modal>
  </diydialog>

  <diydialog :show="showUpload" title="资源上传" @close="showUpload = false" :animation="basicContainerAnimation" top="12%">
    <upload></upload>
  </diydialog>

  <diydialog :show="showSaveModel" title="保存模型" @close="showSaveModel = false" :animation="basicContainerAnimation">
    <save-model></save-model>
  </diydialog>

  <!-- 个人项目弹层 -->
  <diydialog :show="viewDisplayController.showProject" title="创作项目" @close="viewDisplayController.showProject = false"
    :animation="basicContainerAnimation">
    <projectModal></projectModal>
  </diydialog>
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
  viewDisplayController,
  startSyncDesignStorage,
  lastModifiedTime,
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

const router = useRouter();
const loginStore = useLoginStatusStore();

const des = useDesignStore();

const leftContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  // "leave-active-class": "animate__animated animate__bounceOut",
  duration: {
    enter: 33,
    leave: 0,
  },
});

const basicContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  "leave-active-class": "animate__animated animate__bounceOut",
  duration: 66,
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

isFirstPageLoading.value = true;

const modelController = new ModelController();

onMounted(async () => {
  modelController.render(mountContainer.value);

  await Utils.sleep(1200);
  isFirstPageLoading.value = false;

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
        // router.push({
        //   name: 'Login',
        //   query: {
        //     redirectTo: 'Design'
        //   }
        // })

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
      // 存在用户数据，需要同步

      // for (let key in data) {
      //   des[key] = data[key];
      // }
      des.$patch(data);
      lastModifiedTime.value = data.lastModifiedTime;
    }
    startSyncDesignStorage();
    /*
      开启实时同步更新
    */
  }
});

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
  border-right: 1px solid #eee;
}

#layout-right {
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.1);
  border-left: 1px solid #eee;
}
</style>
