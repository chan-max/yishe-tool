<template>
  <ion-page>
    <div class="scan">
      <video
        class="scan-video"
        :class="facingUser && 'video-flip'"
        ref="videoRef"
        playsinline
      ></video>
      <canvas class="scan-canvas" style="display: none" ref="canvasEl"></canvas>
      <div class="scan-main-left">
        <icon-close @click="close"></icon-close>
        <icon-switch-camera @click="toggleMode"></icon-switch-camera>
      </div>
    </div>
    <canvas ref="canvasRef" style="display:none;"></canvas>
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

const { toggleMode, facingUser } = useCamera({
  videoRef,
  canvasRef
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
  top: 20px;
  left: 20px;
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
</style>
