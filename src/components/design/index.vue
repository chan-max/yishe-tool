<template>
  <div id="designiy">
    <main-view></main-view>
  </div>
</template>

<script setup>
import { ref } from "vue";
import mainView from "./layout/main.vue";
// 控制是否全屏


</script>

<style lang="less">
#designiy {
  width: 100%;
  height: 100%;
}

.designiy-focus-fullpage {
  position: fixed!important;
  width: 100%!important;
  height: 100%!important;
  top: 0!important;
  left: 0!important;
}

</style>
