<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-canvas">
      <div id="text-sticker" ref="textStickerEl"  :class="{'text-vertical':textStickerVertical}" :style="{ color: textStickerColor, fontWeight: textStickerWeight,letterSpacing:textStickerLetterSpacing + 'px' }" style="font-size:50px;">{{ textStickerText }}
      </div>
    </div>
    <el-input placeholder="请输入文字贴纸内容" style="margin-top:10px;" v-model="textStickerText">
      <template #prepend>贴图文字</template>
    </el-input>
    <el-input type="number" step="100" max="900" min="0" placeholder="请输入文字贴纸厚度" style="margin-top:10px;"
      v-model="textStickerWeight">
      <template #prepend>字体厚度</template>
    </el-input>

    <el-input type="number" step="1"  placeholder="请输入文字间距" style="margin-top:10px;"
      v-model="textStickerLetterSpacing">
      <template #prepend>字体间距</template>
    </el-input>

    <el-select style="margin-top:10px" v-model="fontFile" placeholder="选择字体文件">
    <el-option
      v-for="(f,index) in fonts"
      :key="index"
      :label="f.name"
      :value="f.file"
    >
    </el-option>
  </el-select>

  <el-switch
    style="margin-top:10px;"
    v-model="textStickerVertical"
    active-text="垂直排列"
    inactive-text="水平排列"
  />

    <div style="margin-top:10px">
      文字颜色:
      <el-color-picker show-alpha size="small" v-model="textStickerColor" color-format="rgb" />
    </div>

    <el-button style="margin-top:10px;" type="primary" size="default"><span
        style="font-weight: bold">添加文字贴纸</span></el-button>
        {{ font }}
  </div>
  
</template>
<script setup>
import { onMounted, ref, computed, watch, reactive } from 'vue';
import { showBaseModelSelectDialog, currentModelInfo, canvasBgColor, canvasBgOpacity, textStickerText, textStickerColor, textStickerWeight } from '../../store.ts'
import { getFonts, getTextStickerUrl } from '@/api/index';
import { useDebounceFn } from '@vueuse/core'

const textStickerEl = ref()

// 所有可用字体信息
const fonts = ref()

// 当前字体文件路径
const fontFile = ref()

// 文字是否垂直排列
const textStickerVertical = ref(false)

const textStickerLetterSpacing = ref(5)


var id  = 0
watch(fontFile, (url) => {
  let fontId = id++
  const fontStyles = document.createElement('style');
  fontStyles.innerHTML = `
    @font-face {
        font-family: font${fontId};
        src: url(${url}); /* 替换为实际的字体文件相对路径 */
    }
  `;
  document.head.appendChild(fontStyles);
  textStickerEl.value.style.fontFamily = ` font${fontId++}`
})

onMounted(async () => {
  fonts.value = await getFonts()
})

</script>
<style lang="less">
.designiy-text-sticker {
  display: flex;
  flex-direction: column;
  width: auto;
  padding: 10px;
}

.designiy-text-sticker-canvas {
  min-width: 280px;
  min-height: 200px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0),
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0);
  background-position: -15px 5px, 15px 15px, 10px 10px, 20px 20px;
  background-size: 20px 20px;
  overflow: auto;
}

#text-sticker {
  max-width: 100%;
  font-size: 30px;
}

#textStickerImg {
  max-height: 100%;
  max-width: 100%;
  margin: auto;
}

.text-vertical{
    writing-mode: vertical-rl;
    text-orientation: upright;
}
</style>
  