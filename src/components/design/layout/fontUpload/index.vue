<template>
  <div class="designiy-font-upload">
    <el-upload
      class="designiy-font-upload-main"
      :auto-upload="false"
      :show-file-list="false"
      v-model:file-list="files"
      :limit="1"
      :on-exceed="handleExceed"
      ref="upload"
      accept="ttf"
      :disabled="files[0]"
      drag
    >
      <div
        v-if="files[0]"
        ref="previewEl"
        class="designiy-font-upload-preview"
        contenteditable="true"
      >
        breaking bad
      </div>

      <div v-else class="designiy-font-upload-placeholder">
        <icon-upload style="width: 20px; height: 20px"></icon-upload>
        <div style="font-size: 12px">点击或拖拽文件上传</div>
      </div>
    </el-upload>
    <el-divider content-position="right">
      <span style="font-size: 10px; color: #999; font-weight: 400"
        >支持类型 ttf woff</span
      >
    </el-divider>
    <el-input placeholder="定义字体名称" style="font-size: 10px"></el-input>
    <el-input
      type="textarea"
      placeholder="定义字体描述"
      style="font-size: 10px"
    ></el-input>
    <div class="designiy-font-upload-footer">
      <el-button size="small" @click="clear" text> 清除 </el-button>
      <el-button size="small" type="primary" @click="submit"> 上传 </el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch, computed, shallowRef, nextTick } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { genFileId } from "element-plus";
import iconUpload from "@/icon/upload-normal.svg?vueComponent";

import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import { uploadFont } from "@/api";
import { base64ToFile } from "../../../../common/transform/base64ToFile";

const files = ref([]);
const upload = ref();
const previewEl = ref();

var id = 0;

//
watch(files, async (files) => {
  await nextTick();
  const file = files[0];
  const { name, size, raw } = file;
  previewEl.value.innerHTML = name;
  let fontId = id++;
  const fontStyles = document.createElement("style");
  fontStyles.innerHTML = `
      @font-face {
          font-family: font${fontId};
          src: url(${URL.createObjectURL(file.raw)}); /* 替换为实际的字体文件相对路径 */
      }
    `;
  document.head.appendChild(fontStyles);
  previewEl.value.style.fontFamily = ` font${fontId++}`;
});

function handleExceed(files) {
  upload.value.clearFiles();
  const file = files[0];
  upload.value.handleStart(file);
}

function clear() {
  upload.value.clearFiles();
}

async function submit() {
  const base64 = await toPng(previewEl.value);
  await uploadFont({
    file: files.value[0].raw,
    img: base64ToFile(base64),
  });
}
</script>

<style lang="less">
.designiy-font-upload {
  padding: 20px;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.designiy-font-upload-main {
  .el-upload-dragger {
    width: 480px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-upload-dragger {
    padding: 0;
  }
}

.designiy-font-upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 5px;
}

.designiy-font-upload-footer {
  display: flex;
  justify-content: right;
}

.designiy-font-upload-preview {
  outline-style: none;
  font-size: 40px;
  color: #000;
}
</style>
