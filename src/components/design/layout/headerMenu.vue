<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-27 19:20:45
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-12-14 08:07:29
 * @FilePath: /1s/src/components/design/layout/headerMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-header">
    <div
      class="designiy-header__brand flex items-center justify-center shrink-0"
    >
      <img src="/favicon.png" class="designiy-header__brand-logo" />
    </div>

    <template v-if="isEdit">
      <div class="edit-mode-info flex items-center gap-2 shrink-0">
        <span class="model-id-text">模型ID: {{ currentEditingModelId }}</span>
        <el-button type="danger" size="small" @click="confirmExitEditMode">退出</el-button>
      </div>
    </template>

    <div class="designiy-header__spacer"></div>

    <a-button size="small" type="text" class="header-link">快速指南</a-button>

    <el-tooltip
      :content="wsStatusTooltip"
      placement="bottom"
      :show-after="200"
    >
      <div class="ws-status-indicator" :class="`ws-status--${wsStatus}`">
        <span class="ws-status-dot" />
        <span class="ws-status-label">{{ wsStatusLabel }}</span>
      </div>
    </el-tooltip>

    <el-tooltip
      :content="agentStatusTooltip"
      placement="bottom"
      :show-after="200"
    >
      <div class="agent-status-indicator" :class="`agent-status--${agentStatus}`">
        <span class="agent-status-dot" />
        <span class="agent-status-label">Agent {{ agentStatusLabel }}</span>
      </div>
    </el-tooltip>
    
    <div class="header-actions flex items-center gap-2 shrink-0">
      <div class="auto-create-btn" @click="showAutocreateModal = true">
        <span class="auto-create-label">自动制作</span>
      </div>

      <el-tooltip :content="screenShareActive ? '停止共享屏幕' : '共享屏幕给管理端'" placement="bottom" :show-after="200">
        <div class="screen-share-btn" :class="{ 'screen-share-btn--active': screenShareActive }" @click="toggleScreenShare">
          <span class="screen-share-dot" />
          <span class="screen-share-label">{{ screenShareActive ? '共享中' : '共享屏幕' }}</span>
        </div>
      </el-tooltip>

      <el-switch
        v-model="isDarkMode"
        inline-prompt
        style="--el-switch-off-color: var(--1s-border-color-strong)"
        active-text="夜"
        inactive-text="昼"
        class="theme-switch"
      />

      <!--
      <el-button type="primary" size="small" @click="showSaveModel = true" class="save-btn" :icon="Download">
        <span>保存</span>
      </el-button>
      -->
    </div>
    <user-avatar v-if="loginStatusStore.isLogin" />
    <el-button @click="login" v-else type="primary" size="small" class="login-btn">登录</el-button>
  </div>
</template>

<script setup>
import { getBaseModel, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted, watch } from "vue";
import { ElMessageBox } from "element-plus";
import {
  canvasBgColor,
  canvasBgOpacity,
  currentModelController,
  showUpload,
  lastModifiedTime,
  storageName,
  builtInCanvasBackgrounds,
  currentCanvasBackground,
  isDarkMode,
  isEdit,
  currentEditingModelId,
  exitEditMode,
} from "../store";

import { openFileModal } from "@/components/design/layout/upload/index.tsx";
import { Share, UploadFilled } from "@element-plus/icons-vue";
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
import { websocketClient } from "@/services/websocketClient";
import { designAgent } from "@/ai/langgraph";
import { canvasStreamService } from "@/services/canvasStream";
import { showAutocreateModal } from "./autocreate/index";

const wsStatus = computed(() => websocketClient.state.status);
const wsStatusLabel = computed(() => {
  switch (wsStatus.value) {
    case "connected": return "已连接";
    case "connecting": return "连接中";
    case "reconnecting": return "重连中";
    case "error": return "异常";
    case "disconnected": return "已断开";
    default: return "未连接";
  }
});
const wsStatusTooltip = computed(() => {
  const latency = websocketClient.state.lastLatencyMs;
  const latencyText = latency != null ? ` · 延迟 ${latency}ms` : "";
  return `服务连接: ${wsStatusLabel.value}${latencyText}`;
});

