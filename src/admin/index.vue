<template>
  <div class="admin-container">
    <el-container style="height: 100%">
      <el-header> </el-header>
      <el-container>
        <el-aside style="display: flex;flex-direction: column; padding:0 20px 0px 20px" width="auto">
          <el-menu
            class="admin-menu"
            :collapse="isCollapse"
            :router="true"
            active-text-color="#fff"
            background-color="#222a42"
            text-color="#fff"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <template #title><span>用户管理</span></template>
                <el-menu-item index="">item one</el-menu-item>
                <el-menu-item index="">item two</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="">
                <template #title><span>item four</span></template>
                <el-menu-item index="">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Grid /></el-icon>
                <span>模型管理</span>
              </template>
              <el-menu-item-group>
                <template #title><span>模型管理</span></template>
                <el-menu-item index="2-1" :route="{name:'Model'}">基础服装模型</el-menu-item>
                <el-menu-item index="2-2" :route="{name:'ModelUpload'}" >模型上传</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="2-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="2-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <div style="flex-grow:1"></div>
            <el-menu-item @click="isCollapse = !isCollapse">
              <el-icon><Expand /></el-icon>
              <template #title>展开/收起</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="background-color:#fff;box-shadow:0 1px 20px 0 rgba(0,0,0,.05);">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { Document, Menu as IconMenu, Location, Setting,User,Expand ,Grid} from "@element-plus/icons-vue";
import { ref } from "vue";

const isCollapse = ref(true);

</script>
<style>
.admin-container {
  width: 100%;
  height: 100%;
  /* background-color: #00071d; */
  background-color: #f5f6fa;
}

.el-popper.is-light{
  border: none!important;
}

.admin-menu{
  box-shadow: 0 2px 22px 0 rgba(0,0,0,.1), 0 4px 20px 0 rgba(0,0,0,.15);
  border-right:transparent;
  display:flex;
  flex-direction:column;
  height:100%;
  overflow:hidden
}


</style>
