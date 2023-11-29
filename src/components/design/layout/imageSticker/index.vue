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
    <div class="designiy-image-sticker-content">
      <div class="item" title="拖动来进行贴图" v-for="i in images" draggable="false">
        <el-image
          @load="load($event, i)"
          :src="i.fullpath"
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
import {
  showBaseModelSelect,
  currentOperatingModelInfo,
  canvasBgColor,
  canvasBgOpacity,
  currentController,
} from "../../store";
import {
  Loading,
  CloseBold,
  CircleCloseFilled,
  Picture,
  FolderOpened,
  Search,
  Operation,
} from "@element-plus/icons-vue";
import { getImage } from "@/api/index";
import { initDraggableElement } from "../../utils/draggable";
import { showImageUplaod ,showDecalControl} from "../../store";

const value = ref("");

const options = [
  {
    value: "mine",
    label: "我的上传",
  },
  {
    value: "saved",
    label: "我的收藏",
  },
];

const images = ref([]);

// image load success
function load(e, info) {
  initDraggableElement(e.target, () => {
    currentController.value.stickToMousePosition({
      src: info.fullpath,
    });
    showDecalControl.value = true
  });
}

onMounted(async () => {
  images.value = await getImage();
});
</script>
<style lang="less">
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
  overflow: auto;
  padding: 10px;
  columns: 2;
  column-gap: 5px;
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
  margin-bottom: 5px;
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
