<template>
  <div class="container flex flex-col items-center">
    <div class="qrcode-container flex items-center justify-center">
      <img ref="imgRef" class="img" />
      <div ref="qrCodeRef" class="qrcode"></div>
    </div>
    <div class="operation">
      <el-input
        v-model="qrCodeOptions.text"
        type="textarea"
        placeholder=""
        size="small"
      ></el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "easyqrcodejs";
import { useElementSize } from "@vueuse/core";
import { ref, onMounted, nextTick, watchEffect, watch } from "vue";
import { timeout } from "@/common/time";
import { qrCodeOptions, barCodeOptions } from "@/components/design/store.ts";
import { initDraggableElement } from "@/components/design/utils/draggable";
import {
  currentModelController,
  showImageUplaod,
  showDecalControl,
} from "@/components/design/store";
import {
  imgToFile,
  createImgObjectURL,
  imgToBase64,
  canvasToBase64,
} from "@/common/transform/index";

window.qrcode = QRCode

// 二维码容器
const qrCodeRef = ref();

// 图片ref
const imgRef = ref();

const { width, height } = useElementSize(qrCodeRef);

const canvasEl = ref();

async function createQrCode() {
  // 清除旧二维码
  if (canvasEl.value) {
    canvasEl.value.parentElement.removeChild(canvasEl.value);
  }
  await timeout(33);

  qrCodeOptions.value.width = width.value;
  qrCodeOptions.value.height = height.value;
  var qr = new QRCode(qrCodeRef.value, qrCodeOptions.value);
  canvasEl.value = qr._el.querySelector("canvas");

  const base64 = canvasToBase64(canvasEl.value);

  const img = imgRef.value;
  img.src = base64;
  initDraggableElement(img, async () => {
    const src = createImgObjectURL(img);
    const base64 = imgToBase64(img);

    currentModelController.value.stickToMousePosition(
      {
        img: img,
        type: "qrcode",
        local: false,
        src: src,
        base64: base64,
      },
      () => {
        // showDecalControl.value = true;
      }
    );
  });
}

watch(
  qrCodeOptions,
  () => {
    createQrCode();
  },
  {
    deep: true,
  }
);

onMounted(() => {
  createQrCode();
});
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 300px;
  background-color: #fff;
}

.qrcode-container {
  width: 260px;
  height: 260px;
  position: relative;
  margin: 20px;
}
.qrcode {
  width: 260px;
  height: 260px;
  visibility: hidden;
}

.operation {
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: 1em;
}

.img {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
