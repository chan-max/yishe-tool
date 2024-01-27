<template>
  <div class="scan">
    <div class="scan-main">
      <canvas class="scan-canvas" ref="canvasEl"></canvas>

      <video
        class="scan-video"
        :class="facingModeIsUser && 'video-flip'"
        ref="videoEl"
        playsinline
      ></video>

      <div class="scan-main-left">
        <icon-close @click="close"></icon-close>
        <icon-switch-camera @click="switchCamera"></icon-switch-camera>
      </div>
      <div class="scan-main-right">right</div>

    </div>
    <div class="scan-tabs">
      <van-tabs v-model:active="active">
        <van-tab title="二维码" name="qrcode"></van-tab>
        <van-tab title="条形码" name=""></van-tab>
        <van-tab title="ai换装"></van-tab>
        <van-tab title="特效"></van-tab>
        <van-tab title="自拍"></van-tab>
        <van-tab title="识别模型"></van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, shallowRef } from "vue";
import iconClose from "@/icon/mobile/close.svg?component";
import iconSwitchCamera from "@/icon/mobile/switch-camera.svg?component";
import {
  cameraUsable,
  facingModeEnvironmentOption,
  facingModeUserOption,
} from "./media.ts";
import { showDialog, showConfirmDialog } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

// 验证相机是否可用
onMounted(async () => {
  if (!cameraUsable()) {
    await showDialog({
      title: "提示",
      message: "摄像头不可用",
      confirmButtonText: "返回",
      confirmButtonColor: "var(--van-text-color)",
    });
    router.replace({ name: "Home" });
  } else {
    startCamera();
  }
});

// 关闭扫码页面
function close() {}

// 当前选中的操作页面
const active = ref();

const canvasEl = ref();

const videoEl = ref(null);
let currentStream = null;

// 当前使用的视频选项
const currentFacingMode = shallowRef(facingModeUserOption);

const facingModeIsUser = computed(() => {
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
    .catch(() => {
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
          router.replace({ name: "Home" });
        });
    });
}



function play() {
  try {
    videoEl.value.play();
    // nextFrame(() => {
    //   let ctx = canvasEl.value.getContext("2d");
    //     ctx.drawImage(videoEl.value, 0, 0, canvasEl.value.width, canvasEl.value.height);
    // })

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
}

.scan-main {
  width: 100%;
  height: 100%;
  position: relative;
}

.scan-video {
  display: flex;
  width: 100%;
  height: 100%;
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

.scan-tabs {
  margin: 10px;
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
