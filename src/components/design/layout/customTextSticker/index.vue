<template>
  <div class="designiy-custom-text-sticker">
    <div class="designiy-custom-text-sticker-title">
    创作文本贴纸 
    </div>

    <sticker-canvas></sticker-canvas>
    
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
import stickerCanvas from './canvas.vue'

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
