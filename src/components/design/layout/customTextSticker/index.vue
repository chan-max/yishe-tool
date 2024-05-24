<template>
  <div class="main">
    <header></header>
    <sticker-canvas class="canvas"></sticker-canvas>
    <operating-form></operating-form>
    <footer>
      <el-button-group size="small" link>
        <el-button :loading="loading" @click="exportPng"> 导出 png </el-button>
        <!-- <el-button @click="exportTextStickerSvg" type="primary"> 导出svg </el-button> -->

        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="暂不"
          title="确认要上传该贴纸吗"
        >
          <template #reference>
            <el-button> 上传 </el-button>
          </template>
        </el-popconfirm>

        <el-button> 暂存到工作台 </el-button>
        <el-button> 分享 </el-button>
      </el-button-group>
    </footer>
  </div>
</template>
<script setup>
import { ref } from "vue";
import stickerCanvas from "./canvas.vue";
import operatingForm from "./operatingForm.vue";
import { uploadTextSticker, createStickerApi } from "@/api";
import { base64 } from "./watch";
import { base64ToFile } from "@/common/transform/base64ToFile";
import { exportTextStickerSvg, exportTextStickerPng } from "./watch";

const loading = ref(false);

function exportPng() {
  loading.value = true;
  exportTextStickerPng();
  loading.value = false;
}

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
