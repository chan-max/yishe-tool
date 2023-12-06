<template>
  <div class="designiy-custom-text-sticker-canvas" v-click="click">
    <div id="canvas-container" ref="canvasContainerEl">
      <div id="canvas-text" ref="canvasTextEl" :contenteditable="editable" @keydown="keydown" @blur="blur">
        {{ operatingTextStickerText }}
      </div>
    </div>

    <div class="designiy-custom-text-sticker-canvas-menu"></div>
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
import { vClick } from "../../composition/vClick";

const canvasContainerEl = ref();
const canvasTextEl = ref();

const base64 = ref("");

// 当前编辑的元素

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
  let el = canvasContainerEl.value;
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

  base64.value = await toPng(canvasContainerEl.value);

  initDraggableElement(
    canvasContainerEl.value,
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

const editable = ref(false);

const blured = ref(false);
function blur() {
  editable.value = false;
  blured.value = true;
}

async function click() {
  if (blured.value) {
    blured.value = false;
    return;
  } else if (editable.value) {
    return;
  }

  editable.value = true;
  blured.value = false;
  await nextTick();
  canvasTextEl.value.focus();
  //设置光标到最后
  var range = window.getSelection();
  range.selectAllChildren(canvasTextEl.value);
  range.collapseToEnd();
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
  canvasContainerEl.value.style.fontFamily = ` font${fontId++}`;
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
  box-sizing: border-box;
  position: relative;
  border: 1px solid transparent;
  &:focus-within {
    border: 1px solid #6900ff;
  }
}

.designiy-custom-text-sticker-canvas-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px 10px;
  display: flex;
  svg {
    width: 20px;
    height: 20px;
  }
}

#canvas-container {
  position: relative;
}

#canvas-text {
  white-space: pre;
  outline: none;
  min-width: 1px; // 保证在没有内容时也能显示光标
  caret-color: #6900ff;
}
</style>
