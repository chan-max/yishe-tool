<template>
    <div class="menu-bar">
      <el-tooltip :hide-after="0" content="选择模型" placement="right">
        <div
          class="menu-bar-item"
          :class="{ 'menu-bar-item-focus': showBaseModelSelect }"
          @click="showBaseModelSelect = !showBaseModelSelect"
        >
          <div class="menu-bar-item-icon"><icon-shirt></icon-shirt></div>
          <span>选择模型</span>
        </div>
      </el-tooltip>
      <el-tooltip :hide-after="0" content="图片贴图" placement="right">
        <div
          class="menu-bar-item"
          :class="{ 'menu-bar-item-focus': showImageSticker }"
          @click="showImageSticker = !showImageSticker"
        >
          <div class="menu-bar-item-icon"><icon-photo></icon-photo></div>
          <span>图片贴纸</span>
        </div>
      </el-tooltip>
      <el-tooltip :hide-after="0" content="艺术字贴图" placement="right">
        <div
          class="menu-bar-item"
          :class="{ 'menu-bar-item-focus': showTextSticker }"
          @click="showTextSticker = !showTextSticker"
        >
          <div class="menu-bar-item-icon"><icon-text></icon-text></div>
          <span>文字贴纸</span>
        </div>
      </el-tooltip>

      <el-tooltip :hide-after="0" content="服装装饰品" placement="right">
        <div
          class="menu-bar-item"
          @click="showDecoration = !showDecoration"
        >
          <div class="menu-bar-item-icon">
            <icon-decoration></icon-decoration>
          </div>
          <span>饰品</span>
        </div>
      </el-tooltip>


      <el-tooltip :hide-after="0" content="几何图形" placement="right">
        <div class="menu-bar-item">
          <div class="menu-bar-item-icon"><icon-box></icon-box></div>
          <span>图形贴纸</span>
        </div>
      </el-tooltip>

      <el-tooltip :hide-after="0" content="自定义文字" placement="right">
        <div
          class="menu-bar-item"
          @click="showCustomTextSticker = !showCustomTextSticker"
        >
          <div class="menu-bar-item-icon"><icon-paint></icon-paint></div>
          <span>文字创作</span>
        </div>
      </el-tooltip>


      <el-tooltip :hide-after="0" content="字体" placement="right">
        <div class="menu-bar-item" @click="showFontList = true">
          <div class="menu-bar-item-icon"><icon-font></icon-font></div>
          <span>字体</span>
        </div>
      </el-tooltip>

      <el-tooltip :hide-after="0" content="喷图" placement="right">
        <div class="menu-bar-item">
          <div class="menu-bar-item-icon"><icon-brush></icon-brush></div>
          <span>喷漆</span>
        </div>
      </el-tooltip>
      <el-tooltip :hide-after="0" content="尺寸测量工具" placement="right">
        <div class="menu-bar-item">
          <div class="menu-bar-item-icon"><icon-ruler></icon-ruler></div>
          <span>测量</span>
        </div>
      </el-tooltip>
      <el-tooltip :hide-after="0" content="设置场景" placement="right">
        <div
          class="menu-bar-item"
          @click="showSceneControl = !showSceneControl"
        >
          <div class="menu-bar-item-icon"><icon-earth></icon-earth></div>
          <span>场景</span>
        </div>
      </el-tooltip>
      <el-tooltip :hide-after="0" content="灯光调整" placement="right">
        <div class="menu-bar-item">
          <div class="menu-bar-item-icon"><icon-light></icon-light></div>
          <span>灯光</span>
        </div>
      </el-tooltip>
      <el-tooltip :hide-after="0" content="预览模型" placement="right">
        <div class="menu-bar-item">
          <div class="menu-bar-item-icon"><icon-eye></icon-eye></div>
          <span>预览</span>
        </div>
      </el-tooltip>

      <div style="flex: 1"></div>

      <el-tooltip :hide-after="0" content="系统设置" placement="right">
        <div class="menu-bar-item">
          <div class="menu-bar-item-icon"><icon-setting></icon-setting></div>
          <span>设置</span>
        </div>
      </el-tooltip>
    </div>
</template>
<script setup>
import {
  showBaseModelSelect,
  isDarkMode,
  isFullScreen,
  canvasBgColor,
  canvasBgOpacity,
  showSceneControl,
  showImageSticker,
  showTextSticker,
  showWorkspace,
  showCustomTextSticker,
  showFontList,
showDecoration
} from "../store";

import iconWorkspace from "@/icon/workspace.svg?vueComponent";
import iconShirt from "@/icon/shirt.svg?vueComponent";
import iconPhoto from "@/icon/photo.svg?vueComponent";
import iconText from "@/icon/text.svg?vueComponent";
import iconPaint from "@/icon/paint.svg?vueComponent";
import iconBox from "@/icon/box.svg?vueComponent";
import iconBrush from "@/icon/brush.svg?vueComponent";
import iconRuler from "@/icon/ruler.svg?vueComponent";
import iconEarth from "@/icon/earth.svg?vueComponent";
import iconLight from "@/icon/light.svg?vueComponent";
import iconEye from "@/icon/eye.svg?vueComponent";
import iconHelp from "@/icon/help.svg?vueComponent";

import iconSetting from "@/icon/setting.svg?vueComponent";
import iconFont from "@/icon/font.svg?vueComponent";
import iconDecoration from '@/icon/design/decoration.svg?vueComponent';

</script>
<style lang="less">

.menu-bar {
  width: 80px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2px;
  row-gap: 16px;
  overflow: auto;
  direction: rtl;
  background: var(--1s-left-menu-background-color);
  padding: 16px 0;
  box-sizing: border-box;
}

.menu-bar-item {
  width: 64px;
  height: 64px;
  display: flex;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--1s-icon-color);
    
  .menu-bar-item-icon{
    flex-shrink: 0;
    padding:6px;
    display:flex;
  }
  svg {
    width: 18px;
    height: 18px;
  }
  span {
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 50px;
    font-weight: 400;
  }

  &:hover {
      background: #eee;
  }
}

.menu-bar-item-focus {
  background: #eee;
}
</style>
