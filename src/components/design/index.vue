<template>
  <div class="designiy" :class="isDarkMode ? 'dark' : 'light'">
    <main-view></main-view>
  </div>
</template>

<script setup>
import mainView from "./layout/main.vue";
import { isDarkMode } from "./store";
</script>
<style lang="less">
@import url(./style/dark.less);
@import url(./style/light.less);
.designiy {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
