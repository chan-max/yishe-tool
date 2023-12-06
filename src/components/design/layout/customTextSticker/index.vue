<template>
  <div class="designiy-custom-text-sticker">
    <div class="designiy-custom-text-sticker-title">
    创作文本贴纸 
    </div>

    <sticker-canvas></sticker-canvas>

    <tab v-model="activeTab" :items="['基础属性','背景属性','其他特效']"></tab>

    <div class="designiy-custom-text-sticker-content">
      
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
import tab from '../../components/tab.vue'


const activeTab = ref('基础属性')

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


.designiy-custom-text-sticker-content{
  height: 100%;
  width: 100%;
}
</style>
