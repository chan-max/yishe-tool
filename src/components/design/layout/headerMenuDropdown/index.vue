<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-11-29 21:41:57
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-16 12:27:00
 * @FilePath: /1s/src/components/design/layout/headerMenuDropdown/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-header-menu-dropdown">
    <icon-menu  style="width: 16px; height: 16px;color:#999;" @click.stop="toggle"></icon-menu>
    <div v-if="showHeaderMenuDropdown" class="designiy-header-menu-dropdown-content">
      <menu-main></menu-main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import iconMenu from "@/icon/menu.svg?vueComponent";
import menuMain from './main.vue'

const showHeaderMenuDropdown = ref(false);

function toggle() {
  showHeaderMenuDropdown.value = !showHeaderMenuDropdown.value;
}

const clicker = ref(false);

provide("clicker", clicker);

onMounted(() => {
  document.body.addEventListener("click", (e) => {
    showHeaderMenuDropdown.value = false;
  });
});


</script>

<style lang="less">
.designiy-header-menu-dropdown {
  width: 30px;
  height: 30px;
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border-radius: 5px;
  font-size: 16px;
  position: relative;
}

.designiy-header-menu-dropdown-content {
  position: absolute;
  top: 42px;
  left: 0;
  z-index: 1;
}
</style>
