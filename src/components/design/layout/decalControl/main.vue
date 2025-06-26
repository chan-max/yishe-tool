<template>
  <div class="container" v-if="currentOperatingDecalController">
    <div style="padding: 0.75rem">
      <s1-img
        :src="currentOperatingDecalController.state.src"
        style="width: 48px; height: 48px"
        class="png-background"
      ></s1-img>
    </div>

    <div style="padding: 0.75rem">
      <el-form label-position="left" label-width="78px" size="small" class="custom-form">
        <el-form-item label="旋转角度">
          <el-slider
            :min="0"
            :max="360"
            :step="1"
            v-model="currentOperatingDecalController.state.modelValueRotate"
            size="small"
          />
        </el-form-item>

        <el-form-item label="贴纸尺寸">
          <el-slider
            :min="0"
            :max="100"
            :step="1"
            v-model="currentOperatingDecalController.state.modelValueSize"
            size="small"
          />
        </el-form-item>

        <el-form-item label="贴纸粗糙度">
          <el-slider
            :min="0"
            :max="1"
            :step="0.01"
            v-model="currentOperatingDecalController.state.roughness"
            size="small"
          />
        </el-form-item>

        <el-form-item label="金属质感">
          <el-slider
            :min="0"
            :max="1"
            :step="0.01"
            v-model="currentOperatingDecalController.state.metalness"
            size="small"
          />
        </el-form-item>

        <el-form-item label="调整位置">
          <div class="position-control-container">
            <!-- 方向控制区域 -->
            <div class="direction-controls">
              <!-- 上方向 -->
              <div class="direction-row">
                <div class="direction-spacer"></div>
                <el-button
                  @click="moveTop"
                  :icon="Top"
                  class="direction-btn up-btn"
                  size="small"
                  circle
                ></el-button>
                <div class="direction-spacer"></div>
              </div>

              <!-- 左中右方向 -->
              <div class="direction-row">
                <el-button
                  @click="moveLeft"
                  :icon="Back"
                  class="direction-btn left-btn"
                  size="small"
                  circle
                ></el-button>
                <div class="center-spacer"></div>
                <el-button
                  @click="moveRight"
                  :icon="Right"
                  class="direction-btn right-btn"
                  size="small"
                  circle
                ></el-button>
              </div>

              <!-- 下方向 -->
              <div class="direction-row">
                <div class="direction-spacer"></div>
                <el-button
                  @click="moveDown"
                  :icon="Bottom"
                  class="direction-btn down-btn"
                  size="small"
                  circle
                ></el-button>
                <div class="direction-spacer"></div>
              </div>
            </div>

            <!-- 重置按钮 -->
            <div class="reset-section">
              <el-button
                @click="resetPosition"
                :icon="RefreshRight"
                class="reset-btn"
                size="small"
                type="warning"
              >
                恢复原始贴图位置
              </el-button>
            </div>
          </div>

          <a-alert
            message="适用于微调，如果出现贴纸部分丢失，建议重新拉取一个贴纸"
            banner
            closable
            style="margin-top: 8px"
          />
        </el-form-item>
        <el-form-item label="印花工艺">
          <el-select
            v-model="clothingPaintMethod"
            size="small"
            placeholder="选择印花工艺"
          >
            <template #label="{ label }">
              <div style="font-size: 0.875rem">{{ label }}</div>
            </template>
            <el-option
              v-for="item in clothingPaintMethods"
              :key="item.title"
              :label="item.title"
              :value="item.title"
            >
              <el-popover width="auto" :hide-after="0" placement="right">
                <template #reference>
                  <div class="flex">
                    {{ item.title }}
                  </div>
                </template>
                <s1-img
                  :src="item.thumbnail"
                  fit="cover"
                  style="width: 180px; height: 180px"
                ></s1-img>
                <div style="width: 180px; padding: 8px">
                  {{ item.description }}
                </div>
              </el-popover>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div></div>

    <div style="flex: 1"></div>

    <div>
      <el-button @click="useCurrentSticker()" round plain class="bottom-btn"
      >在贴纸制作中使用该贴纸模版</el-button
    >
    </div>
    <div v-if="currentOperatingDecalController.state.isLocalResource">
      <el-button
      @click="upload"
      plain
      round
      class="bottom-btn"
    >
      点击上传
    </el-button>
    </div>
    <div>
      <el-button @click="showDecalList = !showDecalList" round plain class="bottom-btn"> 贴纸列表 </el-button>
    </div>
    <div>
      <el-button @click="showWorkspace = !showWorkspace" round plain class="bottom-btn"> 工作台 </el-button>
    </div>
    <div>
      <el-button @click="remove" type="danger" round class="bottom-btn">移除该贴纸</el-button>
    </div>
  </div>

  <s1-empty v-else>
    <template #description> 未选择贴纸 </template>
  </s1-empty>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import {
  currentOperatingDecalController,
  showWorkspace,
  showDecalControl,
  showDecalList,
  showCanvasLayout,
} from "../../store";
import { Top, Bottom, Back, Right, RefreshRight } from "@element-plus/icons-vue";
import { canvasStickerOptions } from "../canvas";
import { clothingPaintMethods } from ".";

function remove() {
  currentOperatingDecalController.value.remove();
  showCanvasLayout.value = true;
}

function upload() {}

function moveTop() {
  currentOperatingDecalController.value.moveTop();
}

function moveDown() {
  currentOperatingDecalController.value.moveDown();
}

function moveLeft() {
  currentOperatingDecalController.value.moveLeft();
}

function moveRight() {
  currentOperatingDecalController.value.moveRight();
}

function resetPosition() {
  currentOperatingDecalController.value.resetPosition();
}

function useCurrentSticker() {
  let currentOperatingDecalControllerState = currentOperatingDecalController.value.state;

  canvasStickerOptions.value =
    currentOperatingDecalControllerState.info.data ||
    currentOperatingDecalControllerState.info.meta.data;
  showCanvasLayout.value = true;
}

const clothingPaintMethod = ref();
</script>

<style scoped lang="less">
.container {
  width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  row-gap: 0.75rem;
  overflow: auto;
}

.custom-form {
  :deep(.el-form-item__label) {
    font-size: 12px;
    color: #606266;
  }
}

.bottom-btn {
  width: 100% !important;
}

.container > div {
  width: 100%;
}

.position-control-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
}

.direction-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  position: relative;
}

.direction-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.direction-spacer {
  width: 20px;
  height: 20px;
}

.center-spacer {
  width: 20px;
  height: 20px;
}

.reset-section {
  margin-top: 12px;
  width: 100%;
}

.reset-btn {
  width: 100%;
}

.direction-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  font-size: 14px;

  &:hover {
    background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
    border-color: #c0c4cc;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.up-btn {
  margin-bottom: 6px;
}

.down-btn {
  margin-top: 6px;
}

.left-btn {
  margin-right: 6px;
}

.right-btn {
  margin-left: 6px;
}
</style>
