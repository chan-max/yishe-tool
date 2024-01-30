<template>
  <ion-page>
    <div class="scan">
      <div
        v-show="showCorner"
        ref="topLeft"
        class="qrcode-corner"
        :style="{ top: topLeftCornerY + 'px', left: topLeftCornerX + 'px' }"
      ></div>
      <div
        v-show="showCorner"
        ref="topRight"
        class="qrcode-corner"
        :style="{ top: topRightCornerY + 'px', left: topRightCornerX + 'px' }"
      ></div>
      <div
        v-show="showCorner"
        ref="bottomLeft"
        class="qrcode-corner"
        :style="{ top: bottomLeftCornerY + 'px', left: bottomLeftCornerX + 'px' }"
      ></div>
      <div
        v-show="showCorner"
        ref="bottomRight"
        class="qrcode-corner"
        :style="{ top: bottomRightCornerY + 'px', left: bottomRightCornerX + 'px' }"
      ></div>
      <video
        class="scan-video"
        :class="isFacingUser && 'video-flip'"
        ref="videoRef"
        playsinline
      ></video>
      <canvas class="scan-canvas" style="display: none" ref="canvasEl"></canvas>
      <div class="scan-main-left">
        <icon-close @click="close"></icon-close>
        <icon-switch-camera @click="toggleMode"></icon-switch-camera>
      </div>
    </div>
    <canvas ref="canvasRef" style="display: none"></canvas>
  </ion-page>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, shallowRef } from "vue";
import iconClose from "@/icon/mobile/close.svg?component";
import iconSwitchCamera from "@/icon/mobile/switch-camera.svg?component";
import { IonPage } from "@ionic/vue";

import { showDialog, showConfirmDialog } from "vant";
import { useRouter } from "vue-router";
import jsQR from "jsqr";
const router = useRouter();

import { useCamera } from "@/hooks/device/camera.ts";

const videoRef = ref();

const canvasRef = ref();

const topLeft = ref();
const topRight = ref();
const bottomLeft = ref();
const bottomRight = ref();
/*
  position
*/
const topRightCornerX = ref(0);
const topRightCornerY = ref(0);
const topLeftCornerX = ref(0);
const topLeftCornerY = ref(0);
const bottomRightCornerX = ref(0);
const bottomRightCornerY = ref(0);
const bottomLeftCornerX = ref(0);
const bottomLeftCornerY = ref(0);

const showCorner = ref(false);

const { toggleMode, isFacingUser } = useCamera({
  videoRef,
  canvasRef,
  onTimeUpdate() {},
  onQRCodeDetected(info) {
    let { data, location } = info;
    showCorner.value = true;
    topRightCornerX.value = location.topRightCorner.x;
    topRightCornerY.value = location.topRightCorner.y;
    topLeftCornerX.value = location.topLeftCorner.x;
    topLeftCornerY.value = location.topLeftCorner.y;
    bottomRightCornerX.value = location.bottomRightCorner.x;
    bottomRightCornerY.value = location.bottomRightCorner.y;
    bottomLeftCornerX.value = location.bottomLeftCorner.x;
    bottomLeftCornerY.value = location.bottomLeftCorner.y;

    try {
      data = JSON.parse(data);
      console.log(data)
    } catch (e) {
      return
    }
  },
  onQRCodeNotFound() {
    showCorner.value = false;
  },
});

function close() {
  router.back();
}
</script>
<style lang="less">
.scan {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
}

.scan-video {
  display: flex;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  // 自拍镜像翻转
  object-fit: cover;
}

.video-flip {
  transform: rotateY(180deg);
}

.scan-canvas {
  width: 100%;
  height: 100%;
}

.scan-main-left {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: absolute;
  top: calc(var(--ion-safe-area-top) + 20px);
  left: calc(var(--ion-safe-area-left) + 20px);
  z-index: 1;
  svg {
    color: rgba(255, 255, 255, 1);
    width: 36px;
    height: 36px;
  }
}

.scan-main-right {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  svg {
    color: rgba(255, 255, 255, 1);
    width: 36px;
    height: 36px;
  }
}

.qrcode-corner {
  width: 5px;
  height: 5px;
  background-color: red;
  position: absolute;
  z-index: 999;
}
</style>
