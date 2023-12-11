<template>
  <div class="mobile-header">
    <van-nav-bar :border="false">
      <template #left>
        <icon-menu @click="showMenu = true" class="mobile-header-icon"></icon-menu>
      </template>
      <template #title> 衣设 </template>
      <template #right>
        <icon-scan
          class="mobile-header-icon"
          @click="$router.push({ name: 'Scan' })"
        ></icon-scan>
      </template>
    </van-nav-bar>
  </div>
  <van-popup
  v-model:show="showMenu"
  :style="{ width: '76%', height: '100%' }"
  position="left">
  <popup-menu></popup-menu>
  </van-popup>
</template>
<script setup>
import iconScan from "@/icon/mobile/header/scan.svg?vueComponent";
import iconMenu from "@/icon/mobile/header/menu.svg?vueComponent";
import popupMenu from './popupMenu.vue'
import {ref} from 'vue'

const showMenu = ref()



</script>

<style lang="less">
:root:root {
  --van-nav-bar-height: 60px;
}



.mobile-header-icon {
  width: 20px;
  height: 20px;
  color: var(--van-text-color);
}
</style>
