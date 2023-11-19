<template>
  <div class="designiy-text-sticker-resource">
    <div class="designiy-text-sticker-resource-header">
      <el-input v-model="input" placeholder="寻找文字贴纸">
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
    <div class="designiy-text-sticker-resource-content">
      <div class="designiy-text-sticker-resource-item" v-for="i in 20"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Operation, FolderOpened } from "@element-plus/icons-vue";
import { ref } from "vue";

const input = ref("");
</script>

<style>
.designiy-text-sticker-resource {
  display: flex;
  height: 100%;
  flex-direction: column;
  .el-input__wrapper {
    box-shadow: none;
    background-color: #f9f9f9;
    font-size: 12px;
  }
}

.designiy-text-sticker-resource-header {
  padding: 10px;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
}

.designiy-text-sticker-resource-content {
  width: 100%;
  flex: 1;
  columns: 2;
  column-gap: 5px;
  overflow: auto;
  padding:10px;
}

.designiy-text-sticker-resource-item{
  height:100px;
  margin-bottom: 5px;
}

</style>
