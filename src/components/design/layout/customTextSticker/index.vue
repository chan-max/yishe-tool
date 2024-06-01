<template>
  <div class="main">
    <header></header>
    <sticker-canvas class="canvas"></sticker-canvas>
    <operating-form></operating-form>
    <footer>
      <el-button-group link style="width: 100%">
        <el-button :loading="loading" @click="exportPng"> 导出 png </el-button>
        <!-- <el-button @click="exportTextStickerSvg" type="primary"> 导出svg </el-button> -->
        <el-button> 分享 </el-button>
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="暂不"
          @confirm="upload"
          title="确认要上传该贴纸吗"
        >
          <template #reference>
            <el-button> 上传 </el-button>
          </template>
        </el-popconfirm>
      </el-button-group>
    </footer>
  </div>
</template>
<script setup>
import { ref } from "vue";
import stickerCanvas from "./canvas.vue";
import operatingForm from "./operatingForm.vue";
import { uploadTextSticker, createStickerApi, uploadToCOS } from "@/api";
import { base64 } from "./watch";
import { base64ToFile } from "@/common/transform/base64ToFile";
import {
  exportTextStickerFile,
  exportTextStickerPng,
  exportTextStickerSvg,
} from "./watch";
import { message } from "ant-design-vue";

const loading = ref(false);

/*
 导出本地png格式
*/
function exportPng() {
  loading.value = true;
  exportTextStickerPng();
  loading.value = false;
}

async function upload() {
  let file = await exportTextStickerFile();
  let { url } = await uploadToCOS({ file: file });
  await createStickerApi({
    url,
    thumbnail: url,
    type: "text",
  });
  message.success("上传成功");
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
  .el-button-group {
    display: flex;
    .el-button {
      flex: 1;
    }
  }
}
</style>
