<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'">
    <m-header v-if="$route.meta.header"></m-header>
    <div class="content">
      <router-view></router-view>
    </div>
    <m-footer v-if="$route.meta.footer"></m-footer>
  </van-config-provider>
</template>
<script setup>
import mFooter from "./view/footer/index.vue";
import mHeader from './view/header/index.vue'
import {ref} from 'vue'

import { useDark, useToggle } from '@vueuse/core'

const isDark = ref(false)



//
document.addEventListener('gesturestart', function (event) {
    event.preventDefault()
})

</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}

.van-config-provider{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:root{
  --van-primary-color:#6900ff!important;
}

.van-theme-dark body {
  background-color: black;
}
</style>
