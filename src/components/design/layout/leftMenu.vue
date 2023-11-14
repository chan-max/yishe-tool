<template>
  <div class="menu-bar">
    <el-tooltip :hide-after="0" content="工作台" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showWorkTreeDialog }"
        @click="showWorkTreeDialog = !showWorkTreeDialog"
      >
        <font-awesome-icon :icon="['fas', 'desktop']" />
        <span>工作台</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="选择服装模型" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showBaseModelSelectDialog }"
        @click="showBaseModelSelectDialog = !showBaseModelSelectDialog"
      >
        <font-awesome-icon :icon="['fas', 'shirt']" />
        <span>服装</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="图片贴图" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showImageStickerDialog }"
        @click="showImageStickerDialog = !showImageStickerDialog"
      >
        <font-awesome-icon :icon="['faR', 'image']" />
        <span>图片</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="艺术字贴图" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showTextStickerDialog }"
        @click="showTextStickerDialog = !showTextStickerDialog"
      >
        <font-awesome-icon :icon="['fas', 'font']" />
        <span>文字</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="自定义涂鸦" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'palette']" />
        <span>涂鸦</span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="几何图形" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'circle-nodes']" />
        <span>几何图</span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="喷图" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'paint-roller']" />
        <span>喷漆</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="尺寸测量工具" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'ruler']" />
        <span>测量</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="设置场景" placement="right">
      <div
        class="menu-bar-item"
        @click="showSceneControlDialog = !showSceneControlDialog"
      >
        <font-awesome-icon :icon="['fas', 'video']" />
        <span>场景</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="灯光调整" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'lightbulb']" />
        <span>灯光</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="预览模型" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'eye']" />
        <span>预览</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="使用帮助" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'circle-question']" />
        <span>帮助</span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="导出当前模型" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'file-export']" />
        <span>导出</span>
      </div>
    </el-tooltip>
    <div style="flex: 1"></div>

    <el-tooltip :hide-after="0" content="切换外观模式" placement="right">
      <div class="menu-bar-item" @click="isDarkMode = !isDarkMode">
        <font-awesome-icon v-if="isDarkMode" :icon="['fas', 'sun']" />
        <font-awesome-icon v-else :icon="['fas', 'moon']" />
        <span>外观</span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="系统设置" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'gear']" />
        <span>设置</span>
      </div>
    </el-tooltip>
  </div>
</template>
<script setup>
import {
  showBaseModelSelectDialog,
  isDarkMode,
  isFullScreen,
  canvasBgColor,
  canvasBgOpacity,
  showSceneControlDialog,
  showImageStickerDialog,
  showTextStickerDialog,
  showWorkTreeDialog,
} from "../store";

import svgIcon from '@/components/svgIcon.vue'



</script>
<style lang="less">
.menu-bar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  row-gap: 6px;
}

.menu-bar-item {
  width: 50px;
  height: 50px;
  display: flex;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  row-gap: 5px;
  flex-shrink: 0;
  color: var(--1s-icon-color);
  svg {
    width: 18px;
    height: 18px;
  }
  span {
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 50px;
  }
  &:hover {
    background: var(--1s-left-menu-icon-hover-background-color);
  }
}

.menu-bar-item-focus {
  background: var(--1s-left-menu-icon-hover-background-color);
}
</style>
