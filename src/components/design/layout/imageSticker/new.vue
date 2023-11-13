<template>
  <fold>
    <template #header> 最近更新 </template>
    <template #content>
      <div class="section">
        <div class="item" title="拖动来进行贴图" v-for="i in images" draggable="false">
          <el-image
            @load="load($event, i)"
            :src="i.fullpath"
            style="width: 100%; height: 100%"
            fit="contain"
            lazy
          >
            <template #placeholder>
              <div class="item_loading">
                <el-icon class="rolling-icon"><Loading /></el-icon>
              </div>
            </template>
            <template #error>
              <div class="item_error">
                <el-icon style="color: #888"><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>
    </template>
  </fold>
</template>

<script setup lang="ts">
import fold from "./fold.vue";
import { onMounted, ref, computed } from "vue";
import {
  showBaseModelSelectDialog,
  currentModelInfo,
  canvasBgColor,
  canvasBgOpacity,
} from "../../store.ts";
import { Loading, CloseBold, CircleCloseFilled, Picture } from "@element-plus/icons-vue";
import { getImageList } from "@/api/index";
import { initDraggableElement } from "../../utils/draggable";
import { Search, Operation } from "@element-plus/icons-vue";
import newImage from "./new.vue";

const emits = defineEmits(["dragover"]);

const images = ref([]);

// image load success
function load(e, info) {
  initDraggableElement(e.target, (img) => {
    emits("dragover", img, info);
  });
}

onMounted(async () => {
  images.value = await getImageList();
});
</script>

<style lang="less">
.section {
  columns: 2;
  column-gap: 5px;
  .el-image {
    display: block;
  }
}

.item {
  margin-bottom: 5px;
  background-color: var(--1s-image-sticker-image-background-color);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  &_loading,
  &_error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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

.rolling-icon {
  animation: rolling 3s linear infinite;
}
</style>
