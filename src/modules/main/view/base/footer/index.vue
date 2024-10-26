<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-23 07:31:43
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 17:50:54
 * @FilePath: /yishe/src/modules/main/view/base/footer/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="footer">
    <div class="gradient-border"></div>
    <div class="columns">
      <div class="column">
        <div class="column-title">联系我们</div>
        <div>tel : 18742539196</div>
        <div>wechat: 18742539196</div>
      </div>
      <div class="column">
        <div style="flex: 1"></div>
        <img style="width: 36px; height: 36px" src="/clover.svg" />
      </div>
    </div>

    <hr />
    <div class="beian">
      ICP备案号：<a class="icp" :href="configStore.json.icp.link" target="_blank">
        {{ configStore.json.icp.text }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/stores/config";

let configStore = useConfigStore();
</script>

<style scoped>
.footer {
  overflow: auto;
  width: 100%;
  background-color: #1e1e1e;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 50px 100px 20px 100px;
  position: relative;
}

.columns {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  color: #777;
  font-size: 12px;
}

.column-title {
  font-size: 14px;
  font-weight: bold;
  color: #ddd;
  line-height: 36px;
}

.gradient-border {
  height: 4px;
  width: 100%;
  position: absolute;
  top: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%);
}

hr {
  width: 100%;
  border: 1px solid #111;
  margin: 30px 0;
  box-sizing: border-box;
}

.beian {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 12px;
}

.icp {
  color: #aaa;
  font-size: 12px;
  &:hover {
    color: #ddd;
  }
}
</style>
