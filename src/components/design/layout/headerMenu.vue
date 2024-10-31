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
    <div
      class="designiy-header-logo flex items-center justify-center"
      style="width: 72px; height: 100%"
    >
      <img src="favicon.png" style="height: 36px" object-fit="contain" />
    </div>

    <el-popover width="240" trigger="click" popper-style="padding:2rem">
      <template #reference>
        <el-button link v-if="loginStatusStore.isLogin" class="link">
          <span style="font-size: 1.1rem"> {{ storageName || "未命名" }}</span>
          <el-icon size="1rem" style="margin-left: 0.4rem">
            <el-tooltip
              content="正在同步到远程"
              placement="right"
              v-if="syncState.loading"
            >
              <LoadingOutlined style="color: var(--el-color-primary)" />
            </el-tooltip>
            <el-tooltip
              content="同步成功"
              placement="right"
              v-if="!syncState.loading && syncState.success"
            >
              <CheckCircleOutlined style="color: var(--el-color-success)" />
            </el-tooltip>
            <el-tooltip
              content="同步失败"
              placement="right"
              v-if="!syncState.loading && syncState.failed"
            >
              <ExclamationCircleOutlined style="color: var(--el-color-danger)" />
            </el-tooltip>
          </el-icon>
        </el-button>
      </template>
      <el-row style="row-gap: 1rem" align="middle">
        <el-col :span="8"> 场景名称： </el-col>
        <el-col :span="16">
          <el-input v-model="storageName" size="small"></el-input>
        </el-col>
        <el-col :span="8"> 最近更新： </el-col>
        <el-col :span="16">
          <div style="text-align: right; height: 24px; line-height: 24px">
            {{ displayDate }}
          </div>
        </el-col>
        <el-col :span="24">
          <el-button size="small" class="w-full" type="primary" plain>
            另存到工作台
          </el-button>
        </el-col>
      </el-row>
    </el-popover>

    <div style="flex-grow: 1"></div>

    <a-button size="small" type="text"> 快速指南 </a-button>

    <a-dropdown>
      <a-button size="small" type="text">
        <div :style="{ background: currentCanvasBackground.backgroundCss }">画布背景</div>
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="item in builtInCanvasBackgrounds"
            @click="useCurrentBackground(item)"
          >
            <div :style="{ background: item.backgroundCss }">{{ item.name }}</div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <div class="flex items-center">
      <a-dropdown>
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
      </a-dropdown>

      <el-button @click="showUpload = true" round text bg :icon="Upload">
        素材上传
      </el-button>
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
  isDarkMode,
  currentModelController,
  showSaveModel,
  showUpload,
  lastModifiedTime,
  storageName,
  syncState,
  builtInCanvasBackgrounds,
  currentCanvasBackground,
} from "../store";

import { openFileModal } from "@/components/design/layout/upload/index.tsx";
import { Share } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import headerMenuDropdown from "./headerMenuDropdown/index.vue";
import { onShortcutTrigger } from "../shortcut/index";
import iconHelp from "@/icon/help.svg?component";
import { useLoginStatusStore } from "@/store/stores/login";
import { useDateFormat, useNow } from "@vueuse/core";
import { Upload } from "@element-plus/icons-vue";
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

function useCurrentBackground(item) {
  currentCanvasBackground.value = item;
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
