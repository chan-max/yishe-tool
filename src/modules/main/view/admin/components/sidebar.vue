<template>
  <el-menu
    class="admin-menu"
    background-color="#222"
    text-color="rgba(255,255,255,0.7)"
    active-text-color="#fff"
    :unique-opened="true"
  >
    <div
      class="flex items-center w-full justify-center"
      style="padding: 24px 0; box-sizing: border-box"
    >
      <div class="flex items-center" style="column-gap: 8px">
        <img style="width: 18px; height: 18px" src="/logo.svg" />
        <span style="color: #fff; font-weight: bold; font-size: 16px">{{ title }}</span>
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

  .el-sub-menu__title,
  .el-menu-item {
    font-size: 12px;
  }
}
</style>
