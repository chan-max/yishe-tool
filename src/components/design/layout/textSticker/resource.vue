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
    </div>
    <div class="designiy-text-sticker-resource-content">
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Operation } from "@element-plus/icons-vue";
import { ref } from "vue";
</script>

<style>
.designiy-text-sticker-resource {
  display: flex;
  height:100%;
  flex-direction: column;
  .el-input__wrapper {
    box-shadow: none;
    background-color: #f9f9f9;
    font-size: 12px;
  }
}

.designiy-text-sticker-resource-header {
    padding:10px;
}

.designiy-text-sticker-resource-content {
  width: 100%;
  flex: 1;
  overflow: auto;
}
</style>
