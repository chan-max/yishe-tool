<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-27 19:20:45
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-30 10:39:20
 * @FilePath: /1s/src/components/design/layout/headerMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-header">
    <div class="designiy-header-logo">
      <span style="font-size: 16px;font-weight: bold;font-style: italic;">衣设1s</span>
    </div>
    <header-menu-dropdown />

    <div style="flex-grow: 1"></div>

    <icon-help style="width: 24px; height: 24px;color:#333;"></icon-help>


    <el-button @click="showSaveModel = true" type="primary" color="#333" round> 上 传 </el-button>

    <user-avatar  v-if="loginStatusStore.isLogin"/>
    <el-button @click="$router.push({name:'Login'})" v-else type="primary" round>  登 录 </el-button>
  </div>
</template>

<script setup>
import { getBaseModel, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { canvasBgColor, canvasBgOpacity, isDarkMode, currentController, showSaveModel } from "../store";


import {Share} from '@element-plus/icons-vue'
import userAvatar from '@/components/user/userAvatar.vue'
import headerMenuDropdown from './headerMenuDropdown/index.vue'
import { onShortcutTrigger } from '../shortcut/index';
import iconHelp from '@/icon/help.svg?component'
import { useLoginStatusStore } from "@/store/stores/login";

const loginStatusStore = useLoginStatusStore();

const props = defineProps([]);


</script>

<style lang="less">
.designiy-header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  column-gap: 8px;
  padding-right: 10px;
  .el-button + .el-button{
    margin:0;
  }
}

.designiy-header-select-model {
  margin: 0 10px;
}

.designiy-header-select-model-btn {
  min-width: 60px;
}

.designiy-header-change-bgcolor {
  color: #555;
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 0 10px;
}

.designiy-header-logo {
  width: 80px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.designiy-header-item {
  color: #eee;
  font-size: 12px;
  margin: 0 7px;
  cursor: pointer;
}

.designiy-header-quit {
  color: var(--1s-icon-color);
  padding: 0 5px;
  font-size: 18px;
}
</style>