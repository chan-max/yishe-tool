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
      <img src="/favicon.png" style="height: 36px" object-fit="contain" />
    </div>

    <div style="flex-grow: 1"></div>

    <div class="flex items-center">
      <el-button  @click="showUpload = true" round text bg :icon="Upload">
        素材上传
      </el-button>
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

const props = defineProps([]);

function login() {
  openLoginDialog();
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
