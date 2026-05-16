<template>
  <div class="gif-recorder">
    <el-popover
      v-model:visible="popoverVisible"
      trigger="click"
      placement="bottom"
      width="320"
    >
      <template #reference>
        <el-button
          :type="isRecording ? 'danger' : 'default'"
          size="small"
          :icon="isRecording ? VideoPause : VideoPlay"
          :loading="isProcessing"
        >
          {{ isRecording ? "停止录制" : "录制 GIF" }}
        </el-button>
      </template>

      <div class="gif-recorder-panel">
        <div class="gif-recorder-header">
          <span class="gif-recorder-title">GIF 录制</span>
          <el-tag v-if="isRecording" type="danger" size="small" effect="dark">
            录制中 {{ recordingDuration }}s
          </el-tag>
          <el-tag v-else-if="frameCount > 0" type="success" size="small">
            {{ frameCount }} 帧
          </el-tag>
        </div>

        <el-divider />

        <div class="gif-recorder-config">
          <el-form label-width="80px" size="small">
            <el-form-item label="帧间隔">
              <el-slider
                v-model="config.interval"
                :min="50"
                :max="1000"
                :step="50"
                show-input
                input-size="small"
              />
            </el-form-item>

            <el-form-item label="质量">
              <el-slider
                v-model="config.quality"
                :min="1"
                :max="30"
                :step="1"
                show-input
                input-size="small"
              />
            </el-form-item>

            <el-form-item label="循环播放">
              <el-switch v-model="config.loop" />
            </el-form-item>

            <el-form-item label="宽度">
              <el-input-number
                v-model="config.width"
                :min="0"
                :max="2000"
                :step="10"
                placeholder="自动"
                size="small"
              />
            </el-form-item>

            <el-form-item label="高度">
              <el-input-number
                v-model="config.height"
                :min="0"
                :max="2000"
                :step="10"
                placeholder="自动"
                size="small"
              />
            </el-form-item>
          </el-form>
        </div>

        <el-divider />

        <div class="gif-recorder-actions">
          <el-button
            v-if="!isRecording && frameCount === 0"
            type="primary"
            size="small"
            @click="handleStart"
          >
            开始录制
          </el-button>

          <template v-if="isRecording">
            <el-button type="danger" size="small" @click="handleStop">
              停止录制
            </el-button>
          </template>

          <template v-if="!isRecording && frameCount > 0">
            <el-button
              type="success"
              size="small"
              :loading="isProcessing"
              @click="handleExport"
            >
              导出 GIF
            </el-button>
            <el-button size="small" @click="handleClear"> 清空 </el-button>
          </template>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VideoPlay, VideoPause } from "@element-plus/icons-vue";
import { gifRecorder } from "./gifRecorder";
import { currentCanvasControllerInstance } from "./index.tsx";
import { ElMessage } from "element-plus";

const popoverVisible = ref(false);

const {
  config,
  isRecording,
  isProcessing,
  frameCount,
  recordingDuration,
  startRecording,
  stopRecording,
  exportGif,
  clearFrames,
} = gifRecorder;

function getCanvasElement(): HTMLElement | null {
  const controller = currentCanvasControllerInstance.value;
  if (!controller) return null;
  return controller.el || null;
}

function handleStart() {
  const element = getCanvasElement();
  if (!element) {
    ElMessage.warning("请先打开画布");
    return;
  }
  startRecording(element);
  ElMessage.success("开始录制");
}

function handleStop() {
  stopRecording();
  ElMessage.success("录制完成");
}

async function handleExport() {
  try {
    await exportGif();
    ElMessage.success("GIF 导出成功");
  } catch (error: any) {
    ElMessage.error(error?.message || "导出失败");
  }
}

function handleClear() {
  clearFrames();
  ElMessage.info("已清空录制帧");
}
</script>

<style scoped>
.gif-recorder {
  display: inline-flex;
}

.gif-recorder-panel {
  padding: 4px 0;
}

.gif-recorder-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gif-recorder-title {
  font-size: 14px;
  font-weight: 600;
}

.gif-recorder-config {
  padding: 0 4px;
}

.gif-recorder-config :deep(.el-form-item) {
  margin-bottom: 12px;
}

.gif-recorder-config :deep(.el-form-item__label) {
  font-size: 12px;
}

.gif-recorder-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
