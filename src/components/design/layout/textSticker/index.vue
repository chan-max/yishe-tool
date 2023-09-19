<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-canvas">
        <div id="text-sticker">{{ textStickerText }}</div>
    </div>
    <el-input placeholder="请输入文字贴纸内容" style="margin-top:10px;" v-model="textStickerText"></el-input>
    <el-button  style="margin-top:10px;" type="primary" size="default"><span style="font-weight: bold">添加文字贴纸</span></el-button>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { showBaseModelSelectDialog, currentModelInfo, canvasBgColor, canvasBgOpacity,textStickerText,textStickerColor } from '../../store.ts'
import { getFonts, getTextStickerUrl } from '@/api/index';
import { useDebounceFn } from '@vueuse/core'




onMounted(async () => {
  const fonts = await getFonts()
})

</script>
<style lang="less">
.designiy-text-sticker {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding:10px;
}

.designiy-text-sticker-canvas {
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
  overflow: auto;
}

#text-sticker{
  max-width:100%;
  font-size: 30px;
}

#textStickerImg{
  max-height:100%;
  max-width:100%;
  margin:auto;
}
</style>
  