<template>
  <div class="admin-container">
    <el-container style="height: 100%">
      <el-header> </el-header>
      <el-container>
        <el-aside
          style="display: flex; flex-direction: column; padding:0 20px;"
          width="auto"
        >
          <el-menu class="admin-menu"
           :collapse="isCollapse" 
           :router="true" 
            background-color="#3285ff"
            text-color="#fff"
            active-text-color="#fff"
            style="display:flex;"
          >

          <div style="width:100%;height:80px;display:flex;align-items: center;justify-content:center;">
            <el-avatar shape="square" size="small" :src="avatar" />
          </div>

          <el-menu-item index="/admin">
            <el-icon><HomeFilled /></el-icon>
              <template #title>首页</template>
            </el-menu-item>
            <el-sub-menu index="1">
              <template #title>
                <el-icon><User /></el-icon>
                <span style="width:120px;">用户管理</span>
              </template>
              <el-menu-item-group >
                <el-menu-item index="1-1">所有用户</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2" >
              <template #title>
                <el-icon><Grid /></el-icon>
                <span> 模型管理 </span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1" :route="{ name: 'Model' }"
                  >基础服装模型</el-menu-item
                >
                <el-menu-item index="2-2" :route="{ name: 'ModelUpload' }">
                  模型上传
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <div style="flex-grow: 1"></div>
            <el-menu-item @click="isCollapse = !isCollapse">
              <el-icon><Expand /></el-icon>
              <template #title>展开/收起</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main
          style="background-color: #fff; box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.01)"
        >
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import {
  Menu as IconMenu,
  HomeFilled,
  User,
  Expand,
  Grid,
} from "@element-plus/icons-vue";
import { ref, computed } from 'vue';
import { useLoginStatusStore } from '../store/stores/user';

// 菜单书否处于折叠状态
const isCollapse = ref(true);


const loginStatusStore = useLoginStatusStore();

const avatar = computed(() => {
  const loginStatusStore = useLoginStatusStore();
  return loginStatusStore?.userInfo?.avatar || "/default-user-avatar.png";
});



</script>
<style>
.admin-container {
  width: 100%;
  height: 100%;
  /* background-color: #00071d; */
  background-color: #f5f6fa;
  border-top: 3px solid var(--1s-blue);
}

.el-popper.is-light {
  border: none !important;
}

.admin-menu {
  box-shadow: 0 2px 22px 0 rgba(0, 0, 0, 0.01);
  border-right: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}


</style>
