<template>
  <el-menu
    class="admin-menu"
    background-color="#fff"
    text-color="#555"
    active-text-color="#222"
    :unique-opened="true"
    :router="true"
  >
    <div class="flex items-center w-full" style="padding: 24px; box-sizing: border-box">
      <div class="flex items-center" style="column-gap: 8px">
        <img style="width: 18px; height: 18px" src="/logo.svg" />
        <span style="color: #333; font-weight: bold; font-size: 16px">{{ title }}</span>
      </div>
    </div>
    <!-- 递归动态菜单 -->
    <sidebarItem :data="menuItems"></sidebarItem>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import sidebarItem from "./sidebarItem.vue";
import { adminRoute } from "@/modules/main/router";
import { useLoginStatusStore } from "@/store/stores/login";

const menuItems = adminRoute.children;

const isCollapse = ref(true);

const loginStore = useLoginStatusStore();

const title = computed(() => {
  return loginStore?.userInfo?.company?.name || "衣设管理系统";
});
</script>

<style lang="less">
.admin-menu {
  height: 100%;
  user-select: none;
  padding: 12px;
  .el-sub-menu__title,
  .el-menu-item {
    font-size: 12px;
  }

  border-right: 1px solid #e8edf2;
}
</style>
