<template>
  <el-scrollbar>
    <div class="canvas-operate-form" style="margin: 1rem">
      <!-- 如果当前是 HTML 模板或者画布设置，显示顶部的二选一 Tab -->
      <div v-if="currentOperatingCanvasChild.type === 'html' || currentOperatingCanvasChild.type === 'canvas'" class="custom-segmented-control">
        <div 
          class="segmented-item" 
          :class="{ active: activeMainTab === 'html' }"
          @click="activeMainTab = 'html'"
        >
          主 HTML 模板
        </div>
        <div 
          class="segmented-item" 
          :class="{ active: activeMainTab === 'canvas' }"
          @click="activeMainTab = 'canvas'"
        >
          画布设置
        </div>
      </div>

      <!-- 如果当前选中的是子组件，显示快捷返回按钮 -->
      <div v-if="currentOperatingCanvasChild.type !== 'html' && currentOperatingCanvasChild.type !== 'canvas'" class="sidebar-back-header">
        <el-button size="small" type="info" plain style="width: 100%;" @click="selectMasterHtml">
          ← 返回编辑主 HTML 模板
        </el-button>
        <div style="font-size: 11px; color: #8a8f98; margin-top: 6px; text-align: center;">
          当前正在编辑：{{ currentOperatingCanvasChild.type.toUpperCase() }} ({{ currentOperatingCanvasChild.id.slice(-4) }})
        </div>
      </div>

      <component :is="CanvasChildOperationComponentMap[currentOperatingCanvasChild.type]"></component>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import { currentOperatingCanvasChildId } from "../index.tsx";

const activeMainTab = computed({
  get() {
    return currentOperatingCanvasChild.value.type === 'canvas' ? 'canvas' : 'html';
  },
  set(val) {
    if (val === 'canvas') {
      currentOperatingCanvasChildId.value = "this_is_canvas_id";
    } else {
      currentOperatingCanvasChildId.value = "this_is_html_id";
    }
  }
});

function selectMasterHtml() {
  currentOperatingCanvasChildId.value = "this_is_html_id";
}

import operateItemColor from "@/components/design/layout/canvas/operate/color/index.vue";
import operateItemTextContent from "@/components/design/layout/canvas/operate/textContent.vue";
import operateItemFontSize from "@/components/design/layout/canvas/operate/fontSize.vue";
import operateItemFontWeight from "@/components/design/layout/canvas/operate/fontWeight.vue";
import operateItemFontItalic from "@/components/design/layout/canvas/operate/italic.vue";
import operateItemFontColor from "@/components/design/layout/canvas/operate/fontColor.vue";
import operateItemFontFamily from "@/components/design/layout/canvas/operate/fontFamily/fontFamily.vue";
import operateItemLineHeight from "@/components/design/layout/canvas/operate/lineHeight.vue";
import operateItemLetterSpacing from "@/components/design/layout/canvas/operate/letterSpacing.vue";
import operateItemWritingMode from "@/components/design/layout/canvas/operate/writingMode.vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemPosition from "@/components/design/layout/canvas/operate/position/position.vue";
import operateItemZindex from "@/components/design/layout/canvas/operate/zIndex.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemImageSelect from "@/components/design/layout/canvas/operate/imageSelect/index.vue";
import operateItemSwitch from "@/components/design/layout/canvas/operate/basicSwitch.vue";
import operateItemPadding from "@/components/design/layout/canvas/operate/padding.vue";
import operateItemBorderRadius from "@/components/design/layout/canvas/operate/borderRadius.vue";
import operateItemQrcodeErrorCorrectionLevel from "@/components/design/layout/canvas/operate/qrcodeErrorCorrectionLevel.vue";
import operateItemQrcodeType from "@/components/design/layout/canvas/operate/qrcodeType.vue";
import operateItemBorderWidth from "@/components/design/layout/canvas/operate/border/borderWidth.vue";
import operateItemRectBorderRadius from "@/components/design/layout/canvas/operate/border/rectBorderRadius.vue";
import operateItemAbsoluteUnitSelect from "@/components/design/layout/canvas/operate/absoluteUnitSelect.vue";
import operateItemTextShadow from "@/components/design/layout/canvas/operate/text-shadow/index.vue";
import operateItemRoundTextStartDeg from "@/components/design/layout/canvas/operate/text/roundTextStartDeg.vue";
import operateItemEllipseTextRadius from "@/components/design/layout/canvas/operate/text/ellipseTextRadius.vue";
import operateItemTextStroke from "@/components/design/layout/canvas/operate/text/textStroke.vue";
import operateItemFilterGroup from "@/components/design/layout/canvas/operate/filter/group.vue";
import operateItemObjectFit from "@/components/design/layout/canvas/operate/objectFit.vue";
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue';


