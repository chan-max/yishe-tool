<template>
  <el-popover
    trigger="click"
    placement="bottom-start"
    v-model:visible="showHeaderMenuDropdown"
  >
    <template #reference>
      <div class="designiy-header-menu-dropdown">
        <icon-menu></icon-menu> 
      </div>
    </template>
    <template #default>
      <div class="designiy-header-menu-dropdown-content">
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import iconMenu from '@/icon/menu.svg?vueComponent'

const showHeaderMenuDropdown = ref(false);
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
  cursor: pointer;
  svg{
    height:16px;
    width:16px;
  }
}
</style>
