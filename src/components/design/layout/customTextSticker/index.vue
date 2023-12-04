<template>
  <div class="designiy-custom-text-sticker">
    <div class="designiy-custom-text-sticker-title">
    创作文本贴纸 
    </div>

    <div class="designiy-custom-text-sticker-canvas">
      <div
        id="custom-text-sticker"
        ref="textStickerEl"
        contenteditable="true"
        @keydown="keydown"
      >
        {{ operatingTextStickerText }}
      </div>
    </div>

    基本属性，背景相关，文字特效

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">字体</div>
      <div></div>
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">文字厚度</div>
      <input
        class="designiy-custom-text-sticker-form-item-input"
        type="number"
        step="100"
        max="900"
        min="0"
        v-model="operatingTextStickerWeight"
      />
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">文字间距</div>
      <input
        class="designiy-custom-text-sticker-form-item-input"
        type="number"
        step="1"
        v-model="operatingTextStickerLetterSpacing"
      />
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">字号</div>
      <input
        class="designiy-custom-text-sticker-form-item-input"
        type="number"
        step="1"
        max="100"
        min="0"
        v-model="operatingTextStickerFontSize"
      />
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">行高</div>
      <input
        class="designiy-custom-text-sticker-form-item-input"
        type="number"
        step="0.1"
        max="100"
        min="0"
        v-model="operatingTextStickerLineHeight"
      />
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">纵向排列</div>
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">使用斜体</div>
      <div
        class="designiy-custom-text-sticker-form-item-textbtn"
        @click="operatingTextStickerIsItalic = !operatingTextStickerIsItalic"
      >
        {{ operatingTextStickerIsItalic ? "是" : "否" }}
      </div>
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">颜色</div>
      <input class="designiy-custom-text-sticker-color" type="color" />
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">文字对齐方式</div>
      <div class="designiy-custom-text-sticker-form-item-textbtn"></div>
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">文字阴影</div>
    </div>

    <div class="designiy-custom-text-sticker-form-item">
      <div class="designiy-custom-text-sticker-form-item-label">文字装饰</div>
    </div>
    <div>
      <el-button type="primary" @click=""> 上传字体 </el-button>
      <el-button type="primary" @click="save"> 保存该贴纸 </el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import {
  showBaseModelSelect,
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
  showDecalControl,
} from "../../store";
import { getFonts, uploadTextSticker } from "@/api/index";
import { useDebounceFn } from "@vueuse/core";
import { More } from "@element-plus/icons-vue";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { initDraggableElement } from "../../utils/draggable";
import { base64ToFile } from "@/common/transform/base64ToFile";
import iconPen from '@/icon/pen.svg?vueComponent'


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

const initTextSticker = useDebounceFn(async () => {
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

  initDraggableElement(
    textStickerEl.value,
    (img) => {
      currentController.value.stickToMousePosition({
        base64: base64.value,
        local: true,
        type: "text",
        img: img,
      });
      showDecalControl.value = true;
    },
    base64.value
  );
}, 10);

function keydown(e) {
  // 阻止tab切换焦点
  if (e.keyCode === 9) {
    e.preventDefault();
  }
  initTextSticker();
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
.designiy-custom-text-sticker {
  height: 100%;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.designiy-custom-text-sticker-title {
  width: 100%;
  padding:20px 10px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items:center;
  color: #333;
}

.designiy-custom-text-sticker-canvas {
  width: 300px;
  height: 300px;
  flex-shrink: 0;
  background: #fff;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 0,
      transparent 75%,
      #eee 0
    ),
    linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0);
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: auto;
  border-radius: 2px;
  cursor: pointer;
}

#custom-text-sticker {
  white-space: pre;
  padding: 20px;
  outline: none;
}

.designiy-custom-text-sticker-drager {
  width: 100%;
  height: 100%;
  position: absolute;
}

#textStickerImg {
  max-height: 100%;
  max-width: 100%;
  margin: auto;
}

.designiy-custom-text-sticker-textarea {
  outline: none;
  width: 100%;
  background-color: transparent !important;
  color: var(--1s-custom-text-sticker-input-color) !important;
  border: 1px solid #eee;
  font-size: 12px;
  padding: 5px;
  height: 60px;
  min-height: 60px;
}

.designiy-custom-text-sticker-form-item {
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

.designiy-custom-text-sticker-form-item-input {
  height: 24px;
  width: 60px;
  color: var(--1s-custom-text-sticker-input-color);
  font-size: 12px;
  text-align: right;
  background-color: transparent;
  border: none;
  outline: none;
  position: relative;
  display: inline-block;
  padding-right: 5px;
}

.designiy-custom-text-sticker-form-item-textbtn {
  color: var(--1s-custom-text-sticker-input-color);
  font-size: 12px;
  padding-left: 5px;
  cursor: pointer;
  text-align: right;
  padding-right: 5px;
  &:hover {
    opacity: 0.9;
  }
}

.designiy-custom-text-sticker-form-item-label {
  color: #999;
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
  height: 24px;
  line-height: 24px;
  text-align: left;
  padding-left: 5px;
}

.designiy-custom-text-sticker-color {
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
