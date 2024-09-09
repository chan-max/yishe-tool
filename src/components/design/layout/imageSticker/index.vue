<template>
  <div class="designiy-image-sticker">
    <div class="designiy-image-sticker-header">
      <el-input v-model="input" placeholder="搜索贴纸">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #suffix>
          <el-icon><Operation /></el-icon>
        </template>
      </el-input>
    </div>
    <div
      class="designiy-image-sticker-content"
      v-infinite-scroll="scroll"
      :infinite-scroll-distance="150"
      :infinite-scroll-disabled="disabled || loading"
    >
      <div class="item" title="拖动来进行贴图" v-for="i in list" draggable="false">
        <el-image
          @load="load($event, i)"
          :src="i.preview_img"
          style="width: 100%; height: 100%"
          fit="contain"
          lazy
        >
          <template #placeholder>
            <div class="item_loading"></div>
          </template>
          <template #error>
            <div class="item_error">
              <el-icon style="color: #888"><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </div>
    <div class="designiy-image-sticker-footer">
      <el-button type="pirmary" @click="showImageUplaod = true"> 上传图片 </el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { currentModelController } from "../../store";
import { Picture, FolderOpened, Search, Operation } from "@element-plus/icons-vue";
import { getImage } from "@/api/index";
import { initDraggableElement } from "../../utils/draggable";
import { showImageUplaod } from "../../store";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";

const input = ref();

const list = ref([]);

// image load success
function load(e, info) {
  const img = e.target;
  initDraggableElement(img, () => {
    const src = createImgObjectURL(img);
    const base64 = imgToBase64(img);

    currentModelController.value.stickToMousePosition({
      img: img,
      type: "image",
      isLocalResource: false,
      src: src,
      ...info,
      base64: base64,
    });
  });
}

const page = ref(1);
const disabled = ref(false);
const pages = ref();
const loading = ref(false);

async function scroll() {
  if (page.value > pages.value) {
    return;
  }

  loading.value = true;
  const res = await getImage({
    page: page.value++,
  });

  if (!res.list.length) {
    disabled.value = true;
    return false;
  }

  pages.value = res.pages;
  list.value = list.value.concat(res.list);
  loading.value = false;
}
</script>
<style lang="less" scoped>
.designiy-image-sticker {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.designiy-image-sticker-header {
  padding: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  .el-input__wrapper {
    box-shadow: none;
    background-color: #f6f6f6;
    font-size: 12px;
  }
  .el-cascader {
    width: 100%;
  }
}

.designiy-image-sticker-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  justify-content: space-between;
  padding: 10px;
  column-gap: 4px;
  row-gap: 4px;
  .el-image {
    display: block;
  }
}

.designiy-image-sticker-footer {
  width: 100%;
  padding: 10px;
  button {
    width: 100%;
  }
}

.item {
  width: calc(50% - 2px);
  height: 100px;
  background-color: var(--1s-image-sticker-image-background-color);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  &_loading {
    width: 100%;
    height: 100%;
    list-style: none;
    background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    background-position: 100% 50%;
    animation: skeleton-loading 1.4s ease infinite;
  }
  &_error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@keyframes rolling {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
