<template>
  <el-scrollbar>
    <div style="margin: 1em 1em">
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.CANVAS">
        <el-row :gutter="24" align="middle">
          <el-col :span="24">
            <operateItemAbsoluteSize label="画布尺寸" v-model:width="canvasOptions.width" v-model:height="canvasOptions.height">
            </operateItemAbsoluteSize>
          </el-col>
          <el-col :span="24">
            <operateItemAbsoluteUnitSelect label="画布尺寸单位" v-model="canvasOptions.unit"></operateItemAbsoluteUnitSelect>
          </el-col>
          <el-col :span="24">
            <operateItemSwitch label="在主画布中显示" v-model="showMainCanvas"></operateItemSwitch>
          </el-col>
        </el-row>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.TEXT">
        <el-collapse v-model="textCollapseActives">
          <el-collapse-item name="1">
            <template #title>
              <div class="title">文字属性</div>
            </template>
            <el-row :gutter="24" align="middle">
              <el-col :span="24">
                <operateItemTextContent v-model="currentOperatingCanvasChild.textContent">
                </operateItemTextContent>
              </el-col>
              <el-col :span="24">
                <operateItemFontSize v-model="currentOperatingCanvasChild.fontSize">
                </operateItemFontSize>
              </el-col>

              <el-col :span="12">
                <operateItemFontItalic v-model="currentOperatingCanvasChild.italic"></operateItemFontItalic>
              </el-col>
              <el-col :span="12">
                <operateItemFontColor v-model="currentOperatingCanvasChild.fontColor">
                </operateItemFontColor>
              </el-col>
              <el-col :span="12">
                <operateItemLineHeight v-model="currentOperatingCanvasChild.lineHeight">
                </operateItemLineHeight>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <operateItemZindex v-model="currentOperatingCanvasChild.zIndex">
                </operateItemZindex>
              </el-col>
              <el-col :span="12">
                <operateItemFontWeight v-model="currentOperatingCanvasChild.fontWeight">
                </operateItemFontWeight>
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
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.IMAGE">
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
        </el-row>
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
          <el-col :span="12">
            <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor">
            </operateItemBackgroundColor>
          </el-col>
          <el-col :span="12">
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
              <el-col :span="12">
                <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor">
                </operateItemBackgroundColor>
              </el-col>
              <el-col :span="12">
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
      <template v-if="currentOperatingCanvasChild.type == CanvasChildType.ELLIIPSE">
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
import { Close } from "@element-plus/icons-vue";

// import operateFormItem from "@/components/design/components/operate/operateFormItem.vue";
import operateItemTextContent from "@/components/design/components/operate/textContent.vue";
import operateItemFontSize from "@/components/design/components/operate/fontSize.vue";
import operateItemFontWeight from "@/components/design/components/operate/fontWeight.vue";
import operateItemFontItalic from "@/components/design/components/operate/italic.vue";
import operateItemFontColor from "@/components/design/components/operate/fontColor.vue";
import operateItemFontFamily from "@/components/design/components/operate/fontFamily.vue";
import operateItemLineHeight from "@/components/design/components/operate/lineHeight.vue";
import operateItemLetterSpacing from "@/components/design/components/operate/letterSpacing.vue";
import operateItemWritingMode from "@/components/design/components/operate/writingMode.vue";
import operateItemSize from "@/components/design/components/operate/size/relativeSize.vue";
import operateItemAbsoluteSize from "@/components/design/components/operate/size/absoluteSize.vue";
// import operateItemAspectRatio from "@/components/design/components/operate/aspectRatio.vue";
import operateItemPosition from "@/components/design/components/operate/position.vue";
import operateItemScale from "@/components/design/components/operate/scale.vue";
import operateItemRotate from "@/components/design/components/operate/rotate.vue";
import operateItemSkew from "@/components/design/components/operate/skew.vue";
import operateItemZindex from "@/components/design/components/operate/zIndex.vue";
import operateItemBackgroundColor from "@/components/design/components/operate/backgroundColor.vue";
import operateItemImageSelect from "@/components/design/components/operate/imageSelect.vue";
import operateItemSwitch from "@/components/design/components/operate/basicSwitch.vue";
import operateItemPadding from "@/components/design/components/operate/padding.vue";
import operateItemBorderRadius from "@/components/design/components/operate/borderRadius.vue";
import operateItemColor from "@/components/design/components/operate/color/index.vue";
import operateItemQrcodeErrorCorrectionLevel from "@/components/design/components/operate/qrcodeErrorCorrectionLevel.vue";
import operateItemQrcodeType from "@/components/design/components/operate/qrcodeType.vue";
import operateItemBorderWidth from "@/components/design/components/operate/border/borderWidth.vue";
import operateItemRectBorderRadius from "@/components/design/components/operate/border/rectBorderRadius.vue";
import operateItemAbsoluteUnitSelect from "@/components/design/components/operate/absoluteUnitSelect.vue";



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

const textCollapseActives = ref(["1", "2", "3", "4"]);

const qrcodeCollapseActives = ref(["1", "2", "3", "4"]);

const visible = ref("");

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
