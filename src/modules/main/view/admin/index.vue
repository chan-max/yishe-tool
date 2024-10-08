<template>
  <el-container class="w-full h-full">
    <el-aside width="240px" class="admin-aside">
      <sidebar></sidebar>
    </el-aside>
    <el-container>
      <el-header class="flex items-center admin-header">
        <breadcrumb></breadcrumb>
        <div style="flex: 1"></div>
        <userAvatar></userAvatar>
      </el-header>
      <el-main style="background: #f7f8fa">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import sidebar from "./components/sidebar.vue";
import userAvatar from "@/components/user/userAvatar.vue";
import breadcrumb from "./components/breadcrumb.vue";
</script>

<style lang="less">
.admin-aside {
  overflow-x: hidden;
}

.admin-header {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}
</style>