const agentStatus = computed(() => designAgent.state.status || "idle");
const agentStatusLabel = computed(() => {
  switch (agentStatus.value) {
    case "thinking": return "思考中";
    case "executing": return "执行中";
    case "waiting_user": return "等待反馈";
    case "error": return "异常";
    default: return "空闲";
  }
});
const agentStatusTooltip = computed(() => {
  const error = designAgent.state.error ? ` · ${designAgent.state.error}` : "";
  const count = designAgent.state.messages?.length ?? 0;
  return `AI Agent: ${agentStatusLabel.value} · ${count} 条消息${error}`;
});

// 屏幕共享（监听 canvasStreamService 状态，无论谁触发都同步）
const screenShareActive = ref(canvasStreamService.isActive());

watch(() => canvasStreamService.status.isStreaming, (active) => {
  screenShareActive.value = active;
  websocketClient.setScreenSharing(active);
});

const toggleScreenShare = async () => {
  if (screenShareActive.value) {
    canvasStreamService.stopMonitoring();
    // watch 会自动更新 screenShareActive 和 setScreenSharing
  } else {
    try {
      await canvasStreamService.startMonitoring();
      // watch 会自动更新 screenShareActive 和 setScreenSharing
    } catch (e) {
      console.warn("[ScreenShare] Failed:", e?.message);
    }
  }
};

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

function confirmExitEditMode() {
  ElMessageBox.confirm(
    '退出编辑模式后，所有改动不会影响到已保存的模型，截图也不会关联到该模型。确定要退出吗？',
    '确认退出编辑模式',
    {
      confirmButtonText: '确定退出',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      exitEditMode();
    })
    .catch(() => {
      // 用户取消退出
    });
}

</script>

<style lang="less" scoped>
.designiy-header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  column-gap: var(--1s-control-gap);
  padding: 0 10px 0 6px;
  min-width: 0;
  background: var(--1s-surface-background);
  color: var(--1s-text-color);
}

.designiy-header__brand {
  width: 44px;
  height: 100%;
  flex-shrink: 0;
}

.designiy-header__brand-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.designiy-header__spacer {
  flex: 1;
  min-width: 0;
}

.edit-mode-info {
  min-width: 0;
  
  .model-id-text {
    font-size: 10px;
    color: var(--1s-text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
}

.header-link {
  padding-inline: 4px;
  font-size: 10px;
  color: var(--1s-text-color-secondary);
}

.header-actions {
  min-width: 0;
  flex-wrap: nowrap;
  gap: 6px;
  
  .action-btn {
    white-space: nowrap;
  }
  
  .theme-switch {
    flex-shrink: 0;
  }
  
  .three-canvas-switch {
    flex-shrink: 0;
  }
  
  .save-btn,
  .login-btn {
    flex-shrink: 0;
  }
}

.save-btn,
.login-btn {
  min-width: 50px;
  padding-inline: 10px;
}

:deep(.el-switch) {
  --el-switch-height: 18px;
  --el-switch-width: 34px;
  --el-switch-border-radius: 999px;
}

:deep(.el-switch__label) {
  font-size: 9px;
}

.ws-status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  cursor: default;
  user-select: none;
  flex-shrink: 0;
}

.agent-status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  cursor: default;
  user-select: none;
  flex-shrink: 0;
}

.ws-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ws-status-label {
  font-size: 10px;
  white-space: nowrap;
  line-height: 1;
}

.agent-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.agent-status-label {
  font-size: 10px;
  white-space: nowrap;
  line-height: 1;
}

.ws-status--connected {
  .ws-status-dot {
    background: #52c41a;
    box-shadow: 0 0 4px rgba(82, 196, 26, 0.5);
  }
  .ws-status-label {
    color: #52c41a;
  }
}

