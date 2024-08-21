<template>
  <el-scrollbar>
    <div class="canvas-operate-form" style="margin: 1rem">
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.CANVAS">
        <el-collapse v-model="canvasCollapseActives">
          <el-collapse-item name="1" title="画布配置">
            <el-row align="middle">
              <el-col :span="24">
                <operateItemAbsoluteSize label="画布尺寸" v-model:width="canvasStickerOptions.width"
                  v-model:height="canvasStickerOptions.height">
                </operateItemAbsoluteSize>
              </el-col>
              <el-col :span="24">
                <operateItemAbsoluteUnitSelect @change="absoluteUnitChange" label="画布尺寸单位"
                  v-model="canvasStickerOptions.unit">
                </operateItemAbsoluteUnitSelect>
              </el-col>
              <el-col :span="24">
                <operateItemSwitch label="在主画布中显示" v-model="showMainCanvas"></operateItemSwitch>
              </el-col>
              <!-- <operateItemSwitch label="显示真实大小" v-model="canvasStickerOptions.showCanvasRealSize"></operateItemSwitch> -->
              <el-col :span="24">
                <operateItemColor label="辅助背景颜色" tooltip="用于辅助画布中的元素，不会对实际画布产生影响" type="pure"
                  v-model="canvasStickerOptions.supportBackgroundColor"></operateItemColor>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2" title="画布属性">
            <el-row>
              <el-col :span="24">
                <operateItemColor label="画布背景颜色" tooltip="画布背景颜色" v-model="currentOperatingCanvasChild.backgroundColor">
                </operateItemColor>
              </el-col>
              <el-col :span="24">
                <a-alert message="我们更希望你使用一个新的背景元素，而不是直接更改画布的背景颜色或其他效果，虽然最终实现的效果相同" banner closable />
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="4" title="画布滤镜效果">
            <operateItemFilterGroup v-model="currentOperatingCanvasChild.filter"></operateItemFilterGroup>
          </el-collapse-item>
        </el-collapse>

      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.TEXT">
        <el-collapse v-model="textCollapseActives">
          <el-collapse-item name="1" title="文字属性">
            <el-row align="middle">
              <el-col :span="24">
                <operateItemTextContent v-model="currentOperatingCanvasChild.textContent">
                </operateItemTextContent>
              </el-col>
              <el-col :span="24">
                <operateItemSwitch label="使用繁体字" v-model="currentOperatingCanvasChild.isTraditionalChinese">
                </operateItemSwitch>
              </el-col>
              <el-col :span="24">
                <operateItemFontSize v-model="currentOperatingCanvasChild.fontSize">
                </operateItemFontSize>
              </el-col>
              <el-col :span="24">
                <operateItemFontItalic v-model="currentOperatingCanvasChild.italic"></operateItemFontItalic>
              </el-col>
              <el-col :span="24">
                <operateItemFontColor v-model="currentOperatingCanvasChild.fontColor">
                </operateItemFontColor>
              </el-col>
              <el-col :span="24">
                <operateItemLineHeight v-model="currentOperatingCanvasChild.lineHeight">
                </operateItemLineHeight>
              </el-col>
              <el-col :span="24">
                <operateItemLetterSpacing v-model="currentOperatingCanvasChild.letterSpacing">
                </operateItemLetterSpacing>
              </el-col>
              <el-col :span="24">
                <operateItemFontFamily v-model="currentOperatingCanvasChild.fontFamilyInfo" @font-load="fontLoad">
                </operateItemFontFamily>
              </el-col>
              <el-col :span="24">
                <operateItemFontWeight v-model="currentOperatingCanvasChild.fontWeight">
                </operateItemFontWeight>
              </el-col>
              <el-col :span="24">
                <operateItemTextShadow v-model="currentOperatingCanvasChild.textShadow">
                </operateItemTextShadow>
              </el-col>
              <el-col :span="24">
                <operateItemWritingMode v-model="currentOperatingCanvasChild.writingMode">
                </operateItemWritingMode>
              </el-col>
              <el-col :span="24">
                <operateItemTextStroke v-model:width="currentOperatingCanvasChild.textStrokeWidth"
                  v-model:color="currentOperatingCanvasChild.textStrokeColor">
                </operateItemTextStroke>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item name="2" title="通用属性">

            <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
          </el-collapse-item>


          <el-collapse-item name="4">
            <template #title>
              <div class="title">环形文字</div>
            </template>
            <el-row :gutter="24" align="middle">
              <el-col :span="24">
                <operateItemSwitch label="使用圆形文字" v-model="currentOperatingCanvasChild.isRoundText"></operateItemSwitch>
              </el-col>
              <el-col :span="24">
                <operateItemEllipseTextRadius v-model:horizontal="currentOperatingCanvasChild.roundTextHorizontalRadius"
                  v-model:vertical="currentOperatingCanvasChild.roundTextVerticalRadius">
                </operateItemEllipseTextRadius>
              </el-col>
              <el-col :span="24">
                <operateItemRoundTextStartDeg v-model="currentOperatingCanvasChild.roundTextStartDeg">
                </operateItemRoundTextStartDeg>
              </el-col>
              <el-col :span="24">
                <operateItemSwitch label="是否使用逆时针排列" v-model="currentOperatingCanvasChild.isCounterclockwise">
                </operateItemSwitch>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template #title>
              <div class="title">滤镜效果</div>
            </template>
            <operateItemFilterGroup v-model="currentOperatingCanvasChild.filter"></operateItemFilterGroup>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.IMAGE">
        <el-collapse v-model="imageCollapseActives">
          <el-collapse-item name="1" title="基础属性">
            <template #title>
              <div class="title">基础属性</div>
            </template>
            <el-row :gutter="24" align="middle">
              <el-col :span="24">
                <operateItemImageSelect v-model="currentOperatingCanvasChild.imageInfo">
                </operateItemImageSelect>
              </el-col>
              <el-col :span="24">
                <operateItemSize label="背景尺寸" v-model:width="currentOperatingCanvasChild.width"
                  v-model:height="currentOperatingCanvasChild.height">
                </operateItemSize>
              </el-col>
              <el-col :span="24">
                <operateItemObjectFit v-model="currentOperatingCanvasChild.objectFit">
                </operateItemObjectFit>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item name="2" title="通用属性">
            <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
          </el-collapse-item>

          <el-collapse-item name="4">
            <template #title>
              <div class="title">滤镜效果</div>
            </template>
            <operateItemFilterGroup v-model="currentOperatingCanvasChild.filter"></operateItemFilterGroup>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.BACKGROUHND">
        <el-collapse v-model="backgroundCollapseActives">
          <el-collapse-item name="1" title="背景属性">
            <operateItemSize label="背景尺寸" v-model:width="currentOperatingCanvasChild.width"
              v-model:height="currentOperatingCanvasChild.height">
            </operateItemSize>
            <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor">
            </operateItemBackgroundColor>
          </el-collapse-item>
          <el-collapse-item name="2" title="通用属性">
            <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.QRCODE">
        <el-collapse v-model="qrcodeCollapseActives">
          <el-collapse-item name="1">
            <template #title>
              <div class="title">基本配置</div>
            </template>
            <el-row :gutter="24" align="middle">
              <el-col :span="24">
                <operateItemTextContent label="二维码内容" v-model="currentOperatingCanvasChild.qrcodeContent">
                </operateItemTextContent>
              </el-col>
              <el-col :span="24">
                <operateItemSize label="二维码尺寸" v-model:width="currentOperatingCanvasChild.width"
                  v-model:height="currentOperatingCanvasChild.height">
                </operateItemSize>
              </el-col>
              <el-col :span="24">
                <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor">
                </operateItemBackgroundColor>
              </el-col>
              <el-col :span="24">
                <operateItemColor label="二维码颜色" v-model="currentOperatingCanvasChild.qrCodeColor">
                </operateItemColor>
              </el-col>
              <el-col :span="24">
                <operateItemPadding v-model="currentOperatingCanvasChild.padding">
                </operateItemPadding>
              </el-col>
              <el-col :span="24">
                <operateItemPosition v-model="currentOperatingCanvasChild.position"></operateItemPosition>
              </el-col>
              <el-col :span="24">
                <operateItemBorderRadius v-model="currentOperatingCanvasChild.borderRadius">
                </operateItemBorderRadius>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <div class="title">二维码配置</div>
            </template>
            <el-row :gutter="24" align="middle">
              <el-col :span="24">
                <operateItemQrcodeErrorCorrectionLevel v-model="currentOperatingCanvasChild.errorCorrectionLevel">
                </operateItemQrcodeErrorCorrectionLevel>
              </el-col>
              <el-col :span="24">
                <operateItemQrcodeType v-model="currentOperatingCanvasChild.qrcodeDotType"></operateItemQrcodeType>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <div class="title">定位点样式</div>
            </template>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template #title>
              <div class="title">中心图片设置</div>
            </template>
          </el-collapse-item>
          <el-collapse-item name="common">
            <template #title>
              <div class="title">通用属性</div>
            </template>
            <el-col :span="24">
              <operateItemZindex v-model="currentOperatingCanvasChild.zIndex">
              </operateItemZindex>
            </el-col>
          </el-collapse-item>

        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.RECT">
        <el-row :gutter="24" align="middle">
          <el-col :span="24">
            <operateItemSize label="矩形尺寸" v-model:width="currentOperatingCanvasChild.width"
              v-model:height="currentOperatingCanvasChild.height">
            </operateItemSize>
          </el-col>
          <el-col :span="24">
            <operateItemColor label="背景颜色" v-model="currentOperatingCanvasChild.backgroundColor">
            </operateItemColor>
          </el-col>
          <el-col :span="24">
            <operateItemBorderWidth v-model="currentOperatingCanvasChild.borderWidth">
            </operateItemBorderWidth>
          </el-col>
          <el-col :span="24">
            <operateItemColor label="边框颜色" v-model="currentOperatingCanvasChild.borderColor">
            </operateItemColor>
          </el-col>
          <el-col :span="24">
            <operateItemRectBorderRadius v-model="currentOperatingCanvasChild.borderRadius">
            </operateItemRectBorderRadius>
          </el-col>
        </el-row>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.ELLIPSE">
        <el-row :gutter="24" align="middle">
          <el-col :span="24">
            <operateItemSize tooltip="只需设置整体的宽高，半径自动有宽高和边框算出" label="圆形尺寸"
              v-model:width="currentOperatingCanvasChild.width" v-model:height="currentOperatingCanvasChild.height">
            </operateItemSize>
          </el-col>
          <el-col :span="24">
            <operateItemPosition v-model="currentOperatingCanvasChild.position"></operateItemPosition>
          </el-col>
          <el-col :span="24">
            <operateItemColor label="背景颜色" v-model="currentOperatingCanvasChild.backgroundColor">
            </operateItemColor>
          </el-col>
          <el-col :span="24">
            <operateItemBorderWidth v-model="currentOperatingCanvasChild.borderWidth">
            </operateItemBorderWidth>
          </el-col>
          <el-col :span="24">
            <operateItemColor label="边框颜色" v-model="currentOperatingCanvasChild.borderColor">
            </operateItemColor>
          </el-col>
        </el-row>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.ROW_CANVAS">
        <el-collapse v-model="rawCanvasCollapseActives">
          <el-collapse-item name="1" title="基础属性">
            <operateItemSize label="尺寸" v-model:width="currentOperatingCanvasChild.width"
              v-model:height="currentOperatingCanvasChild.height">
            </operateItemSize>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <div class="title">通用属性</div>
            </template>
            <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
          </el-collapse-item>
        </el-collapse>

      </template>
    </div>
  </el-scrollbar>
