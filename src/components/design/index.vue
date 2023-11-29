<template>
  <div class="designiy" :class="isDarkMode ? 'dark' : 'light'">
    <main-view></main-view>
  </div>
</template>
<script setup>
import mainView from "./layout/main.vue";
import { isDarkMode } from "./store";
import { usePreventScreenResize } from './composition/preventScreenResize';

// usePreventScreenResize()

</script>
<style lang="less">
@import url(./theme.less);
@import url(./style.less);
.designiy {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  *{
    -webkit-user-drag: none;
  }
}
</style>
