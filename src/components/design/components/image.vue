<template>
  <div>
    <el-image
      class="image"
      v-bind="$attrs"
      fit="contain"
      lazy
      @load="load($event, i)"
      style="width: 100%; height: 100%; padding: 12px"
    >
      <template #placeholder>
        <div class="image_loading"></div>
      </template>
      <template #error>
        <div class="image_error">
          <el-icon style="color: #888"><Picture /></el-icon>
        </div>
      </template>
    </el-image>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import { Picture, FolderOpened, Search, Operation } from "@element-plus/icons-vue";
import {
  currentController,
  showImageUplaod,
  showDecalControl,
} from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";

import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";

/*
 初始化可拖拽
*/

function load(e, info) {
  const img = e.target;
  initDraggableElement(img, async () => {
    const src = createImgObjectURL(img);
    const base64 = imgToBase64(img);

    currentController.value.stickToMousePosition(
      {
        img: img,
        type: "image",
        local: false,
        src: src,
        ...info,
        base64: base64,
      },
      () => {
        showDecalControl.value = true;
      }
    );
  });
}
</script>
<style lang="less" scoped>
.image {
  background-color: #efefef;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 100%;
  transition: all 0.3s;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }

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
