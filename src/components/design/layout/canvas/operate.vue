<template>
  <el-scrollbar>
    <div style="margin: 1rem">
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.CANVAS">
        <el-collapse v-model="canvasCollapseActives">
          <el-collapse-item name="1">
            <template #title>
              <div class="title">画布配置</div>
            </template>
            <el-row align="middle">
              <el-col :span="24">
                <operateItemAbsoluteSize label="画布尺寸" v-model:width="canvasOptions.width"
                  v-model:height="canvasOptions.height">
                </operateItemAbsoluteSize>
              </el-col>
              <el-col :span="24">
                <operateItemAbsoluteUnitSelect @change="absoluteUnitChange" label="画布尺寸单位" v-model="canvasOptions.unit">
                </operateItemAbsoluteUnitSelect>
              </el-col>
              <el-col :span="24">
                <operateItemSwitch label="在主画布中显示" v-model="showMainCanvas"></operateItemSwitch>
              </el-col>
              <el-col :span="24">
                <operateItemSwitch label="显示真实大小" v-model="canvasOptions.showCanvasRealSize"></operateItemSwitch>
              </el-col>
              <el-col :span="24">
                <operateItemColor label="辅助背景颜色" tooltip="用于辅助画布中的元素，不会对实际画布产生影响" type="pure"
                  v-model="canvasOptions.supportBackgroundColor"></operateItemColor>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <div class="title">画布属性</div>
            </template>
            <el-row>
              <el-col :span="24">
                <operateItemColor label="画布背景颜色" tooltip="画布背景颜色" 
                  v-model="currentOperatingCanvasChild.backgroundColor"></operateItemColor>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template #title>
              <div class="title">滤镜效果</div>
            </template>
            <el-col :span="24">
              <operateItemFilterBlur v-model="currentOperatingCanvasChild.filterBlur">
              </operateItemFilterBlur>
            </el-col>
            <el-col :span="24">
              <operateItemFilterBrightness v-model="currentOperatingCanvasChild.filterBrightness">
              </operateItemFilterBrightness>
            </el-col>
            <el-col :span="24">
              <operateItemFilterContrast v-model="currentOperatingCanvasChild.filterContrast">
              </operateItemFilterContrast>
            </el-col>
            <el-col :span="24">
              <operateItemFilterGrayscale v-model="currentOperatingCanvasChild.filterGrayscale">
              </operateItemFilterGrayscale>
            </el-col>
            <el-col :span="24">
              <operateItemFilterInvert v-model="currentOperatingCanvasChild.filterInvert">
              </operateItemFilterInvert>
            </el-col>
            <el-col :span="24">
              <operateItemFilterOpacity v-model="currentOperatingCanvasChild.filterOpacity">
              </operateItemFilterOpacity>
            </el-col>
            <el-col :span="24">
              <operateItemFilterSaturate v-model="currentOperatingCanvasChild.filterSaturate">
              </operateItemFilterSaturate>
            </el-col>
            <el-col :span="24">
              <operateItemFilterSepia v-model="currentOperatingCanvasChild.filterSepia">
              </operateItemFilterSepia>
            </el-col>
            <el-col :span="24">
              <operateItemFilterHueRotate v-model="currentOperatingCanvasChild.filterHueRotate">
              </operateItemFilterHueRotate>
            </el-col>
          </el-collapse-item>
        </el-collapse>

      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.TEXT">
        <el-collapse v-model="textCollapseActives">
          <el-collapse-item name="1">
            <template #title>
              <div class="title">文字属性</div>
            </template>
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
                <operateItemPosition v-model="currentOperatingCanvasChild.position"></operateItemPosition>
              </el-col>
              <el-col :span="24">
                <operateItemZindex v-model="currentOperatingCanvasChild.zIndex">
                </operateItemZindex>
              </el-col>
              <el-col :span="24">
                <operateItemFontWeight v-model="currentOperatingCanvasChild.fontWeight">
                </operateItemFontWeight>
              </el-col>
              <el-col :span="24">
                <operateItemTextShadow v-model="currentOperatingCanvasChild.textShadow">
                </operateItemTextShadow>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <div class="title">高级属性</div>
            </template>
            <el-row :gutter="24" align="middle">
              <el-col :span="24">
                <operateItemWritingMode v-model="currentOperatingCanvasChild.writingMode">
                </operateItemWritingMode>
              </el-col>
              <el-col :span="24">
                <operateItemScale v-model:x="currentOperatingCanvasChild.scaleX"
                  v-model:y="currentOperatingCanvasChild.scaleY" v-model:z="currentOperatingCanvasChild.scaleZ">
                </operateItemScale>
              </el-col>
              <el-col :span="24">
                <operateItemRotate v-model:x="currentOperatingCanvasChild.rotateX"
                  v-model:y="currentOperatingCanvasChild.rotateY" v-model:z="currentOperatingCanvasChild.rotateZ">
                </operateItemRotate>
              </el-col>
              <el-col :span="24">
                <operateItemSkew v-model:x="currentOperatingCanvasChild.skewX"
                  v-model:y="currentOperatingCanvasChild.skewY">
                </operateItemSkew>
              </el-col>
              <el-col :span="24">
                <operateItemTextStroke v-model:width="currentOperatingCanvasChild.textStrokeWidth"
                  v-model:color="currentOperatingCanvasChild.textStrokeColor">
                </operateItemTextStroke>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item name="3">
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
          <el-collapse-item name="4">
            <template #title>
              <div class="title">滤镜效果</div>
            </template>
            <el-col :span="24">
              <operateItemFilterBlur v-model="currentOperatingCanvasChild.filterBlur">
              </operateItemFilterBlur>
            </el-col>
            <el-col :span="24">
              <operateItemFilterBrightness v-model="currentOperatingCanvasChild.filterBrightness">
              </operateItemFilterBrightness>
            </el-col>
            <el-col :span="24">
              <operateItemFilterContrast v-model="currentOperatingCanvasChild.filterContrast">
              </operateItemFilterContrast>
            </el-col>
            <el-col :span="24">
              <operateItemFilterGrayscale v-model="currentOperatingCanvasChild.filterGrayscale">
              </operateItemFilterGrayscale>
            </el-col>
            <el-col :span="24">
              <operateItemFilterInvert v-model="currentOperatingCanvasChild.filterInvert">
              </operateItemFilterInvert>
            </el-col>
            <el-col :span="24">
              <operateItemFilterOpacity v-model="currentOperatingCanvasChild.filterOpacity">
              </operateItemFilterOpacity>
            </el-col>
            <el-col :span="24">
              <operateItemFilterSaturate v-model="currentOperatingCanvasChild.filterSaturate">
              </operateItemFilterSaturate>
            </el-col>
            <el-col :span="24">
              <operateItemFilterSepia v-model="currentOperatingCanvasChild.filterSepia">
              </operateItemFilterSepia>
            </el-col>
            <el-col :span="24">
              <operateItemFilterHueRotate v-model="currentOperatingCanvasChild.filterHueRotate">
              </operateItemFilterHueRotate>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.IMAGE">
        <el-collapse v-model="imageCollapseActives">
          <el-collapse-item name="1">
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
              <el-col :span="24">
                <operateItemZindex v-model="currentOperatingCanvasChild.zIndex">
                </operateItemZindex>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item name="4">
            <template #title>
              <div class="title">滤镜效果</div>
            </template>
            <el-col :span="24">
              <operateItemFilterBlur v-model="currentOperatingCanvasChild.filterBlur">
              </operateItemFilterBlur>
            </el-col>
            <el-col :span="24">
              <operateItemFilterBrightness v-model="currentOperatingCanvasChild.filterBrightness">
              </operateItemFilterBrightness>
            </el-col>
            <el-col :span="24">
              <operateItemFilterContrast v-model="currentOperatingCanvasChild.filterContrast">
              </operateItemFilterContrast>
            </el-col>
            <el-col :span="24">
              <operateItemFilterGrayscale v-model="currentOperatingCanvasChild.filterGrayscale">
              </operateItemFilterGrayscale>
            </el-col>
            <el-col :span="24">
              <operateItemFilterInvert v-model="currentOperatingCanvasChild.filterInvert">
              </operateItemFilterInvert>
            </el-col>
            <el-col :span="24">
              <operateItemFilterOpacity v-model="currentOperatingCanvasChild.filterOpacity">
              </operateItemFilterOpacity>
            </el-col>
            <el-col :span="24">
              <operateItemFilterSaturate v-model="currentOperatingCanvasChild.filterSaturate">
              </operateItemFilterSaturate>
            </el-col>
            <el-col :span="24">
              <operateItemFilterSepia v-model="currentOperatingCanvasChild.filterSepia">
              </operateItemFilterSepia>
            </el-col>
            <el-col :span="24">
              <operateItemFilterHueRotate v-model="currentOperatingCanvasChild.filterHueRotate">
              </operateItemFilterHueRotate>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.BACKGROUHND">
        <el-row :gutter="24" align="middle">
          <el-col :span="24">
            <operateItemSize label="背景尺寸" v-model:width="currentOperatingCanvasChild.width"
              v-model:height="currentOperatingCanvasChild.height">
            </operateItemSize>
          </el-col>
          <el-col :span="24">
            <operateItemPosition v-model="currentOperatingCanvasChild.position"></operateItemPosition>
          </el-col>
          <el-col :span="24">
            <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor">
            </operateItemBackgroundColor>
          </el-col>
          <el-col :span="24">
            <operateItemZindex v-model="currentOperatingCanvasChild.zIndex">
            </operateItemZindex>
          </el-col>
        </el-row>
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
import operateItemFontFamily from "@/components/design/layout/canvas/operate/fontFamily.vue";
import operateItemLineHeight from "@/components/design/layout/canvas/operate/lineHeight.vue";
import operateItemLetterSpacing from "@/components/design/layout/canvas/operate/letterSpacing.vue";
import operateItemWritingMode from "@/components/design/layout/canvas/operate/writingMode.vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemAbsoluteSize from "@/components/design/layout/canvas/operate/size/absoluteSize.vue";
// import operateItemAspectRatio from "@/components/design/layout/canvas/operate/aspectRatio.vue";
import operateItemPosition from "@/components/design/layout/canvas/operate/position.vue";
import operateItemScale from "@/components/design/layout/canvas/operate/scale.vue";
import operateItemRotate from "@/components/design/layout/canvas/operate/rotate.vue";
import operateItemSkew from "@/components/design/layout/canvas/operate/skew.vue";
import operateItemZindex from "@/components/design/layout/canvas/operate/zIndex.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemImageSelect from "@/components/design/layout/canvas/operate/imageSelect.vue";
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

