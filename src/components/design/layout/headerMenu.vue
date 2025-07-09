<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-27 19:20:45
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-08 23:32:50
 * @FilePath: /1s/src/components/design/layout/headerMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-header">
    <div
      class="designiy-header-logo flex items-center justify-center shrink-0"
      style="width: 64px; height: 100%"
    >
      <img src="/favicon.png" style="height: 32px" object-fit="contain" />
    </div>

    <template v-if="isEdit">
        <el-tag type="primary" class="mr-2">当前模型ID : {{ currentEditingModelId }}</el-tag>
        <el-button type="danger" size="small" @click="exitEditMode">退出</el-button>
      </template>

    <div style="flex-grow: 1"></div>

    <a-button size="small" type="text"> 快速指南 </a-button>

    <!-- 连接状态显示 -->
    <connection-status />

    <div class="flex items-center">

      <!-- <a-dropdown>
        <el-button link class="icon-btn" @click="openFileDialog">
          <s1-icon name="file-upload-up-arrow" :size="16"></s1-icon>
        </el-button>
        <template #overlay>
          <a-menu>
            <a-sub-menu
              v-for="item in localFileListResource"
              :title="item.name"
              :popupOffset="[0, 0]"
            >
              <a-menu-item> 详细信息 </a-menu-item>
              <a-menu-item @click="openUplaodModal(item)"> 在上传窗口打开 </a-menu-item>
              <a-menu-item @click="remove(item)" style="color: var(--el-color-danger)">
                移除
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-if="!localFileListResource.length" @click="openFileDialog">
              选取本地文件
            </a-menu-item>
            <a-menu-item v-if="localFileListResource.length"> 全部上传 </a-menu-item>
            <a-menu-item
              v-if="localFileListResource.length"
              style="color: var(--el-color-danger)"
            >
              清空所有
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown> -->

      <el-button @click="showUpload = true" round text bg :icon="Upload">
        素材上传
      </el-button>

      <el-button @click="toggleAutomation" round text bg >
        {{ isAutomationRunning ? '关闭自动化' : '开启自动化' }}
      </el-button>

      <el-switch
        v-model="isDarkMode"
        class="mx-8"
        inline-prompt
        style="--el-switch-off-color: #bbb"
        active-text="夜间"
        inactive-text="白天"
      />

      <el-button type="primary" @click="showSaveModel = true" round> 保存 </el-button>
    </div>
    <user-avatar v-if="loginStatusStore.isLogin" />
    <el-button @click="login" v-else round type="primary"> 登 录 </el-button>
  </div>
</template>

<script setup>
import { getBaseModel, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import {
  canvasBgColor,
  canvasBgOpacity,
  currentModelController,
  showSaveModel,
  showUpload,
  lastModifiedTime,
  storageName,
  syncState,
  builtInCanvasBackgrounds,
  currentCanvasBackground,
  isDarkMode,
  isEdit,
  currentEditingModelId,
  exitEditMode,
} from "../store";

import { openFileModal } from "@/components/design/layout/upload/index.tsx";
import { Share } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import headerMenuDropdown from "./headerMenuDropdown/index.vue";
import { onShortcutTrigger } from "../shortcut/index";
import iconHelp from "@/icon/help.svg?component";
import { useLoginStatusStore } from "@/store/stores/login";
import { useDateFormat, useNow } from "@vueuse/core";
import {
  LoadingOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { useFileDialog } from "@vueuse/core";
import { openLoginDialog } from "@/modules/main/view/user/login/index.tsx";
import Utils from "@/common/utils";
import { localFileListResource } from "@/components/design/store";
import { isAutomationRunning, automationDescription } from "@/store/stores/app";
import { startAutomation, stopAutomation } from "@/common/utils/automation";
import connectionStatus from "@/components/connectionStatus.vue";

const router = useRouter();

const loginStatusStore = useLoginStatusStore();

const displayDate = useDateFormat(lastModifiedTime, "YYYY-MM-DD hh:mm:ss");

const props = defineProps([]);

function login() {
  openLoginDialog();
}

const { open: openFileDialog, reset, onCancel, onChange } = useFileDialog({
  accept: Utils.const.ImageFontFileAcceptString,
  multiple: true,
});

// 本地上传的文件

onChange((fileList) => {
  localFileListResource.value.push(...fileList);
});

function openUplaodModal(file) {
  openFileModal(file);
}

//
function remove(file) {}

function toggleAutomation() {
  if (isAutomationRunning.value) {
    stopAutomation();
  } else {
    startAutomation('手动开启的自动化操作');
  }
}

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
  // background: #121212;
}

.icon-btn {
  --el-button-text-color: #bbb;
}

.designiy-header-menu {
  width: 64px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
