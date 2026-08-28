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
    <div class="designiy-header__brand">
      <img src="/favicon.png" class="designiy-header__brand-logo" />
      <span class="designiy-header__brand-title">1s design tool</span>
    </div>

    <template v-if="isEdit">
      <div class="edit-mode-info flex items-center gap-2 shrink-0">
        <span class="model-id-text">模型ID: {{ currentEditingModelId }}</span>
        <Button variant="destructive" size="sm" @click="confirmExitEditMode">退出</Button>
      </div>
    </template>

    <!-- 自定义贴纸编辑模式指示 -->
    <template v-else-if="currentEditingCustomStickerId">
      <div class="edit-mode-info flex items-center gap-1.5 shrink-0">
        <Badge variant="secondary" class="h-6 gap-1.5 px-2 text-[11px] font-medium border border-amber-400/60 bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/40 shadow-xs">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <Pencil class="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span class="max-w-[150px] truncate">编辑中: {{ currentEditingCustomStickerName || currentEditingCustomStickerId }}</span>
        </Badge>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="xs" class="h-6 text-[11px] text-muted-foreground hover:text-foreground" @click="handleConvertToCreateNew">
              转为新建
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">断开原贴纸关联，保存时将作为新贴纸创建</TooltipContent>
        </Tooltip>
      </div>
    </template>

    <!-- 新建空白作品指示 -->
    <template v-else>
      <div class="edit-mode-info flex items-center shrink-0">
        <Badge variant="outline" class="h-6 px-2 text-[11px] font-normal text-muted-foreground border-dashed">
          新建贴纸
        </Badge>
      </div>
    </template>

    <div class="designiy-header__spacer"></div>

    <Button variant="ghost" size="sm" class="h-7 text-xs text-muted-foreground hover:text-foreground">快速指南</Button>

    <Tooltip>
      <TooltipTrigger as-child>
        <Badge variant="outline" class="h-6 gap-1.5 px-2 text-[11px] font-normal cursor-pointer select-none border-border hover:bg-accent/50 transition-colors">
          <span
            class="h-1.5 w-1.5 rounded-full shrink-0"
            :class="{
              'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]': wsStatus === 'connected',
              'bg-amber-500 animate-pulse': wsStatus === 'connecting' || wsStatus === 'reconnecting',
              'bg-rose-500': wsStatus === 'error',
              'bg-muted-foreground/50': wsStatus === 'disconnected' || wsStatus === 'idle'
            }"
          />
          <span class="text-muted-foreground">{{ wsStatusLabel }}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">{{ wsStatusTooltip }}</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Badge variant="outline" class="h-6 gap-1.5 px-2 text-[11px] font-normal cursor-pointer select-none border-border hover:bg-accent/50 transition-colors">
          <span
            class="h-1.5 w-1.5 rounded-full shrink-0"
            :class="{
              'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]': agentStatus === 'idle',
              'bg-amber-500 animate-pulse': agentStatus === 'thinking' || agentStatus === 'executing',
              'bg-rose-500': agentStatus === 'error',
              'bg-muted-foreground/50': agentStatus === 'disconnected'
            }"
          />
          <span class="text-muted-foreground">Agent {{ agentStatusLabel }}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">{{ agentStatusTooltip }}</TooltipContent>
    </Tooltip>
    
    <div class="header-actions flex items-center gap-2 shrink-0">
      <Button
        :variant="batchIsRunning ? 'default' : 'outline'"
        size="sm"
        class="h-6 text-[11px] px-2.5 gap-1.5 font-medium"
        @click="showAutocreateModal = true"
      >
        <span v-if="batchIsRunning" class="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-ping shrink-0" />
        <span>{{ autoCreateButtonLabel }}</span>
      </Button>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            :variant="screenShareActive ? 'default' : 'outline'"
            size="sm"
            class="h-6 text-[11px] px-2.5 gap-1.5 font-medium"
            @click="toggleScreenShare"
          >
            <span
              class="h-1.5 w-1.5 rounded-full shrink-0"
              :class="screenShareActive ? 'bg-primary-foreground animate-pulse' : 'bg-muted-foreground/50'"
            />
            <span>{{ screenShareActive ? '共享中' : '共享屏幕' }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{{ screenShareActive ? '停止共享屏幕' : '共享屏幕给管理端' }}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <button
            class="h-6 w-6 rounded-md inline-flex items-center justify-center border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer select-none"
            @click="isDarkMode = !isDarkMode"
            :aria-label="isDarkMode ? '切换为浅色模式' : '切换为深色模式'"
          >
            <Moon v-if="isDarkMode" class="h-3.5 w-3.5 text-indigo-400" />
            <Sun v-else class="h-3.5 w-3.5 text-amber-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{{ isDarkMode ? '深色模式（点击切换浅色）' : '浅色模式（点击切换深色）' }}</TooltipContent>
      </Tooltip>
    </div>
    <user-avatar v-if="loginStatusStore.isLogin" />
    <Button @click="login" v-else variant="default" size="sm" class="login-btn">登录</Button>
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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Pencil, Sun, Moon } from "lucide-vue-next";
import { message } from "ant-design-vue";
import {
  currentEditingCustomStickerId,
  currentEditingCustomStickerName,
  exitCustomStickerEditMode,
} from "@/components/design/layout/canvas/index.tsx";

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
import { batchProgress } from "@/ai/agent/batch";
import { getAgentPhaseLabel } from "@/ai/agent/presentation";

