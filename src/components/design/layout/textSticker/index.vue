<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:57
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-25 23:09:19
 * @FilePath: /1s/src/components/design/layout/textSticker/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-header">
      <el-input v-model="input" placeholder="寻找文字贴纸">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #suffix>
          <el-icon><Operation /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="designiy-text-sticker-body">
      <resource></resource>
    </div>
  </div>
</template>

<script setup lang="ts">
import resource from "./resource.vue";
import { ref } from "vue";
import { Search, Operation, FolderOpened } from "@element-plus/icons-vue";
const input = ref("");
const value = ref()
const options = ref([])
</script>
<style lang="less">
.designiy-text-sticker {
  display: flex;
  flex-direction: column;
  width: auto;
  width: 300px;
  height: 100%;
  justify-content: space-between;
}


.designiy-text-sticker-header {
  padding: 10px;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  .el-input__wrapper {
    box-shadow: none;
    background-color: #f9f9f9;
    font-size: 12px;
  }
}

.designiy-text-sticker-body {
  flex:1;
  overflow: auto;
}

</style>
