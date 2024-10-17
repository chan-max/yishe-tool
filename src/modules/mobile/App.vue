<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'">
    <div
      style="flex: 1; overflow: auto"
      class="flex flex-col items-center mobile-content"
    >
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

.mobile-content {
  background-color: #fff; // 防止在某些游览器内被黑色背景影响
  * {
    flex-shrink: 0;
  }
}
</style>
