<template>
  <div class="menu-bar">
    <el-tooltip :hide-after="0" content="工作台" placement="right">
      <div class="menu-bar-item" @click="showWorkTreeDialog = !showWorkTreeDialog">
        <font-awesome-icon :icon="['fas', 'desktop']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="选择服装模型" placement="right">
      <div class="menu-bar-item" @click="showBaseModelSelectDialog = !showBaseModelSelectDialog">
        <font-awesome-icon :icon="['fas', 'shirt']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="图片贴图" placement="right">
      <div class="menu-bar-item" @click="showImageStickerDialog = !showImageStickerDialog">
        <font-awesome-icon :icon="['fas', 'image']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="艺术字贴图" placement="right">
      <div class="menu-bar-item" @click="showTextStickerDialog = !showTextStickerDialog">
        <font-awesome-icon :icon="['fas', 'font']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="自定义涂鸦" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'palette']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="喷图" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'paint-roller']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="尺寸测量工具" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'ruler']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="设置场景" placement="right">
      <div class="menu-bar-item" @click="showSceneControlDialog = !showSceneControlDialog">
        <font-awesome-icon :icon="['fas', 'video']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="灯光调整" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'lightbulb']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="预览模型" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'eye']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="使用帮助" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'circle-question']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" :content="isDarkMode ? '白天模式' : '夜间模式'" placement="right">
      <div class="menu-bar-item" @click="isDarkMode = !isDarkMode">
        <font-awesome-icon v-if="isDarkMode" :icon="['fas', 'sun']" />
        <font-awesome-icon v-else :icon="['fas', 'moon']" />
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="导出当前模型" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'file-export']" />
      </div>
    </el-tooltip>
  </div>
</template>
<script setup>
import { showBaseModelSelectDialog, isDarkMode, isFullScreen,canvasBgColor, canvasBgOpacity, showSceneControlDialog,showImageStickerDialog,showTextStickerDialog, showWorkTreeDialog} from "../store";
</script>
<style lang="less">
.menu-bar {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

.menu-bar-item {
  width: 100%;
  height: 34px;
  min-height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
  &:hover {
    svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
