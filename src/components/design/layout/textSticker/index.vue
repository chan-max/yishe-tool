<template>
  <div class="designiy-word-sticker">
    <div class="designiy-word-sticker-canvas">
      <img ref="textStickerImg" id="textStickerImg" :src="src">
    </div>
    <el-input placeholder="请输入文字贴纸内容" style="margin-top:10px;" v-model="textStickerText"></el-input>
    <el-button  style="margin-top:10px;" type="primary" size="default"><span style="font-weight: bold">添加文字贴纸</span></el-button>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { showBaseModelSelectDialog, currentModelInfo, canvasBgColor, canvasBgOpacity,textStickerText,textStickerColor } from '../../store.ts'
import { getTextStickerUrl } from '@/api/index';
import { useDebounceFn } from '@vueuse/core'

const textStickerImg = ref()

const src = computed(() => {
  return getTextStickerUrl({
    text:textStickerText.value,
    color:textStickerColor.value
  })
})




</script>
<style lang="less">
.designiy-word-sticker {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding:10px;
}

.designiy-word-sticker-canvas {
  width: 280px;
  height: 200px;
  background: #eee;
  display:flex;
  justify-content: center;
  align-items: center;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0),
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0);
    background-position: -15px 5px, 15px 15px, 10px 10px,20px 20px;
    background-size: 20px 20px;
}

#textStickerImg{
  max-height:100%;
  max-width:100%;
  margin:auto;
}
</style>
  