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


    <el-popover width="240" trigger="click" popper-style="padding:2rem">
      <template #reference>
        <el-button size="small" link v-if="loginStatusStore.isLogin">
          {{ storageName || '未命名' }}
          <el-icon size="1rem" style="margin-left: .4rem;">
            <el-tooltip content="正在同步到远程" placement="right" v-if="syncState.loading">
              <LoadingOutlined style="color:var(--el-color-primary)" />
            </el-tooltip>
            <el-tooltip content="同步成功" placement="right" v-if="!syncState.loading && syncState.success">
              <CheckCircleOutlined style="color:var(--el-color-success)" />
            </el-tooltip>
            <el-tooltip content="同步失败" placement="right" v-if="!syncState.loading && syncState.failed">
              <ExclamationCircleOutlined style="color:var(--el-color-danger)" />
            </el-tooltip>
          </el-icon>
        </el-button>
      </template>
      <el-row style="row-gap: 1rem;" align="middle">
        <el-col :span="8">
          场景名称：
        </el-col>
        <el-col :span="16">
          <el-input v-model="storageName" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          最近更新：
        </el-col>
        <el-col :span="16">
          <div style="text-align: right;height:24px;line-height: 24px;">{{ displayDate }}</div>
        </el-col>
        <el-col :span="24">
          <el-button size="small" class="w-full" plain>
            另存到工作台
          </el-button>
        </el-col>
      </el-row>
    </el-popover>

    <div style="flex-grow: 1"></div>
    <div class="flex ">
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
  storageName,
  syncState
} from "../store";

import { Share } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import headerMenuDropdown from "./headerMenuDropdown/index.vue";
import { onShortcutTrigger } from "../shortcut/index";
import iconHelp from "@/icon/help.svg?component";
import { useLoginStatusStore } from "@/store/stores/login";
import { useDateFormat, useNow } from '@vueuse/core'
import { LoadingOutlined, CheckOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'


const loginStatusStore = useLoginStatusStore();

const displayDate = useDateFormat(lastModifiedTime, 'YYYY-MM-DD hh:mm:ss')

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
