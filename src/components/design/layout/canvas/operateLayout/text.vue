<template>
  <el-collapse v-model="textCollapseActives">
    <el-collapse-item name="1" title="文字属性">
      <operateItemTextContent v-model="currentOperatingCanvasChild.textContent">
      </operateItemTextContent>

      <operateItemSwitch
        label="使用繁体字"
        v-model="currentOperatingCanvasChild.isTraditionalChinese"
      >
      </operateItemSwitch>

      <operateItemFontSize v-model="currentOperatingCanvasChild.fontSize">
      </operateItemFontSize>

      <operateItemFontItalic
        v-model="currentOperatingCanvasChild.italic"
      ></operateItemFontItalic>

      <operateItemFontColor v-model="currentOperatingCanvasChild.fontColor">
      </operateItemFontColor>

      <operateItemLineHeight v-model="currentOperatingCanvasChild.lineHeight">
      </operateItemLineHeight>

      <operateItemLetterSpacing
        v-model="currentOperatingCanvasChild.letterSpacing"
      >
      </operateItemLetterSpacing>

      <operateItemFontFamily
        v-model="currentOperatingCanvasChild.fontFamilyInfo"
        @font-load="fontLoad"
      >
      </operateItemFontFamily>

      <operateItemFontWeight v-model="currentOperatingCanvasChild.fontWeight">
      </operateItemFontWeight>

      <operateItemTextShadow v-model="currentOperatingCanvasChild.textShadow">
      </operateItemTextShadow>

      <operateItemWritingMode v-model="currentOperatingCanvasChild.writingMode">
      </operateItemWritingMode>

      <operateItemTextAlign v-model="currentOperatingCanvasChild.textAlign">
      </operateItemTextAlign>

      <operateItemTextStroke
        v-model:width="currentOperatingCanvasChild.textStrokeWidth"
        v-model:color="currentOperatingCanvasChild.textStrokeColor"
      >
      </operateItemTextStroke>
    </el-collapse-item>

    <el-collapse-item name="1.5" title="文字背景图">
      <operateItemImageSelect
        label="选择文字背景图"
        v-model="currentOperatingCanvasChild.imageInfo"
      >
      </operateItemImageSelect>
    </el-collapse-item>

    <el-collapse-item name="2" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>

    <el-collapse-item name="4">
      <template #title>
        <div class="title">环形文字</div>
      </template>

      <operateItemSwitch
        label="使用圆形文字"
        v-model="currentOperatingCanvasChild.isRoundText"
      >
      </operateItemSwitch>

      <operate-form-item>
        <template #name>环形文字</template>
        <template #content>
          <div class="round-text-ai">
            <el-popover
              v-model:visible="aiPopoverVisible"
              trigger="click"
              placement="right-start"
              width="340"
            >
              <div class="round-text-ai-popover">
                <el-input
                  v-model="aiPrompt"
                  type="textarea"
                  :rows="4"
                  resize="vertical"
                  spellcheck="false"
                  :disabled="aiLoading"
                  placeholder="描述想要的文字风格，例如：励志座右铭、咖啡品牌标语、新年祝福"
                  @keydown.enter.ctrl="generateRoundTextByAi"
                ></el-input>

                <div class="round-text-ai-popover__actions">
                  <el-button size="small" @click="aiPopoverVisible = false"
                    >取消</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    :loading="aiLoading"
                    :disabled="!aiPrompt.trim() || aiLoading"
                    @click="generateRoundTextByAi"
                  >
                    确定
                  </el-button>
                </div>

                <div v-if="aiError" class="round-text-ai-error">
                  {{ aiError }}
                </div>
              </div>

              <template #reference>
                <el-button size="small" type="primary" plain @click.stop
                  >AI 生成文字</el-button
                >
              </template>
            </el-popover>
          </div>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>半径</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.roundTextRadius.value"
            :min="50"
            :max="1000"
            size="small"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operateItemRoundTextStartDeg
        v-model="currentOperatingCanvasChild.roundTextStartDeg"
      >
      </operateItemRoundTextStartDeg>

      <operateItemSwitch
        label="逆时针排列"
        v-model="currentOperatingCanvasChild.isCounterclockwise"
      >
      </operateItemSwitch>
    </el-collapse-item>
    <el-collapse-item name="5">
      <template #title>
        <div class="title">滤镜效果</div>
      </template>
      <operateItemFilterGroup
        v-model="currentOperatingCanvasChild.filter"
      ></operateItemFilterGroup>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  computed,
  watch,
  reactive,
  watchEffect,
  nextTick,
} from "vue";

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
import operateItemTextAlign from "@/components/design/layout/canvas/operate/textAlign.vue";
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
import operateItemTextStroke from "@/components/design/layout/canvas/operate/text/textStroke.vue";
import operateItemFilterGroup from "@/components/design/layout/canvas/operate/filter/group.vue";
import operateItemObjectFit from "@/components/design/layout/canvas/operate/objectFit.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";

import { updateCanvasStickerOptionsUnit } from "../helper";

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
} from "../index.tsx";

import { generateRoundText } from "../children/text/aiRoundTextService";

const textCollapseActives = ref(["1", "1.5", "2", "3", "4", "5"]);

const aiPopoverVisible = ref(false);
const aiPrompt = ref("");
const aiLoading = ref(false);
const aiError = ref("");

function fontLoad() {
  updateRenderingCanvas();
}

async function generateRoundTextByAi() {
  const prompt = aiPrompt.value.trim();
  if (!prompt || aiLoading.value) return;

  aiLoading.value = true;
  aiError.value = "";

  try {
    const result = await generateRoundText(
      prompt,
      currentOperatingCanvasChild.value?.textContent || "",
    );
    currentOperatingCanvasChild.value.textContent = result.text;
    aiPrompt.value = "";
    aiPopoverVisible.value = false;
  } catch (error: any) {
    aiError.value = error?.message || "AI 生成失败，请重试";
  } finally {
    aiLoading.value = false;
  }
}
</script>

<style scoped>
.round-text-ai {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.round-text-ai-popover {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.round-text-ai-popover__actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

.round-text-ai-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}
</style>