.ws-status--connecting,
.ws-status--reconnecting {
  .ws-status-dot {
    background: #faad14;
    animation: ws-pulse 1.2s ease-in-out infinite;
  }
  .ws-status-label {
    color: #faad14;
  }
}

.ws-status--error {
  .ws-status-dot {
    background: #ff4d4f;
    animation: ws-pulse 1.2s ease-in-out infinite;
  }
  .ws-status-label {
    color: #ff4d4f;
  }
}

.ws-status--disconnected,
.ws-status--idle {
  .ws-status-dot {
    background: rgba(128, 128, 128, 0.5);
  }
  .ws-status-label {
    color: var(--1s-text-color-secondary, #999);
  }
}

.agent-status--idle {
  .agent-status-dot {
    background: #52c41a;
    box-shadow: 0 0 4px rgba(82, 196, 26, 0.4);
  }
  .agent-status-label {
    color: #52c41a;
  }
}

.agent-status--thinking,
.agent-status--executing {
  .agent-status-dot {
    background: #faad14;
    animation: ws-pulse 1.2s ease-in-out infinite;
  }
  .agent-status-label {
    color: #faad14;
  }
}

.agent-status--waiting_user {
  .agent-status-dot {
    background: #1677ff;
    animation: ws-pulse 1.2s ease-in-out infinite;
  }
  .agent-status-label {
    color: #1677ff;
  }
}

.agent-status--error {
  .agent-status-dot {
    background: #ff4d4f;
    animation: ws-pulse 1.2s ease-in-out infinite;
  }
  .agent-status-label {
    color: #ff4d4f;
  }
}

.screen-share-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .screen-share-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.5);
    flex-shrink: 0;
  }

  .screen-share-label {
    font-size: 10px;
    white-space: nowrap;
    line-height: 1;
    color: var(--1s-text-color-secondary, #999);
  }
}

.auto-create-btn {
  display: flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  transition: all 0.12s;
  border: 1px solid var(--1s-border-color-strong, #d9d9d9);

  &:hover {
    border-color: #6c5ce7;
    color: #6c5ce7;
  }

  .auto-create-label {
    font-size: 10px;
    white-space: nowrap;
    line-height: 1.6;
    color: var(--1s-text-color-secondary, #636e72);
    font-weight: 500;
  }
}

.screen-share-btn--active {
  .screen-share-dot {
    background: #52c41a;
    box-shadow: 0 0 4px rgba(82, 196, 26, 0.5);
    animation: ws-pulse 1.5s ease-in-out infinite;
  }
  .screen-share-label {
    color: #52c41a;
  }
}

@keyframes ws-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

// 响应式设计
@media (max-width: 1200px) {
  .edit-mode-info .model-id-text {
    max-width: 150px;
  }

  .header-link {
    display: none;
  }
}

@media (max-width: 1000px) {
  .edit-mode-info .model-id-text {
    max-width: 120px;
  }
  
  .header-actions {
    gap: 4px;
  }
}

@media (max-width: 800px) {
  .designiy-header {
    padding: 0 8px 0 4px;
  }
  
  .edit-mode-info .model-id-text {
    max-width: 100px;
    font-size: 9px;
  }
  
  .header-actions {
    gap: 2px;
    
    .theme-switch,
    .three-canvas-switch {
      transform: scale(0.9);
    }
  }
}

@media (max-width: 600px) {
  .edit-mode-info {
    .model-id-text {
      display: none;
    }
  }
  
  .header-actions {
    .save-btn {
      min-width: 36px;
      
      span {
        display: none;
      }
    }
  }
}

@media (max-width: 480px) {
  .designiy-header {
    column-gap: 4px;
    padding-right: 6px;
  }
  
  .header-actions {
    gap: 1px;
    
    .save-btn {
      min-width: 32px;
      padding-inline: 8px;
    }
    
    .theme-switch,
    .three-canvas-switch {
      transform: scale(0.8);
    }
  }
}
</style>
