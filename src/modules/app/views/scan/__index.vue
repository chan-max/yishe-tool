<template>
  <ion-page>
    <div class="scan">
      <video
        class="scan-video"
        :class="facingUser && 'video-flip'"
        ref="videoEl"
        playsinline
      ></video>
      <canvas class="scan-canvas" style="display: none" ref="canvasEl"></canvas>
      <div class="scan-main-left">
        <icon-close @click="close"></icon-close>
        <icon-switch-camera @click="switchCamera"></icon-switch-camera>
      </div>
    </div>
    <canvas ref="canvas" style="display:none;"></canvas>
  </ion-page>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, shallowRef } from "vue";
import iconClose from "@/icon/mobile/close.svg?component";
import iconSwitchCamera from "@/icon/mobile/switch-camera.svg?component";
import { IonPage } from "@ionic/vue";

import {
  cameraUsable,
  facingModeEnvironmentOption,
  facingModeUserOption,
} from "./media.ts";
import { showDialog, showConfirmDialog } from "vant";
import { useRouter } from "vue-router";
import jsQR from "jsqr";

const canvas = ref()

const router = useRouter();

// 验证相机是否可用
onMounted(async () => {
  startCamera();
});

// 关闭扫码页面
function close() {
  router.back();
}

// 当前选中的操作页面
const active = ref();

const canvasEl = ref();

const videoEl = ref(null);

// 当前使用的视频选项
const currentFacingMode = shallowRef(facingModeUserOption);

const facingUser = computed(() => {
  return currentFacingMode.value === facingModeUserOption;
});

function stopMediaTracks(stream) {
  if (!stream) {
    return;
  }
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

// 切换摄像头
const switchCamera = () => {
  stopMediaTracks(videoEl.value.srcObject);
  currentFacingMode.value =
    currentFacingMode.value === facingModeUserOption
      ? facingModeEnvironmentOption
      : facingModeUserOption;
  startCamera();
};

function startCamera() {
  navigator.mediaDevices
    .getUserMedia(currentFacingMode.value)
    .then(function (mediaStream) {
      videoEl.value.srcObject = mediaStream;
      play();
    })
    .catch((e) => {
      showConfirmDialog({
        title: "提示",
        message: "摄像头启动失败，是否重试",
        confirmButtonText: "重试",
        cancelButtonText: "返回",
        confirmButtonColor: "var(--van-text-color)",
        cancelButtonColor: "var(--van-text-color)",
      })
        .then(() => {
          startCamera();
        })
        .catch(() => {
          router.replace({ name: "HomeIndex" });
        });
    });
}

function play() {
  try {
    videoEl.value.play();
    videoEl.value.ontimeupdate = () => {
      
    }
  } catch (e) {
    // 可能由于非用户触发的
    showConfirmDialog({
      title: "提示",
      message: "摄像头启动失败，是否重试",
      confirmButtonText: "重试",
      cancelButtonText: "返回",
      confirmButtonColor: "var(--van-text-color)",
      cancelButtonColor: "var(--van-text-color)",
    });
  }
}



onBeforeUnmount(() => {
  stopMediaTracks(videoEl.value.srcObject);
});
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