</template>


<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";

// import operateFormItem from "@/components/design/layout/canvas/operate/operateFormItem.vue";
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
import operateItemAbsoluteSize from "@/components/design/layout/canvas/operate/size/absoluteSize.vue";
// import operateItemAspectRatio from "@/components/design/layout/canvas/operate/aspectRatio.vue";
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
// import operateItemRoundTextRadius from "@/components/design/layout/canvas/operate/text/roundTextRadius.vue";
import operateItemRoundTextStartDeg from "@/components/design/layout/canvas/operate/text/roundTextStartDeg.vue";
import operateItemEllipseTextRadius from "@/components/design/layout/canvas/operate/text/ellipseTextRadius.vue";
// import operateItemRoundTextDirection from "@/components/design/layout/canvas/operate/text/roundTextDirection.vue";
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
  currentOperatingCanvasChildIndex,
  currentCanvasControllerInstance,
  showMainCanvas,
  currentOperatingCanvasChild,
  CanvasChildType,
} from "../index.tsx";



function absoluteUnitChange(unit) {
  updateCanvasStickerOptionsUnit(unit)
}

const canvasCollapseActives = ref(["1", "2", "3", "4", '5'])
const textCollapseActives = ref(["1", "2", "3", "4", '5']);
const qrcodeCollapseActives = ref(["1", "2", "3", "4", '5']);
const imageCollapseActives = ref(["1", "2", "3", "4", '5']);
const rawCanvasCollapseActives = ref(["1", "2", "3", "4", '5']);

const backgroundCollapseActives = ref(["1", "2", "3", "4", '5'])

function remove(index) {
  removeCavnasChild(index);
}

function fontLoad() {
  if(currentCanvasControllerInstance.value){
    currentCanvasControllerInstance.value.updateRenderingCanvas();
  }
}


</script>
<style lang="less">
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
:deep(.el-scrollbar__bar.is-vertical) {
  width: 4px;
}



:deep(.el-collapse-item__header) {
  font-size: 1rem;
  margin-left: 0.5em;
}
</style>
