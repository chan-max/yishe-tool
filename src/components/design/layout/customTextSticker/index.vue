<template>
  <div class="designiy-text-sticker-custom">
    <div class="designiy-text-sticker-canvas">
      <div id="text-sticker" ref="textStickerEl">
        {{ operatingTextStickerText }}
      </div>
    </div>

    <div class="designiy-text-sticker-title">贴纸内容</div>
    <textarea
      class="designiy-text-sticker-textarea"
      placeholder="输入贴纸内容..."
      v-model="operatingTextStickerText"
    />

    <div class="designiy-text-sticker-title">文字属性</div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">字体</div>
      <div></div>
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">文字厚度</div>
      <input
        class="designiy-text-sticker-form-item-input"
        type="number"
        step="100"
        max="900"
        min="0"
        v-model="operatingTextStickerWeight"
      />
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">文字间距</div>
      <input
        class="designiy-text-sticker-form-item-input"
        type="number"
        step="1"
        v-model="operatingTextStickerLetterSpacing"
      />
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">字号</div>
      <input
        class="designiy-text-sticker-form-item-input"
        type="number"
        step="1"
        max="100"
        min="0"
        v-model="operatingTextStickerFontSize"
      />
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">行高</div>
      <input
        class="designiy-text-sticker-form-item-input"
        type="number"
        step="0.1"
        max="100"
        min="0"
        v-model="operatingTextStickerLineHeight"
      />
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">纵向排列</div>
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">使用斜体</div>
      <div
        class="designiy-text-sticker-form-item-textbtn"
        @click="operatingTextStickerIsItalic = !operatingTextStickerIsItalic"
      >
        {{ operatingTextStickerIsItalic ? "是" : "否" }}
      </div>
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">颜色</div>
      <input class="designiy-text-sticker-color" type="color" />
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">文字对齐方式</div>
      <div class="designiy-text-sticker-form-item-textbtn"></div>
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">文字阴影</div>
    </div>

    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-label">文字装饰</div>
    </div>
    <div style="flex: 1"></div>

    <div>
      <el-button type="primary" style="width: 100%" @click="save"> 保存该贴纸 </el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import {
  showBaseModelSelectContainer,
  operatingTextStickerText,
  operatingTextStickerColor,
  operatingTextStickerWeight,
  operatingTextStickerFontSize,
  operatingTextStickerLineHeight,
  operatingTextStickerIsItalic,
  operatingTextStickerLetterSpacing,
  operatingTextStickerWritingMode,
  operatingTextStickerTextOrientation,
  currentController,
} from "../../store";
import { getFonts, uploadTextSticker } from "@/api/index";
import { useDebounceFn } from "@vueuse/core";
import { More } from "@element-plus/icons-vue";
import { toPng } from "html-to-image";
import { initDraggableElement } from "../../utils/draggable";
import { base64ToFile } from "@/common/transform/base64ToFile";
import { debounce } from "@/common/utils/debounce";

const base64 = ref("");

const textStickerEl = ref();

// 所有可用字体信息
const fonts = ref();

// 当前字体文件路径
const fontFile = ref();

watch(
  [
    operatingTextStickerText,
    operatingTextStickerColor,
    operatingTextStickerWeight,
    operatingTextStickerFontSize,
    operatingTextStickerLineHeight,
    operatingTextStickerIsItalic,
  ],
  async () => {
    await nextTick();
    initTextSticker();
  }
);

async function initTextSticker() {
  let el = textStickerEl.value;
  if (!el) {
    return;
  }

  el.style.color = operatingTextStickerColor.value;
  el.style.fontWeight = operatingTextStickerWeight.value;
  el.style.letterSpacing = operatingTextStickerLetterSpacing.value + "px";
  el.style.fontSize = operatingTextStickerFontSize.value + "px";
  el.style.lineHeight = operatingTextStickerLineHeight.value + "em";
  el.style.writingMode = operatingTextStickerWritingMode.value;
  el.style.textOrientation = operatingTextStickerTextOrientation.value;
  el.style.fontStyle = operatingTextStickerIsItalic.value ? "italic" : "normal";

  base64.value = await toPng(textStickerEl.value);
  // console.log(base64.value)
  // var win = window.open("", "_blank");
  // win.document.write('<img src="' + base64.value + '"/>');

  initDraggableElement(
    textStickerEl.value,
    (img) => {
      currentController.value.stickToMousePosition(img);
    },
    base64.value
  );
}

var id = 0;
watch(fontFile, (url) => {
  let fontId = id++;
  const fontStyles = document.createElement("style");
  fontStyles.innerHTML = `
        @font-face {
            font-family: font${fontId};
            src: url(${url}); /* 替换为实际的字体文件相对路径 */
        }
      `;
  document.head.appendChild(fontStyles);
  textStickerEl.value.style.fontFamily = ` font${fontId++}`;
});

onMounted(async () => {
  initTextSticker();
  fonts.value = await getFonts();
});

async function save() {
  await uploadTextSticker({
    img: base64ToFile(base64.value),
  });
}
</script>
<style lang="less">
.designiy-text-sticker-custom {
  padding: 10px;
  height: 100%;
  width:260px;
  display: flex;
  flex-direction: column;
}

.designiy-text-sticker-canvas {
  width: 100%;
  height: 160px;
  min-height: 160px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: auto;
  background-image: linear-gradient(
      45deg,
      #ccc 25%,
      transparent 0,
      transparent 75%,
      #ccc 0
    ),
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0);
  background-position: -15px 5px, 15px 15px, 10px 10px, 20px 20px;
  background-size: 20px 20px;
  overflow: auto;
  border-radius: 2px;
  cursor: pointer;
}

#text-sticker {
  white-space: pre;
}

.designiy-text-sticker-drager {
  width: 100%;
  height: 100%;
  position: absolute;
  // visibility: hidden;
}

#textStickerImg {
  max-height: 100%;
  max-width: 100%;
  margin: auto;
}

.text-vertical {
  writing-mode: vertical-rl;
}

.designiy-text-sticker-textarea {
  outline: none;
  width: 100%;
  background-color: transparent !important;
  color: var(--1s-text-sticker-input-color) !important;
  border: var(--1s-text-sticker-textarea-border);
  font-size: 12px;
  padding: 5px;
  height: 60px;
  min-height: 60px;
}

.designiy-text-sticker-form-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 3px;
  &:focus-within {
    outline: 1px solid var(--el-color-primary);
  }
}

.designiy-text-sticker-form-item-input {
  height: 24px;
  width: 60px;
  color: var(--1s-text-sticker-input-color);
  font-size: 12px;
  text-align: right;
  background-color: transparent;
  border: none;
  outline: none;
  position: relative;
  display: inline-block;
  padding-right: 5px;
}

.designiy-text-sticker-form-item-textbtn {
  color: var(--1s-text-sticker-input-color);
  font-size: 12px;
  padding-left: 5px;
  cursor: pointer;
  text-align: right;
  padding-right: 5px;
  &:hover {
    opacity: 0.9;
  }
}

.designiy-text-sticker-form-item-label {
  color: #999;
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
  height: 24px;
  line-height: 24px;
  text-align: left;
  padding-left: 5px;
}

.designiy-text-sticker-title {
  color: var(--1s-text-sticker-title-color);
  padding: 10px 0 5px 0;
  font-size: 12px;
}

.designiy-text-sticker-color {
  width: 12px;
  height: 12px;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: 0;
}
</style>
