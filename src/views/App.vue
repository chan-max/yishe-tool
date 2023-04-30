<script setup lang="ts">
</script>
<template>
  <div id="home-header">
    衣设网
  </div>
  <router-view></router-view>
</template>

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
}

#home-header {
  height: 50px;
  width: 100%;
  color: #00c1de;
  font-weight: bold;
  background: #00c1de;
}
</style>
