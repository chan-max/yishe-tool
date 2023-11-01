<template>
  <div class="admin-container">
    <el-container style="height: 100%">
      <el-aside style="display: flex; flex-direction: column" width="auto">
        <el-menu
          class="admin-menu"
          :collapse="isCollapse"
          style="display: flex"
          background-color="#fbfaff"
          text-color="#696969"
          :router="true"
          active-text-color="#06f"
        >
          <div
            style="
              width: 100%;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <el-avatar shape="square" size="default" :src="avatar" />
          </div>

          <el-menu-item index="Admin">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>


          <el-menu-item index="System">
            <el-icon><Monitor /></el-icon>
            <span>系统管理</span>
          </el-menu-item>

          <el-sub-menu index="1">
            <template #title>
              <el-icon><Goods /></el-icon>
              <span>模型管理</span>
            </template>
            <el-menu-item-group >
              <el-menu-item index="/admin/model">所有模型</el-menu-item>
              <el-menu-item index="/admin/model/upload">上传模型</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon><Picture /></el-icon>
              <span>图片管理</span>
            </template>
            <el-menu-item-group >
              <el-menu-item index="/admin/image">所有图片</el-menu-item>
              <el-menu-item index="/admin/image/upload">上传图片</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          
          <el-sub-menu index="3">
            <template #title>
              <el-icon><EditPen /></el-icon>
              <span>字体管理</span>
            </template>
            <el-menu-item-group >
              <el-menu-item index="/admin/font">所有字体</el-menu-item>
              <el-menu-item index="/admin/font/upload">上传字体</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><User/></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item-group >
              <el-menu-item index="/admin/user">所有用户</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group >
              <el-menu-item index="/admin/adduser">添加用户</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="5">
            <template #title>
              <el-icon><Coin /></el-icon>
              <span>数据库管理</span>
            </template>
            <el-menu-item-group >
              <el-menu-item index="/admin/table">数据表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <div style="flex-grow: 1"></div>

          <el-menu-item @click="isCollapse = !isCollapse">
            <el-icon><Expand /></el-icon>
            <span>收起/展开</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="border-bottom: 1px solid #e9e9ef"></el-header>
        <el-main class="admin-main">
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
  Monitor,
  House,
  Picture,
  Goods ,
  EditPen,
  Coin
} from "@element-plus/icons-vue";

import { HomeOutlined } from "@ant-design/icons-vue";

import { ref, computed } from "vue";
import { useLoginStatusStore } from "@/store/stores/user";

// 菜单书否处于折叠状态
const isCollapse = ref(false);

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
  background-color: #fff;
}

.admin-main{
}

.el-popper.is-light {
  border: none !important;
}

.admin-menu {
  --el-menu-item-height:50px;
  --el-menu-sub-item-height: 40px;
  --el-menu-level-padding: 30px;
  box-shadow: 0 2px 22px 0 rgba(0, 0, 0, 0.01);
  border-right: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.admin-menu:not(.el-menu--collapse) {
  width: 250px;
}

.admin-menu{
  .el-menu-item {
  font-size: 12px !important;

}

.el-sub-menu__title {
  font-size: 12px !important;

}

.anticon,.el-icon {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 14px!important;
}

.el-menu-item-group__title{
  display: none;
}
}

</style>
