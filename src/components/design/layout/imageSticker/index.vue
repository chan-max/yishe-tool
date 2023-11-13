<template>
  <div class="designiy-image-sticker">
    <div class="designiy-image-sticker-header">
      <el-input v-model="input" placeholder="搜索贴纸">
        <template #prefix>
          <el-icon ><Search /></el-icon>
        </template>
        <template #suffix>
          <el-icon><Operation /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="designiy-image-sticker-content">
      <new-image></new-image>
    </div>
  </div>
</template>
<script setup>
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
import fold from './fold.vue'
import newImage from './new.vue'

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
.designiy-image-sticker {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.designiy-image-sticker-header{
  padding:10px;
  .el-input__wrapper {
    box-shadow: none;
    background-color: #f6f6f6;
    font-size: 12px;
  }
}

.designiy-image-sticker-content{
  flex:1;
  overflow:auto;
  padding:10px;
}
</style>
