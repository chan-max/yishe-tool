<template>
  <div id="notice"></div>
  <div id="header">
    <header-view></header-view>
  </div>
  <div id="content">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import headerView from "./base/header.vue";
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}


#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x:hidden;
}

#header {
  height: 50px;
  width: 100%;
  flex-shrink: 0;
  border: 1px solid #eee;
}

#content {
  flex: auto;
  background: #f2f2f2;
  overflow-y: auto;
}




/* 滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
}
::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
::-webkit-scrollbar-corner {
}
</style>
