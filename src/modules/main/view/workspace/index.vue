<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 11:08:35
 * @FilePath: /1s/src/modules/main/view/workspace/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="workspace">
    <div class="workspace-banner"></div>
    <div class="tabs">
      <tabs></tabs>
    </div>
    <div class="workspace-content">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>
<script setup>
import tabs from "./tabs.vue";
import { activeComponent } from "./index.ts";
</script>
<style scoped lang="less">
.workspace {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f1f1f1;
}

.workspace-banner {
  width: 100%;
  height: 160px;
  flex-shrink: 0;
  background-image: linear-gradient(to right, #4776e6 0%, #8e54e9 51%, #4776e6 100%);
}

.tabs {
  position: sticky;
  /* 是粘性布局生效 */
  top: 0;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  z-index: 9;
}

.workspace-content {
  max-width: 1600px;
  width: 96%;
}
</style>
