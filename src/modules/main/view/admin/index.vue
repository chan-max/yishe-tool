<template>
  <el-container class="w-full h-full">
    <el-aside width="240px" class="admin-aside">
      <sidebar></sidebar>
    </el-aside>
    <el-container>
      <el-header class="flex items-center">
        <div style="flex: 1"></div>
        <userAvatar></userAvatar>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import sidebar from "./components/sidebar.vue";
import userAvatar from "@/components/user/userAvatar.vue";
</script>

<style lang="less">
.admin-aside {
  overflow-x: hidden;
}
</style>
