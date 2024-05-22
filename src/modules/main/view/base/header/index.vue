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

      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: 'Home' }"
        custom
      >
        <div
          class="header-bar-menu-item"
          :class="{ 'header-bar-menu-item-active': isActive }"
          @click="navigate"
        >
          首页
        </div>
      </router-link>
      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: 'Market' }"
        custom
      >
        <div
          class="header-bar-menu-item"
          :class="{ 'header-bar-menu-item-active': isActive }"
          @click="navigate"
        >
          在线商场
        </div>
      </router-link>
      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: 'Ai' }"
        custom
      >
        <div
          class="header-bar-menu-item"
          :class="{ 'header-bar-menu-item-active': isActive }"
          @click="navigate"
        >
          AI
        </div>
      </router-link>
      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: 'Workspace' }"
        custom
      >
        <div
          class="header-bar-menu-item"
          :class="{ 'header-bar-menu-item-active': isActive }"
          @click="navigate"
        >
          我的工作台
        </div>
      </router-link>
      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: 'Seller' }"
        custom
      >
        <div
          class="header-bar-menu-item"
          :class="{ 'header-bar-menu-item-active': isActive }"
          @click="navigate"
        >
          我是商家
        </div>
      </router-link>
      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: 'StickerDesign' }"
        custom
      >
        <div
          class="header-bar-menu-item"
          :class="{ 'header-bar-menu-item-active': isActive }"
          @click="navigate"
        >
          贴纸设计
        </div>
      </router-link>
    </div>
    <div style="flex: 1"></div>
    <div class="middle flex justify-center" style="column-gap: 2em"></div>
    <div style="flex: 1"></div>
    <div class="right flex justify-end">
      <template v-if="loginStatusStore.isLogin">
        <user-avatar />
      </template>
      <template v-else>
        <el-button plain @click="$router.push({ name: 'Login' })" round>
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

const loginStatusStore = useLoginStatusStore();
</script>

<style lang="less" scoped>
.header-bar {
  width: 100%;
  height: 64px;
  background: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 0 4%;
  box-sizing: border-box;
  & > * {
    flex-shrink: 0;
  }
}

.header-bar-menu-item {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  text-wrap: nowrap;
  cursor: pointer;
  color: #222;
  font-weight: 400;
  border-bottom: 2px solid transparent;
  padding: 0.5em 1em;
  &:hover {
    color: #555;
  }
}

.middle {
  font-weight: bold;
  align-items: center;
  padding: 1em;
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

.header-bar-menu-item-active {
  background: #f8f7f4;
  border-radius: 99999999px;
}
</style>