const batchIsRunning = computed(() =>
  ["preparing", "running", "paused"].includes(batchProgress.status),
);
const batchCompletedCount = computed(
  () =>
    batchProgress.items.filter((item) =>
      ["done", "failed", "skipped"].includes(item.status),
    ).length,
);
const autoCreateButtonLabel = computed(() => {
  if (batchProgress.status === "preparing") return "准备中";
  if (batchProgress.status === "paused") {
    return `已暂停 ${batchCompletedCount.value}/${batchProgress.items.length}`;
  }
  if (batchProgress.status === "running") {
    return `制作中 ${batchCompletedCount.value}/${batchProgress.items.length}`;
  }
  return "自动制作";
});

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
const agentStatusLabel = computed(() =>
  getAgentPhaseLabel(agentStatus.value, designAgent.state.plan),
);
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

function handleConvertToCreateNew() {
  const previousName = currentEditingCustomStickerName.value;
  exitCustomStickerEditMode();
  message.success(`已转为新建模式${previousName ? `（基于「${previousName}」副本）` : ''}，保存时将生成新作品`);
}

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
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
  padding: 0 10px 0 4px;
  gap: 9px;
  border-right: 1px solid var(--1s-divider-color, #e4e4e7);
  text-decoration: none;
  overflow: hidden;
  cursor: default;
}

.designiy-header__brand-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}

.designiy-header__brand-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--1s-text-color, #162033);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  flex: 1;
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
  width: 108px;
  height: 24px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 8px;
  box-sizing: border-box;
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

.auto-create-status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  animation: auto-create-dot-pulse 1.2s ease-in-out infinite;
}

.auto-create-btn--running {
  border-color: #6c5ce7;
  background: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.14);
  animation: auto-create-running-pulse 1.8s ease-in-out infinite;

  &:hover {
    border-color: #5b4cdb;
    background: #5b4cdb;
  }

  .auto-create-label {
    color: #fff;
    font-weight: 650;
  }
}

.auto-create-btn--paused {
  border-color: #d97706;
  background: #d97706;
  animation: none;

  &:hover {
    border-color: #b45309;
    background: #b45309;
  }

  .auto-create-status-dot {
    animation: none;
  }
}

@keyframes auto-create-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.72); }
}

@keyframes auto-create-running-pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.12); }
  50% { box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.2); }
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
