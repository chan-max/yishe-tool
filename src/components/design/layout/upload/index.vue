<template>
  <div class="container">
  <!-- <div style="padding:1em 0;">
    <el-radio-group v-model="uploadTabType">
      <el-radio-button label="本地上传" value="local" />
      <el-radio-button label="扫码上传" value="scan"/>
    </el-radio-group>
  </div> -->
    <div v-if="uploadTabType == 'local'">
      <el-upload
        style="padding: 0"
        v-model:file-list="fileList"
        drag
        :auto-upload="false"
        multiple
        v-bind="$attrs"
        accept="image/png, image/jpeg, image/svg+xml, font/ttf, font/woff"
      >
        <div class="placeholder">
          <icon-file-upload></icon-file-upload>
          <div style="font-size: 12px">点击或拖拽上传</div>
          <!-- <div> 
            <el-button size="small"> 扫码上传 </el-button>
            <el-button size="small">  扫码上传 </el-button>
          </div> -->
        </div>
        <template #tip>
          <div class="tip">
            <div>
              支持 jpg，png，svg等图片格式 ，图片格式会自动添加到贴纸中,
              ttf，woff等字体格式,字体可以在我的字体中查看
            </div>
          </div>
        </template>
        <template #file="{ file, url }">
          <div class="file-bar">
            <template v-if="isImg(file.name)">
              <el-image :src="getPreviewUrl(file.raw)" style="height: 2em"></el-image>
              <div>
                {{ file.name }}
              </div>
              <div style="flex: 1"></div>
              <el-tooltip content="图片会自动上传到贴纸" placement="top">
                <el-icon size="1.2rem"><Warning /></el-icon>
              </el-tooltip>

              <el-button @click="removeFile(file)" type="danger" link
                ><el-icon size="2rem"><CircleCloseFilled /></el-icon
              ></el-button>
            </template>
            <template v-else-if="isFont(file.name)">
              <el-icon size="2em"
                ><component :is="fileTypeIcons[getFileSuffix(file.name)]"></component
              ></el-icon>
              <div style="font-size: 1.6em" @vue:mounted="initFontFamily(file, $event)">
                {{ file.name }}
              </div>
              <div style="flex: 1"></div>
              <el-tooltip content="左侧的文字会自动生成缩略图" placement="top">
                <el-icon size="1.2rem"><Warning /></el-icon>
              </el-tooltip>
              <el-button @click="removeFile(file)" type="danger" link
                ><el-icon size="2rem"><CircleCloseFilled /></el-icon
              ></el-button>
            </template>
          </div>
        </template>
      </el-upload>

    </div>
    <div v-if="uploadTabType == 'scan'" class="flex flex-col justify-center items-center">
      <div class="qrcode" style="width:10rem;height:10rem;">
        
      </div>
      <div class="tip">
        打开app扫码上传
      </div>
    </div> 
    <footer>
        <div style="flex: 1"></div>
        <template v-if="uploadTabType == 'local'">
          <el-button round @click="uploadTabType = 'scan'"  :icon="Iphone"> APP 扫码上传 </el-button>
        <el-button
          type="primary"
          round
          @click="doUpload"
          :loading="loading"
          :icon="UploadFilled"
        >
          本地上传
        </el-button>
        </template>
        <template  v-if="uploadTabType == 'scan'">
          <el-button round @click="uploadTabType = 'local'" > 返回本地上传 </el-button>
        </template>
      </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import fileUpload from "./fileUpload/index.vue";
import { message } from "ant-design-vue";
import { uploadManyFile, createStickerApi, uploadFile } from "@/api";
import { uploadToCOS } from "@/api/cos";
import { showUpload } from "@/components/design/store.ts";
import {
  UploadFilled,
  CircleCloseFilled,
  QuestionFilled,
  View,
  Warning,
  Iphone,
} from "@element-plus/icons-vue";
import iconFileUpload from "@/icon/file-upload.svg";
import iconImg from "@/icon/fileType/img.svg";
import iconFont from "@/icon/fileType/font.svg";
import iconGlb from "@/icon/fileType/glb.svg";

/*
  scan 
  local
*/
const uploadTabType = ref('local')

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

function isImg(name) {
  return ["png", "svg", "jpeg", "jpg"].includes(name.split(".").pop());
}

function isFont(name) {
  return ["otf", "ttf", "woff"].includes(name.split(".").pop());
}

function close() {
  loading.value = false;
}

/*
 如果上传的是字体的话，直接生成缩略图
*/
var id = 999;
function initFontFamily(file, e) {
  if (!isFont(file.name)) {
    return;
  }

  const el = e.el;
  const fontId = `font_${id++}`;
  const style = document.createElement("style");

  style.innerHTML = `
                @font-face {
                    font-family: ${fontId};
                    src: url(${URL.createObjectURL(file.raw)});
                }
              `;

  document.head.appendChild(style);

  el.style.fontFamily = fontId;
  // 在文件列表中保存当前元素，用于获取缩略图
  file.el = el;
}

const fileList = ref([]);

function removeFile(file) {
  fileList.value.splice(fileList.value.indexOf(file), 1);
}

function getPreviewUrl(file) {
  return URL.createObjectURL(file);
}

function previewFile(file) {}

const loading = ref(false);

async function doUpload() {
  if (!fileList.value.length) {
    return;
  }

  /*
   上传时区分 图片和字体等其他文件
   图片直接上传到 贴纸
   其他上传到文件
 */

  loading.value = true;

  try {
    await Promise.all(
      fileList.value.map(async (file) => {
        const type = getFileSuffix(file.name);
        if (["jpg", "png", "svg"].includes(type)) {
          const { url } = await uploadToCOS({ file: file.raw });
          const params = {
            name: file.raw.name,
            size: file.size,
            url,
            type: "image", // 默认为图片贴纸,
            thumbnail: url,
          };
          await createStickerApi(params);
        } else {
          /* 需要生成缩略图 */
          const params = {
            raw: file.raw,
            name: file.raw.name,
            size: file.size,
          };
          await uploadFile(params);
        }
        return;
      })
    );

    message.success("上传成功!");
    showUpload.value = false;
    loading.value = false;
    fileList.value = [];
  } catch (e) {
    message.error("上传失败!");
    loading.value = false;
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 1em;
  width: 600px;
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
  padding: 1em;
  font-size: 1em;
  font-weight: bold;
  width: 100%;
  color: #ccc;
}

.file-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1em;
  background: #f3f5f7;
  border-radius: 4px;
  display: flex;
  padding: 0.5em 1em;
  font-size: 12px;
}

footer {
  display: flex;
  align-items: center;
  padding: 1em;
}

</style>
