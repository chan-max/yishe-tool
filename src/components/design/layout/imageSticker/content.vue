<template>
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

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import {
  showBaseModelSelectContainer,
  currentModelInfo,
  canvasBgColor,
  canvasBgOpacity,
} from "../../store";
import { Loading, CloseBold, CircleCloseFilled, Picture } from "@element-plus/icons-vue";
import { getImageList } from "@/api/index";
import { initDraggableElement } from "../../utils/draggable";
import { Search, Operation } from "@element-plus/icons-vue";
const emits = defineEmits(["dragover"]);

const images:any = ref([]);

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
  &_loading{
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
