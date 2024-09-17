<template>
  <div class="container">
    <div v-if="uploadTabType == 'local'">
      <el-upload ref="uploadRef" style="padding: 0" :disabled="!loginStore.isLogin" v-model:file-list="fileList" drag
        :before-remove="beforeRemove" :auto-upload="false" :multiple="false" v-bind="$attrs" :on-change="fileListChange"
        :limit="1" :on-exceed="handleExceed" :accept="Utils.const.ImageFontModelFileAcceptString">
        <div class="placeholder">
          <icon-file-upload></icon-file-upload>
          <div>点击或拖拽上传</div>
        </div>
        <template #tip>
          <div class="tip">
            <div>
              支持 jpg,png,svg等图片格式 ，图片格式会自动添加到贴纸中,
              ttf,woff等字体格式 , glb 等模型格式
            </div>
          </div>
        </template>

        <template #file="{ file, url }">
          <div class="file-bar">
            <div class="file-bar-header">
              <desimage v-if="Utils.type.isImageName(file.name)" @focus="null" :src="file.url"
                style="height: 3.2rem; width: 3.2rem" fit="contain"></desimage>
              <el-icon v-else size="3.2rem">
                <component :is="fileTypeIcons[getFileSuffix(file.name)]"></component>
              </el-icon>

              <div style="font-size: 1.2rem">{{ file.name }}</div>

              <div style="flex: 1"></div>
              <div> {{ file.displaySize }} </div>
              <a-switch v-model:checked="file.isPublic" checked-children="公开" un-checked-children="私密" />
              <el-button @click="removeFile(file)" type="danger" link style="height: 2em"><el-icon size="2rem">
                  <CircleCloseFilled />
                </el-icon></el-button>
            </div>

            <div class="file-bar-name">
              <el-input v-model="file.customName" placeholder="资源名称" />
            </div>

            <div class="file-bar-description">
              <el-input v-model="file.description" placeholder="文件描述" type="textarea"
                :auto-size="{ minRows: 2, maxRows: 5 }" />
            </div>


            <div class="file-bar-tags">
              <tags-input v-model="file.tags"
                :autocompleteTags="Utils.type.isFontName(file.name) ? fontAutoplacementTags : imageAutoplacementTags"></tags-input>
            </div>

            <template v-if="Utils.type.isFontName(file.name)">
              <div class="flex items-center justify-center" style="padding:20px;">
                <div class="file-bar-font-preview" ref="fileBarFontPreviewRef" contenteditable="true"
                  @vue:mounted="initFontFamily(file, $event)">
                  {{ file.name }}
                </div>
              </div>
              <a-alert message="该图片会作为字体预览图，并且可以手动调整内容" type="info" />
            </template>

            <template v-if="Utils.type.isModelName(file.name)">
              <div class="w-full flex justify-center">
                <base-gltf-viewer ref="baseViewerRef" style="width: 200px; height: 200px;"
                  :src="objectUrl"></base-gltf-viewer>
              </div>
            </template>

          </div>
        </template>
      </el-upload>
    </div>

    <div v-if="uploadTabType == 'scan'" class="flex flex-col justify-center items-center">
      <div class="qrcode" style="width: 10rem; height: 10rem"></div>
      <div class="tip">打开app扫码上传</div>
    </div>
    <div class="footer">
      <el-button link type="danger"> {{ loginStore.isLogin ? '' : '当前未登录，请登录后再上传' }} </el-button>
      <div style="flex: 1"></div>
      <template v-if="uploadTabType == 'local'">
        <el-button round @click="uploadTabType = 'scan'" :icon="Iphone">
          APP 扫码上传
        </el-button>
        <el-button type="primary" round @click="doUpload" :loading="loading" :icon="UploadFilled"
          :disabled="fileList.length == 0">
          {{ fileList.length ? `上传该文件` : "选择文件" }}
        </el-button>
      </template>
      <template v-if="uploadTabType == 'scan'">
        <el-button round @click="uploadTabType = 'local'"> 返回本地上传 </el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, nextTick } from "vue";
import { message } from "ant-design-vue";
import Api, { uploadManyFile, createSticker, uploadFile } from "@/api";
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
import tags from "@/components/design/components/tags.vue";
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import { fontAutoplacementTags, imageAutoplacementTags } from '@/components/design/components/tagsInput/index.ts'

