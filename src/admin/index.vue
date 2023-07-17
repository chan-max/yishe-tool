<template>
  <div class="admin-container">
    <el-container style="height: 100%">
      <el-header>
        <el-menu mode="horizontal">
          <el-menu-item index="0">1s admin</el-menu-item>
          <div style="flex-grow:1"></div>
          <el-menu-item index="0">LOGO</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu style="height: 100%">
            <el-menu-item index="1">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>模型管理</span>
            </el-menu-item>
            <el-menu-item index="3" >
              <el-icon><document /></el-icon>
              <span></span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import {
  User
} from '@element-plus/icons-vue'

</script>
<style>
.admin-container {
  width: 100%;
  height: 100%;
}
</style>
