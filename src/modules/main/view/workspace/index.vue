<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-31 21:34:31
 * @FilePath: /1s/src/modules/main/view/workspace/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="workspace-banner"></div>
  <div class="tabs">
    <tabs></tabs>
  </div>
  <div class="workspace-content">
    <component :is="activeComponent"></component>
  </div>
</template>
<script setup>
import tabs from "./tabs.vue";
import { activeComponent } from "./index.ts";
</script>
<style scoped lang="less">
.workspace {
  width: 1600px;
}

.workspace-banner {
  width: 100%;
  height: 160px;
  background-image: linear-gradient(to right, #4776e6 0%, #8e54e9 51%, #4776e6 100%);
}

.tabs {
  position: sticky;
  /* 是粘性布局生效 */
  top: 0;
  max-width: 1600px;
  width: 90%;
  height: 100px;
  background-color: #fff;
}

.workspace-content {
  max-width: 1600px;
  width: 90%;
}
</style>
