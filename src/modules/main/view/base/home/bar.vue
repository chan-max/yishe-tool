<template>
  <div class="bar-container">
    <div class="bar">
      <div></div>
      <div>
        <el-button class="button" plain @click="$router.push({ name: 'Design' })">
          快速开始
        </el-button>
      </div>
    </div>

    <div class="bar">
      <div></div>
      <div>
        <el-button class="button" plain @click="dialogVisible = true">
          制作文字贴纸
        </el-button>
      </div>
    </div>
    <div class="bar">
      <div></div>
      <div>
        <el-button class="button" plain @click="dialogVisible = true">
          制作图片贴纸
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import fileUpload from "./fileUpload/index.vue";
import { message } from "ant-design-vue";
import { uploadManyFile } from "@/api";
import {
  UploadFilled,
  CircleCloseFilled,
  QuestionFilled,
  View,
} from "@element-plus/icons-vue";
import iconFileUpload from "@/icon/file-upload.svg";
import iconImg from "@/icon/fileType/img.svg";
import iconFont from "@/icon/fileType/font.svg";
import iconGlb from "@/icon/fileType/glb.svg";

/* 获取文件后缀 */
function getFileSuffix(filename) {
  return filename.split(".").pop();
}

const fileTypeIcons = {
  jpg: iconImg,
  png: iconImg,
  svg: iconImg,
  ttf: iconFont,
  glb: iconGlb,
};

function close() {
  loading.value = false;
}

const dialogVisible = ref(false);

const fileList = ref([]);

function removeFile(file) {
  fileList.value.splice(fileList.value.indexOf(file), 1);
}

function previewFile(file) {}

const loading = ref(false);

async function doUpload() {
  if (!fileList.value.length) {
    return;
  }

  loading.value = true;
  const params = fileList.value.map((item: any) => {
    return {
      raw: item.raw,
      name: item.raw.name,
      size: item.size,
      type: getFileSuffix(item.name),
    };
  });
  uploadManyFile(params).catch(() => {
    message.success("上传失败!");
    loading.value = false;
  });
  message.success("上传成功!");
  loading.value = false;
  dialogVisible.value = false;
  fileList.value = [];
}
</script>

<style lang="less" scoped>
.bar {
  width: 100%;
  height: 300px;
  background: #f8f8f8;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 5%;
  justify-content: space-between;
  box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
  // animation: gradient 20s infinite;
}

@keyframes gradient {
  0% {
    background: red;
  }
  33% {
    background: green;
  }
  66% {
    background: blue;
  }
  100% {
    background: red;
  }
}

.button {
  background: transparent;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 2505, 0.9);
  color: rgba(0, 0, 0, 0.9);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  padding: 1em;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  opacity: 0.8;
  font-weight: bold;
}

.button:hover {
  opacity: 1;
  transform: scale(1.05);
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  row-gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep .el-upload-dragger {
  background: #fff !important;
}

.tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  font-size: 12px;
  font-weight: bold;
  color: #ccc;
}

.file-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 12px;
  background: #f3f5f7;
  border-radius: 4px;
  display: flex;
  padding: 8px 12px;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.bar-container {
  width: 92%;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}
</style>
