<template>
  <div class="designiy-sub-header">
    <header-menu-dropdown/>

    <div style="flex:1;"></div>


  </div>
</template>

<script setup lang="ts">
import headerMenuDropdown from '../headerMenuDropdown/index.vue'
import {isDarkMode} from '../../store'

</script>

<style>
.designiy-sub-header {
  width: 100%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  display:flex;
  border-bottom: var(--1s-sub-header-border-bottom);
  align-items: center;
  padding :0 10px;
}
</style>
