<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 18:34:27
 * @FilePath: /yishe/src/modules/main/view/base/header/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <!-- <top></top> -->
  <div ref="headerBar" class="header-bar flex justify-center z-10">
    <div class="left flex items-center">
      <img
        class="logo"
        src="logo.png"
        style="width: 100px; object-fit: contain; margin-right: 2em"
        @click="$router.push({ name: 'Design' })"
      />
    </div>
    <des-menu></des-menu>
    <div style="flex: 1"></div>
    <div class="right flex justify-end">
      <template v-if="loginStatusStore.isLogin">
        <user-avatar />
      </template>
      <template v-else>
        <el-button plain @click="$router.push({ name: 'Login' })" round size="small">
          登 录
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import top from "./top.vue";
import { Search } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useLoginStatusStore } from "@/store/stores/login";
import desMenu from "./menu.vue";

const loginStatusStore = useLoginStatusStore();

const menuOptions = [{}];
</script>

<style lang="less" scoped>
.header-bar {
  width: 100%;
  height: var(--1s-header-menu-height);
  background: #fff;
  // box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 0 4%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * {
    flex-shrink: 0;
  }
}

.logo {
  cursor: pointer;
  transition: all 0.1s;
  &:hover {
    transform: scale(1.1);
  }
}

.left,
.right {
  display: flex;
  align-items: center;
  overflow: hidden;
  //   padding-top: 12px;
}

.fixed {
  position: fixed;
}

// .header-bar-menu-item-active {
//   background: #f8f7f4;
//   border-radius: 99999999px;
// }
</style>
