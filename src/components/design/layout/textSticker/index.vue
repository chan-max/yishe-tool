<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-tab">
      <el-radio-group v-model="tab">
        <el-radio-button label="resource"
          ><el-icon><Picture /></el-icon> 网络贴纸
        </el-radio-button>
        <el-radio-button label="custom">
          <el-icon><EditPen /></el-icon>
          自定义贴纸
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="designiy-text-sticker-content">
      <custom v-if="tab === 'custom'"></custom>
      <resource v-if="tab === 'resource'"></resource>
    </div>
  </div>
</template>

<script setup lang="ts">
import custom from "./custom.vue";
import resource from "./resource.vue";
import { ref } from "vue";
import { EditPen, Picture } from "@element-plus/icons-vue";

const tab = ref("resource");
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

.designiy-text-sticker-content {
  height: 100%;
  overflow: auto;
}

.designiy-text-sticker-tab {
  .el-radio-group {
    width: 100%;
  }
  .el-radio-button {
    width: 50%;
  }
  .el-radio-button__inner {
    width: 100%;
    font-size: 10px !important;
    font-weight: 400;
    display: flex;
    justify-content: center;
    color: #aaa;
    align-items: center;
    padding: 10px !important;
    background-color: #f6f6f6;
    border-radius: 0 !important;
    border: none !important ;
    box-shadow: none !important;
  }
  .el-radio-button.is-active {
    .el-radio-button__inner {
      background-color: #fff;
      color: var(--1s-main);
    }
  }
}
</style>