// 滤镜相关
import operateItemFilterBlur from "@/components/design/layout/canvas/operate/filter/blur.vue";
import operateItemFilterBrightness from "@/components/design/layout/canvas/operate/filter/brightness.vue";
import operateItemFilterContrast from "@/components/design/layout/canvas/operate/filter/contrast.vue";
import operateItemFilterGrayscale from "@/components/design/layout/canvas/operate/filter/grayscale.vue";
import operateItemFilterInvert from "@/components/design/layout/canvas/operate/filter/invert.vue";
import operateItemFilterOpacity from "@/components/design/layout/canvas/operate/filter/opacity.vue";
import operateItemFilterSaturate from "@/components/design/layout/canvas/operate/filter/saturate.vue";
import operateItemFilterSepia from "@/components/design/layout/canvas/operate/filter/sepia.vue";
import operateItemFilterHueRotate from "@/components/design/layout/canvas/operate/filter/hueRotate.vue";

import operateItemObjectFit from "@/components/design/layout/canvas/operate/objectFit.vue";



import {
  updateCanvasOptionsUnit
} from './helper'

import {
  CanvasController,
  canvasOptions,
  addCanvasChild,
  removeCavnasChild,
  currentOperatingCanvasChildIndex,
  currentCanvasControllerInstance,
  showMainCanvas,
  currentOperatingCanvasChild,
  CanvasChildType,
} from "./index.tsx";

function absoluteUnitChange(unit) {
  updateCanvasOptionsUnit(unit)
}

const canvasCollapseActives = ref(["1", "2", "3", "4"])

const textCollapseActives = ref(["1", "2", "3", "4"]);

const qrcodeCollapseActives = ref(["1", "2", "3", "4"]);

const imageCollapseActives = ref(["1", "2", "3", "4"]);


function remove(index) {
  removeCavnasChild(index);
}

function fontLoad() {
  currentCanvasControllerInstance.value.updateCanvas();
}
</script>

<style scoped>
:deep(.el-scrollbar__bar.is-vertical) {
  width: 4px;
}

.title {
  font-size: 1rem;
  margin-left: 0.5em;
}
</style>
