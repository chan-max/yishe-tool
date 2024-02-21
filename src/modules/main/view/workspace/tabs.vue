<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-20 08:07:02
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 15:50:00
 * @FilePath: /yishe/src/modules/main/view/workspace/tabs.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="tabs">
    <div
      v-for="item in WorkspaceTabOptions"
      :class="{ 'tabs-item-active': activeWorkspaceTab == item.key }"
      class="tabs-item"
      @click="activeWorkspaceTab = item.key"
    >
      {{ item.label }}
    </div>
    <div style="flex: 1"></div>
  </div>
</template>
<script setup>
import { WorkspaceTabOptions, activeWorkspaceTab } from "./index.ts";
</script>

<style scoped>
.tabs {
  padding:0 20px;
  max-width: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
  background-color: #fff;
  z-index: 1;
}

.tabs-item {
  color: #777;
  font-weight: 400;
  padding: 8px 16px;
  transition: all 0.2s;
  border-radius: 12px;
  text-wrap: nowrap;
  font-size: 14px;
}
.tabs-item:hover {
  background-color: #aaa;
  cursor: pointer;
  color: #fff;
}

.tabs-item:active {
  transform: scale(.9);
}

.tabs-item-active {
  background-color: #aaa;
  cursor: pointer;
  color:#fff;
}
</style>
