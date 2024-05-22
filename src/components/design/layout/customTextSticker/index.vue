<template>
  <div class="main">
    <header></header>
    <sticker-canvas class="canvas"></sticker-canvas>
    <operating-form></operating-form>
    <footer>
      <el-button-group size="small">
        <el-button @click="exportTextStickerPng"> 导出png </el-button>
        <!-- <el-button @click="exportTextStickerSvg" type="primary"> 导出svg </el-button> -->
        <el-button> 上传 </el-button>
        <el-button> 分享 </el-button>
      </el-button-group>
    </footer>
  </div>
</template>
<script setup>
import stickerCanvas from "./canvas.vue";
import operatingForm from "./operatingForm.vue";
import { uploadTextSticker } from "@/api";
import { base64 } from "./watch";
import { base64ToFile } from "@/common/transform/base64ToFile";
import { exportTextStickerSvg, exportTextStickerPng } from "./watch";

async function save() {
  await uploadTextSticker({
    img: base64ToFile(base64.value),
  });
}
</script>
<style lang="less" scoped>
header {
  width: 90%;
  height: 20px;
}
.main {
  height: 100%;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas {
  width: 300px;
  height: 300px;
}

footer {
  padding: 1em;
  width: 100%;
}
</style>
