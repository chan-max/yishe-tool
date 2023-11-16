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
      <el-select v-model="value" placeholder="选择图片分类">
        <template #prefix>
          <el-icon><FolderOpened /></el-icon>
        </template>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="designiy-image-sticker-content">
      <content @dragover="dragover"></content>
    </div>
    <div class="designiy-image-sticker-footer">
      <el-button type="pirmary"  @click="showImageUplaodContainer = true"> 上传图片 </el-button>
    </div>
  </div>
</template>
<script setup>
import { FolderOpened } from "@element-plus/icons-vue";

import { Search, Operation } from "@element-plus/icons-vue";
import content from "./content.vue";
import {ref} from 'vue'
import { showImageUplaodContainer } from "../../store";

const value = ref('')

const options = [
  {
    value: 'mine',
    label: '我的上传',
  },
  {
    value: 'saved',
    label: '我的收藏',
  },
]


const emits = defineEmits(["dragover"]);

function dragover() {
  emits("dragover", ...arguments);
}

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
}

.designiy-image-sticker-footer {
  width: 100%;
  padding: 10px;
  button {
    width: 100%;
  }
}
</style>
