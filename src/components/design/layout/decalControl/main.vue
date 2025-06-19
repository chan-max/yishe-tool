<template>
  <div class="container" v-if="currentOperatingDecalController">
    <div style="padding: 1rem">
      <s1-img
        :src="currentOperatingDecalController.state.src"
        style="width: 64px; height: 64px"
        class="png-background"
      ></s1-img>
    </div>

    <div style="padding: 1rem">
      <el-form label-position="left" label-width="64px">
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
            style="margin-top: 12px"
          />
        </el-form-item>
        <el-form-item label="印花工艺">
          <el-select
            v-model="clothingPaintMethod"
            size="small"
            placeholder="选择印花工艺"
          >
            <template #label="{ label }">
              <div style="font-size: 1rem">{{ label }}</div>
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
                  style="width: 200px; height: 200px"
                ></s1-img>
                <div style="width: 200px; padding: 12px">
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
      <el-button @click="useCurrentSticker()" round style="flex: 1" plain
      >在贴纸制作中使用该贴纸模版</el-button
    >
    </div>
    <div v-if="currentOperatingDecalController.state.isLocalResource">
      <el-button
      @click="upload"
      plain
      round
    >
      点击上传
    </el-button>
    </div>
    <div>
      <el-button @click="showDecalList = !showDecalList" round plain> 贴纸列表 </el-button>
    </div>
    <div>
      <el-button @click="showWorkspace = !showWorkspace" round plain> 工作台 </el-button>
    </div>
    <div>    <el-button @click="remove" type="danger" round>移除该贴纸</el-button></div>
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  row-gap: 1rem;
  overflow: auto;
}

.position-control-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
}

.direction-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  position: relative;
}

.direction-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.direction-spacer {
  width: 24px;
  height: 24px;
}

.center-spacer {
  width: 24px;
  height: 24px;
}

.reset-section {
  margin-top: 16px;
  width: 100%;
}

.reset-btn {
  width: 100%;
}

.direction-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  font-size: 16px;

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
  margin-bottom: 8px;
}

.down-btn {
  margin-top: 8px;
}

.left-btn {
  margin-right: 8px;
}

.right-btn {
  margin-left: 8px;
}
</style>