import { htmlToPngFile } from '@/common/transform'
import desimage from '@/components/image.vue';
import { createFontThumbnail } from '@/components/design/utils/utils'
import { toPng } from "html-to-image";
import Utils from '@/common/utils'
import { useLoginStatusStore } from "@/store/stores/login";
import { filesize } from "filesize";
import { genFileId } from 'element-plus'
import { uploadRef } from './index'
import baseGltfViewer from "@/components/model/baseGltfViewer/index.vue";


const loginStore = useLoginStatusStore()

/*
  scan 
  local
*/
const uploadTabType = ref("local");

/**
 *  @description 如果同时上传多个 ， 会多次调用
 * */

const objectUrl = ref()

function fileListChange(file) {
  // 为文件生成一个预览的路径
  file.url = URL.createObjectURL(file.raw);
  file.displaySize = filesize(file.size)
  objectUrl.value = URL.createObjectURL(file.raw);
}

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
  otf: iconFont,
};


/**
 * @description 暂时不支持多个文件上传
*/

async function handleExceed(files) {
  uploadRef.value!.clearFiles()
  const file = files[0]
  // 手动选择文件
  await nextTick()
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}


const baseViewerRef = ref()

function close() {
  loading.value = false;
}

/*
 如果上传的是字体的话，直接生成缩略图
*/
var id = 999;
function initFontFamily(file, e) {
  if (!Utils.type.isFontName(file.name)) {
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



// 文件列表
const fileList = ref([]);

function removeFile(file) {
  fileList.value.splice(fileList.value.indexOf(file), 1);
}


/**
 * @description 防止删除键将选中的文件删除
*/
function beforeRemove() {
  return false
}

const loading = ref(false);


const fileBarFontPreviewRef = ref()

async function uploadSingleFile(file) {

  file = toRaw(file)
  const keywords = file.tags && file.tags.join(",");

  if (Utils.type.isImageName(file.name)) {
    const { url } = await uploadToCOS({ file: file.raw });
    const params = {
      name: file.customName,
      size: file.size,
      url,
      keywords,
      type: "image", // 默认为图片贴纸, 图片统一为 image
      thumbnail: url,
      description: file.description,
      isPublic: file.isPublic,
      uploaderId: loginStore.userInfo.id
    };
    await createSticker(params);
  }

  if (Utils.type.isFontName(file.name)) {
    /* 需要生成缩略图 */

    const png = await htmlToPngFile(fileBarFontPreviewRef.value)

    const { url: thumbnailUrl } = await uploadToCOS({
      file: png
    })

    const { url: fileUrl } = await uploadToCOS({ file: file.raw })

    const params = {
      url: fileUrl,
      name: file.customName || file.raw.name,
      size: file.size,
      keywords,
      thumbnail: thumbnailUrl,
      description: file.description,
      isPublic: file.isPublic,
      uploaderId: loginStore.userInfo.id,
      type: file.name.split(".").pop()
    };

    await uploadFile(params);
  }


  if (Utils.type.isModelName(file.name)) {
    /* 需要生成缩略图 */

    const png = baseViewerRef.value.getScreenShotFile()

    const { url: thumbnailUrl } = await uploadToCOS({
      file: png
    })

    const { url: fileUrl } = await uploadToCOS({ file: file.raw })

    const params = {
      url: fileUrl,
      name: file.customName || file.raw.name,
      size: file.size,
      keywords,
      thumbnail: thumbnailUrl,
      description: file.description,
      isPublic: file.isPublic,
      uploaderId: loginStore.userInfo.id,
    };

    await Api.createProductModel(params);
  }
}

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
    await Promise.all(fileList.value.map(uploadSingleFile));
    message.success("上传成功!");
    // showUpload.value = false;
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
  padding: 1rem;
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
  font-size: 1rem;
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
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  color: #ccc;
}

.file-bar {
  border-radius: 4px;
  padding: 1em 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  row-gap: 1rem;
}

.file-bar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1em;
  display: flex;
  font-size: 1rem;
}

.file-bar-tags {
  display: flex;
  gap: 0.5em;
}



.footer {
  display: flex;
  align-items: center;
  padding: 3rem 1rem 1rem 1rem;
}

:deep(.el-upload-list) {
  max-height: 360px;
  overflow-y: auto;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }

}

:deep(.el-upload-list__item:hover) {
  // background-color: #fafafa;
  background-color: transparent;
}


.file-bar-font-preview {
  min-width: 100px;
  font-size: 48px;
  line-height: 64px;
  color: #000;
  background: transparent;
  padding: 0;
}
</style>
