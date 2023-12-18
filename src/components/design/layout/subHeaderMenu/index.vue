<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-14 19:04:03
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-16 12:23:04
 * @FilePath: /1s/src/components/design/layout/subHeaderMenu/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-sub-header">
    <header-menu-dropdown />
    <div style="font-size:12px;color:#555;">  {{  isEdit ? '编辑' : '新建'}}  </div>
    <div style="flex: 1"></div>

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

<script setup lang="ts">
import { ref } from "vue";
import headerMenuDropdown from "../headerMenuDropdown/index.vue";
import onlinePoint from "../../components/onlinePoint.vue";
import { isDarkMode, online, isEdit, currentEditingModelInfo } from '../../store';


</script>

<style>
.designiy-sub-header {
  width: 100%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  border-bottom: var(--1s-sub-header-border-bottom);
  align-items: center;
  padding: 0 10px;
  column-gap: 12px;
}
</style>
