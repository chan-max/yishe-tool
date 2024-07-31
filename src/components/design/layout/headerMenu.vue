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
    <!-- <div class="designiy-header-menu">
      <header-menu-dropdown />
    </div> -->
    <div class="designiy-header-logo" style="margin:0 12px;">
      <img src="logo.png" style="height: 24px" object-fit="contain" />
    </div>

    <div> {{ storageName || '未命名' }} </div>

    <div style="flex-grow: 1"></div>
    <div>
      <el-button @click="showSaveModel = true" round> 保存该模型 </el-button>
      <el-button @click="showUpload = true" round> 资源上传 </el-button>
    </div>

    <user-avatar v-if="loginStatusStore.isLogin" />
    <el-button @click="$router.push({ name: 'Login', query: { redirectTo: 'Design' } })" v-else round type="primary">
      登 录
    </el-button>
  </div>
</template>

<script setup>
import { getBaseModel, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import {
  canvasBgColor,
  canvasBgOpacity,
  isDarkMode,
  currentController,
  showSaveModel,
  showUpload,
  lastModifiedTime,
  storageName
} from "../store";

import { Share } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import headerMenuDropdown from "./headerMenuDropdown/index.vue";
import { onShortcutTrigger } from "../shortcut/index";
import iconHelp from "@/icon/help.svg?component";
import { useLoginStatusStore } from "@/store/stores/login";


const radio1 = ref('1')
const loginStatusStore = useLoginStatusStore();

const props = defineProps([]);
</script>

<style lang="less" scoped>
.designiy-header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  column-gap: 1rem;
  padding-right: 1rem;
}




.designiy-header-menu {
  width: 64px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