import {
  updateCanvasStickerOptionsUnit
} from '../helper'

import {
  CanvasController,
  canvasStickerOptions,
  addCanvasChild,
  removeCavnasChild,
  currentCanvasControllerInstance,
  showMainCanvas,
  currentOperatingCanvasChild,
  CanvasChildType,
  updateRenderingCanvas,
  CanvasChildOperationComponentMap
} from "../index.tsx";








function remove(index) {
  removeCavnasChild(index);
}



</script>
<style lang="less">
.custom-segmented-control {
  display: flex;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 16px;
  user-select: none;
  cursor: pointer;
  border: 1px solid rgba(226, 232, 240, 0.8);

  .segmented-item {
    flex: 1;
    text-align: center;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    border-radius: 6px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      color: #0f172a;
    }

    &.active {
      background-color: #ffffff;
      color: #0f172a;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    }
  }
}

.sidebar-back-header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.el-input--small {
  input::-webkit-textfield-decoration-container {
    height: 16px;
  }
}

.el-alert__title {
  font-size: 1.2rem !important;
  line-height: 1.4rem !important;
}

.el-alert__description {
  font-size: 1rem !important;
  line-height: 1.2rem;
}

.operate-form-item,
.el-popover-operation {
  // --el-text-color-placeholder: #222;
  --el-border-radius-base: 6px;


  .el-input__wrapper,
  .el-select__wrapper,
  .el-textarea__inner {
    background-color: #f6f6f6;
    color: #000;

    &:hover {
      // box-shadow: #6900ffdd 0px 0px 0px 1px;
    }


  }

  .el-input,
  .el-select,
  .el-textarea {
    --el-border-color: rgba(0, 0, 0, 0) !important;
  }

}
</style>
<style scoped>
.canvas-operate-form :deep(.operate-form-item-title),
.canvas-operate-form :deep(.operate-form-item-content),
.canvas-operate-form :deep(.el-button),
.canvas-operate-form :deep(.el-input__inner),
.canvas-operate-form :deep(.el-select__selected-item),
.canvas-operate-form :deep(.el-radio__label),
.canvas-operate-form :deep(.el-checkbox__label),
.canvas-operate-form :deep(.el-switch__label),
.canvas-operate-form :deep(.el-form-item__label) {
  font-size: 0.92rem;
}

.canvas-operate-form :deep(.el-button) {
  padding-inline: 8px;
}

.canvas-operate-form :deep(.el-input__wrapper),
.canvas-operate-form :deep(.el-select__wrapper) {
  min-height: 22px;
}

.canvas-operate-form :deep(.el-collapse-item__arrow) {
  font-size: 11px;
}

:deep(.el-scrollbar__bar.is-vertical) {
  width: 4px;
}

:deep(.el-collapse-item__header) {
  font-size: 0.92rem;
  margin-left: 0.35em;
}

@media (max-width: 1080px) {
  .canvas-operate-form :deep(.operate-form-item-title),
  .canvas-operate-form :deep(.operate-form-item-content),
  .canvas-operate-form :deep(.el-button),
  .canvas-operate-form :deep(.el-input__inner),
  .canvas-operate-form :deep(.el-select__selected-item),
  .canvas-operate-form :deep(.el-radio__label),
  .canvas-operate-form :deep(.el-checkbox__label),
  .canvas-operate-form :deep(.el-switch__label),
  .canvas-operate-form :deep(.el-form-item__label) {
    font-size: 0.88rem;
  }

  .canvas-operate-form :deep(.el-button) {
    padding-inline: 7px;
  }
}
</style>
