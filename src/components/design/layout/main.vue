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
          <keep-alive include="sticker">
            <component :is="leftComponent"></component>
          </keep-alive>
        </div>
      </div>

      <div id="layout-canvas">

      </div>

      <div id="layout-right" style="display: flex" v-if="rightComponent">
        <div style="height: 100%">
          <component :is="rightComponent"></component>
        </div>
      </div>
    </div>
  </div>


  <fontModal></fontModal>

  <diydialog
    :show="viewDisplayController.showStickerModal"
    title="贴纸"
    @close="viewDisplayController.showStickerModal = false"
    :animation="basicContainerAnimation"
  >
    <sticker-modal></sticker-modal>
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

  <diydialog
    :show="showUpload"
    title="资源上传"
    @close="showUpload = false"
    :animation="basicContainerAnimation"
  >
    <upload></upload>
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
import headerMenu from "./headerMenu.vue";
import loading from "./loading.vue";
import { useLoginStatusStore } from "@/store/stores/login";
import {
  showWorkspace,
  showDecalControl,
  isFirstPageLoading,
  showDecalList,
  showHeader,
  showLeftMenu,
  showBottomMenu,
  showSticker,
  showUpload,
  showCanvasLayout,
  viewDisplayController,
} from "../store";
import leftMenu from "./leftMenu.vue";
import diydialog from "../components/dialog.vue";
import workspace from "./workspace/index.vue";
import bottomMenu from "./bottomMenu.vue";
import decalControl from "./decalControl/index.vue";
import fontModal from "./font/index.vue";
import decalList from "./decalList/index.vue";
import sticker from "./sticker/index.vue";
import upload from "./upload/index.vue";
import canvasLayout from "./canvas/index.vue";
import stickerModal from "./sticker/modal.vue";
import Utils from "@/common/utils";
import { useRoute, useRouter } from "vue-router";
import { useStickerDetailModal } from "@/components/design/layout/project/sticker/stickerModal";
import projectModal from "./project/index.vue";
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


const basicContainerAnimation = ref({
  "enter-active-class": "animate__animated animate__bounceIn",
  "leave-active-class": "animate__animated animate__bounceOut",
  duration: 66,
});


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
    sticker.name = "sticker";
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


// 渲染动画

isFirstPageLoading.value = true;

onMounted(async () => {
  await Utils.sleep(1200);
  isFirstPageLoading.value = false;
});

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
