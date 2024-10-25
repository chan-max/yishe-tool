<template>
  <div class="menu-bar">
    <el-tooltip :hide-after="0" content="创作资源" placement="right">
      <div
        class="menu-bar-item"
        @click="viewDisplayController.showProject = !viewDisplayController.showProject"
      >
        <div class="menu-bar-item-icon"><icon-project></icon-project></div>
        <span>创作资源</span>
      </div>
    </el-tooltip>
    <!-- <el-tooltip :hide-after="0" content="工作台" placement="right">
      <div class="menu-bar-item" :class="{ 'menu-bar-item-focus': showWorkspace }"
        @click="showWorkspace = !showWorkspace">
        <div class="menu-bar-item-icon"><icon-workspace></icon-workspace></div>
        <span>工作台</span>
      </div>
    </el-tooltip> -->
    <!-- <el-tooltip :hide-after="0" content="丰富的社区模型" placement="right">
      <div class="menu-bar-item" :class="{ 'menu-bar-item-focus': showCustomModel }"
        @click="showCustomModel = !showCustomModel">
        <div class="menu-bar-item-icon">
          <icon-custom-model></icon-custom-model>
        </div>
        <span>选择模型</span>
      </div>
    </el-tooltip> -->
    <el-tooltip :hide-after="0" content="许多贴纸哦～" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showSticker }"
        @click="showSticker = !showSticker"
      >
        <div class="menu-bar-item-icon"><icon-sticker></icon-sticker></div>
        <span> 贴纸资源 </span>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="选择模型" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showBaseModelSelect }"
        @click="showBaseModelSelect = !showBaseModelSelect"
      >
        <desimage
          style="width: 30px; height: 30px"
          v-if="currentOperatingBaseModelInfo?.id"
          :src="currentOperatingBaseModelInfo.thumbnail?.url"
        ></desimage>
        <div v-else class="menu-bar-item-icon">
          <icon-shirt></icon-shirt>
        </div>
        <span> {{ currentOperatingBaseModelInfo?.id ? "切换模型" : "选择模型" }} </span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="服装材质" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': viewDisplayController.showMaterialControl }"
        @click="materialControlClick"
      >
        <div class="menu-bar-item-icon">
          <s1-icon name="material"></s1-icon>
        </div>
        <span>服装材质</span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="制作贴纸" placement="right">
      <div
        class="menu-bar-item"
        :class="{ 'menu-bar-item-focus': showCanvasLayout }"
        @click="showCanvasLayout = !showCanvasLayout"
      >
        <div class="menu-bar-item-icon">
          <icon-canvas></icon-canvas>
        </div>
        <span>制作贴纸</span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="服装装饰品" placement="right">
      <div class="menu-bar-item" @click="showDecoration = !showDecoration">
        <div class="menu-bar-item-icon">
          <icon-decoration></icon-decoration>
        </div>
        <span>饰品</span>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="字体" placement="right">
      <div class="menu-bar-item" @click="showFontModal = true">
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
      <div class="menu-bar-item" @click="showSceneControl = !showSceneControl">
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
  showFontModal,
  showDecoration,
  showSticker,
  showQrcode,
  showStamp,
  showCustomModel,
  showSvgCanvas,
  showCanvasLayout,
  currentOperatingBaseModelInfo,
  viewDisplayController,
  clearLeftLayout,
} from "../store";

import iconWorkspace from "@/icon/workspace.svg?component";
import iconSticker from "@/components/design/assets/icon/sticker.svg?component";
import iconShirt from "@/icon/shirt.svg?component";
import iconPhoto from "@/icon/photo.svg?component";
import iconText from "@/icon/text.svg?component";
import iconPaint from "@/icon/paint.svg?component";
import iconBox from "@/icon/box.svg?component";
import iconBrush from "@/icon/brush.svg?component";
import iconRuler from "@/icon/ruler.svg?component";
import iconEarth from "@/icon/earth.svg?component";
import iconLight from "@/icon/light.svg?component";
import iconEye from "@/icon/eye.svg?component";
import iconHelp from "@/icon/help.svg?component";
import iconQrcode from "@/components/design/assets/icon/qrcode.svg?component";
import iconBadge from "@/components/design/assets/icon/badge.svg?component";
import iconSetting from "@/icon/setting.svg?component";
import iconFont from "@/icon/font.svg?component";
import iconDecoration from "@/icon/design/decoration.svg?component";
import iconCustomModel from "@/components/design/assets/icon/custom-model.svg?component";
import iconSvgCanvas from "@/components/design/assets/icon/svg-canvas.svg?component";
import iconCanvas from "@/components/design/assets/icon/canvas.svg?component";
import iconProject from "@/components/design/assets/icon/project.svg?component";
import Utils from "@/common/utils";

import desimage from "@/components/image.vue";

function materialControlClick() {
  if (viewDisplayController.value.showMaterialControl) {
    viewDisplayController.value.showMaterialControl = false;
  } else {
    clearLeftLayout();
    viewDisplayController.value.showMaterialControl = true;
  }
}
</script>
<style lang="less">
.menu-bar {
  width: 72px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2px;
  row-gap: 4px;
  overflow: auto;
  // direction: rtl;
  background: var(--1s-left-menu-background-color);
  padding: 16px 0;
  box-sizing: border-box;
}

.menu-bar-item {
  width: 64px;
  height: 64px;
  display: flex;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  color: #222;

  .menu-bar-item-icon {
    flex-shrink: 0;
    padding: 6px;
    display: flex;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  span {
    font-size: 0.9rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 50px;
    font-weight: 900;
    color: #666;
    line-height: 16px;
  }

  &:hover {
    background: #eee;
  }
}

.menu-bar-item-focus {
  background: #eee;
}
</style>
