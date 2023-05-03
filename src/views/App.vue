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
    import headerView from './base/header.vue'
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
}

#header {
  height: 60px;
  width: 100%;
  flex-shrink: 0;
}

#content {
  flex: auto;
  overflow: auto;
}
</style>
