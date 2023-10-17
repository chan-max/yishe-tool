<template>
  <div class="designiy-text-sticker">

    <div class="designiy-text-sticker-canvas">
      <div id="text-sticker" ref="textStickerEl" :class="{ 'text-vertical': textStickerVertical }"
        :style="{ 
        color: textStickerColor, 
        fontWeight: textStickerWeight, 
        letterSpacing: textStickerLetterSpacing + 'px' ,
        fontSize: textStickerFontSize +'px',
        lineHeight: textStickerLineHeight +'em'
        }"
        style="white-space: pre;">{{ textStickerText }}
      </div>
    </div>


    <div class="designiy-text-sticker-form-item">
      <div class="designiy-text-sticker-form-item-title"> 内容  </div>
      <textarea placeholder="输入贴纸内容..." v-model="textStickerText" />
    </div>
    


      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-title">厚度 </div>
        <div class="designiy-text-sticker-form-item-inner">
          <input type="number" step="100" max="900" min="0" v-model="textStickerWeight">
        </div>
      </div>


      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-title">间距 </div>
        <div class="designiy-text-sticker-form-item-inner">
          <input type="number" step="1" v-model="textStickerLetterSpacing">
        </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-title">字号</div>
        <div class="designiy-text-sticker-form-item-inner">
          <input type="number" step="1" max="100" min="0" v-model="textStickerFontSize">
        </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-title">行高 </div>
        <div class="designiy-text-sticker-form-item-inner">
          <input type="number" step="0.1" max="100" min="0" v-model="textStickerLineHeight">
        </div>
      </div>


      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-title">字体</div> </div>
        <div class="designiy-text-sticker-form-item-inner">
          <input type="number" step="0.1" max="100" min="0" v-model="textStickerLineHeight">
        </div>
      </div>

    <el-select style="margin-top:10px" v-model="fontFile" placeholder="选择字体文件">
      <el-option v-for="(f, index) in fonts" :key="index" :label="f.name" :value="f.file">
      </el-option>
    </el-select>

    <el-switch style="margin-top:10px;" v-model="textStickerVertical" active-text="垂直排列" inactive-text="水平排列" />

    <div style="margin-top:10px">
      文字颜色:
      <el-color-picker show-alpha size="small" v-model="textStickerColor" color-format="rgb" />
    </div>

    <div style="flex:1"></div>

    <el-button style="margin-top:10px;" type="primary" size="default">
    <span style="font-weight: bold">上传该贴纸</span></el-button>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch, reactive } from 'vue';
import { showBaseModelSelectDialog, currentModelInfo, canvasBgColor, canvasBgOpacity, textStickerText, textStickerColor, textStickerWeight,textStickerFontSize, textStickerLineHeight } from '../../store.ts'
import { getFonts, getTextStickerUrl } from '@/api/index';
import { useDebounceFn } from '@vueuse/core'
import { More } from '@element-plus/icons-vue';

const textStickerEl = ref()

// 所有可用字体信息
const fonts = ref()

// 当前字体文件路径
const fontFile = ref()

// 文字是否垂直排列
const textStickerVertical = ref(false)

const textStickerLetterSpacing = ref(5)


var id = 0
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
  width: 260px;
  height: 100%;
}

.designiy-text-sticker-canvas {
  width: 240px;
  height: 200px;
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
  border-radius: 2px;
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

.text-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
}



.designiy-text-sticker-form-item {
  display: flex;
  padding:  15px 0;
  width: 100%;
  textarea {
    outline: none;
    width: 100%;
    background-color: transparent !important;
    color: #fff !important;
    font-size: 12px;
    padding: 10px;
  }
  input {
    width: 200px;
    height: 24px;
    color: #fff;
    font-size: 12px;
    background-color: #262626;
    border: 1px solid #909090;
    padding: 0px 5px;
  }
}


.designiy-text-sticker-form-item-title {
  color: #eee;
  font-size: 10px;
  font-weight: bold;
  padding: 5px 0;
  width: 40px;
  flex-shrink: 0;
}
</style>
  