<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-14 19:04:03
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-18 09:13:42
 * @FilePath: /yishe/src/components/design/layout/subHeaderMenu/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-sub-header">
    <div style="font-size: 12px; line-height: 12px; color: #555">
      {{ isEdit ? "编辑" : "新建" }}
    </div>

    <div style="display: flex">
      <div class="designiy-sub-header-button">
        <icon-prev class="designiy-sub-header-icon"></icon-prev>
        撤销
      </div>

      <div class="designiy-sub-header-button">
        <!-- 图标暂时用翻转代替 -->
        <icon-prev
          style="transform: rotateY(180deg)"
          class="designiy-sub-header-icon"
        ></icon-prev>
        重做
      </div>
    </div>

    <div style="flex: 1"></div>

    <el-tooltip content="截屏">
      <icon-camera
        @click="$emit('takephoto')"
        style="width: 16px; height: 16px"
      ></icon-camera>
    </el-tooltip>

    <el-divider direction="vertical" />

    <online-point :online="online"></online-point>
    <el-switch
      v-model="isDarkMode"
      inline-prompt
      style="--el-switch-off-color: #bbb"
      active-text="夜间"
      inactive-text="白天"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import headerMenuDropdown from "../headerMenuDropdown/index.vue";
import onlinePoint from "../../components/onlinePoint.vue";
import {
  isDarkMode,
  online,
  isEdit,
  currentEditingModelInfo,
  currentController,
} from "../../store";
import iconPrev from "@/icon/design/prev.svg?component";
import iconCamera from "@/icon/camera.svg?component";
</script>

<style>
.designiy-sub-header {
  width: 100%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 20px;
  column-gap: 14px;
}

.designiy-sub-header-button {
  display: flex;
  align-items: center;
  column-gap: 4px;
  font-size: 12px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: #333;
  transition: all 0.3s;
  &:hover {
    background: #eaeaea;
  }
}

.designiy-sub-header-icon {
  width: 14px;
  height: 14px;
}
</style>
