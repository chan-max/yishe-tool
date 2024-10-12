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
        src="logo.svg"
        style="width: 32px; height: 32px; object-fit: contain"
        @click="$router.push({ name: 'Design' })"
      />
    </div>

    <!-- <div style="padding:0 24px;font-size: 20px;font-weight: bold;"> 衣设网 </div> -->
    <img style="height: 24px; margin: 0 24px 0 12px" src="/yishe.png" />
    <!-- <img style="height: 24px; margin: 0 24px 0 12px" src="/yishe2.png" /> -->

    <des-menu></des-menu>
    <div style="flex: 1"></div>
    <div class="right flex justify-end">
      <el-dropdown placement="bottom" size="small" trigger="click">
        <el-button size="small" link>
          <span style="font-weight: bold; font-size: 1rem"> {{ language }} </span>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="lang in LanguageOptions"
              @click="changeLanguage(lang.value)"
              >{{ lang.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <template v-if="loginStatusStore.isLogin">
        <user-avatar />
      </template>
      <template v-else>
        <el-button link @click="openLoginDialog" round size="small">
          <el-icon>
            <UserFilled />
          </el-icon>
          登录
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import top from "./top.vue";
import { Search, UserFilled } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useLoginStatusStore } from "@/store/stores/login";
import desMenu from "./menu.vue";
import {
  openLoginDialog,
  showLoginFormModal,
} from "@/modules/main/view/user/login/index.tsx";
import { LanguageOptions, changeLanguage, language } from "@/i18n";

const loginStatusStore = useLoginStatusStore();

const menuOptions = [{}];
</script>

<style lang="less" scoped>
.header-bar {
  width: 100%;
  height: var(--1s-header-menu-height);
  background: #fff;
  // box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 0 6vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  transition: all 0.3s;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #fff;
  }

  z-index: 999;

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
  column-gap: 1rem;
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
