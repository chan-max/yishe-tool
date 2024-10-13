<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'">
    <div class="content" style="flex: 1">
      <router-view></router-view>
    </div>
  </van-config-provider>
</template>
<script setup>
import mFooter from "./view/footer/index.vue";
import mHeader from "./view/header/index.vue";
import { ref } from "vue";

import { useDark, useToggle } from "@vueuse/core";

const isDark = ref(false);

//
document.addEventListener("gesturestart", function (event) {
  event.preventDefault();
});
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.van-config-provider {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:root {
  --van-primary-color: #0099ff !important;
}

.van-theme-dark body {
  background-color: black;
}
</style>
