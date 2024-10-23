<template>
  <div class="layout">
    <van-nav-bar>
      <template #title> </template>
      <template #left>
        <div style="column-gap: 12px" class="flex items-center">
          <van-button plain icon="revoke" size="small" @click="back">返回</van-button>

          <van-button
            v-if="!loginStore.isLogin"
            color="linear-gradient(to right, #f00090, #6900ff)"
            size="small"
            @click="login"
          >
            去登录
          </van-button>

          <avatar v-else></avatar>
        </div>
      </template>
      <template #right>
        <van-button
          size="small"
          icon="share-o"
          icon-position="right"
          color="linear-gradient(to right, #f00090, #861fed)"
          @click="save"
          >保存并分享</van-button
        >
      </template>
    </van-nav-bar>

    <div style="flex: 1" class="three-canvas" ref="threeCanvasRef"></div>

    <van-action-bar style="padding: 4px 12px" class="action-bar">
      <van-action-bar-icon
        @click="showProductPopup = true"
        :dot="!currentOperatingBaseModelInfo"
      >
        <template #default> 服装模型 </template>
        <template #icon>
          <div class="action-bar-icon">
            <van-icon :name="clothIcon" />
          </div>
        </template>
      </van-action-bar-icon>
      <van-action-bar-icon icon="cart-o" @click="showMaterialPopup = true">
        <template #default> 选择材质 </template>
        <template #icon>
          <div class="action-bar-icon">
            <van-icon :name="materialIcon" />
          </div>
        </template>
      </van-action-bar-icon>
      <van-action-bar-icon
        icon="photo-o"
        text="添加贴纸"
        @click="showStickerPopup = true"
      />

      <van-action-bar-icon icon="upgrade" text="上传图片" @click="toUpload" />
      <van-action-bar-icon icon="shop-o" text="设计作品" />
      <van-action-bar-icon icon="shop-collect-o" text="我的作品" />
      <van-action-bar-icon icon="flower-o" text="创建贴纸" />
      <van-action-bar-icon
        icon="bars"
        text="贴纸操作"
        @click="showDecalPopup = true"
        :badge="currentModelController?.decalControllers.length"
      />
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" />
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" />
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" />
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" />
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <!-- <van-action-bar-button color="#be99ff" type="warning" text="加入购物车" />
      <van-action-bar-button color="#7232dd" type="danger" text="立即购买" /> -->
    </van-action-bar>
  </div>
  <productPopup></productPopup>
  <stickerPopup></stickerPopup>
  <stickerDetailPopup></stickerDetailPopup>
  <materialPopup></materialPopup>
  <materialDetailPopup></materialDetailPopup>
  <uploadPopup></uploadPopup>
  <decalPopup></decalPopup>
  <uploadImagePopup></uploadImagePopup>
  <decalFloatingBubble></decalFloatingBubble>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  ModelController,
  createModelController,
} from "@/components/design/core/controller";
import { meta } from "./meta.ts";
import {
  showProductPopup,
  showStickerPopup,
  showMaterialPopup,
  showUploadPopup,
  showDecalPopup,
  showUploadImagePopup,
} from "./index.ts";
import clothIcon from "@/icon/mobile/cloth.svg?url";
import materialIcon from "@/icon/mobile/material.svg?url";
import productPopup from "./productPopup.vue";
import stickerPopup from "./stickerPopup.vue";
import stickerDetailPopup from "./stickerDetailPopup.vue";
import materialPopup from "./materialPopup.vue";
import materialDetailPopup from "./materialDetailPopup.vue";
import uploadImagePopup from "./uploadImagePopup.vue";
import uploadPopup from "./uploadPopup.vue";
import decalPopup from "./decalPopup.vue";
import decalFloatingBubble from "./decalFloatingBubble.vue";

import { currentModelController } from "@/components/design/store";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import avatar from "@/modules/mobile/components/avatar.vue";
import Utils from "@/common/utils";
import { useLoginStatusStore } from "@/store/stores/login";

let router = useRouter();
const loginStore = useLoginStatusStore();
const threeCanvasRef = ref();

onMounted(() => {
  if (Utils.three.isSupport) {
    const modelController = createModelController({
      meta,
      mode: "mb",
      isMobile: true,
    });
    modelController.render(threeCanvasRef.value);
  } else {
    showToast("当前设备不支持，请更换设备尝试");
  }
});

function back() {
  router.push("/");
}

function save() {
  if (!loginStore.userInfo?.id) {
    showToast("请先登录后在保存");
    return;
  }
  showUploadPopup.value = true;
}

// 去上传
function toUpload() {
  if (!loginStore.userInfo?.id) {
    showToast("请先登录后在上传");
    return;
  }

  showUploadImagePopup.value = true;
}

function login() {
  router.push({
    name: "Login",
    query: {
      redirect: "design",
    },
  });
}
</script>

<style scoped lang="less">
.three-canvas {
  background: #eee;
  width: 100vw;
  height: calc(100vh - var(--van-action-bar-height));
  position: fixed;
  top: 0;
}

.layout {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
}

.action-bar {
  overflow: auto;
}

.action-bar-icon {
  width: 18px;
  height: 18px;
}
</style>
