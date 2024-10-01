<template>
  <el-menu
    class="admin-menu"
    background-color="#0a003a"
    text-color="#B0B0B2"
    active-text-color="#fff"
    :unique-opened="true"
    :is-collapse="isCollapse"
  >
    <div  class="flex items-center w-full justify-center" style="padding:24px;column-gap: 8px;box-sizing: border-box;"> <img style="width:24px;height:24px;" src="/logo.svg"> 
        <span style="color:#fff;font-weight: bold;font-size: 12px;">衣设综合管理系统</span>
     </div>
    <!-- 递归动态菜单 -->
    <sidebarItem :data="menuItems"></sidebarItem>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import sidebarItem from './sidebarItem.vue'
import { adminRoute } from "@/modules/main/router";

const menuItems = adminRoute.children;

const isCollapse = ref(true);
</script>

<style lang="less">
.admin-menu {
  height: 100%;

  .el-sub-menu__title,.el-menu-item{
    font-size: 12px;
  }
}
</style>
