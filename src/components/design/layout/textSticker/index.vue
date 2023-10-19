<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-title">贴纸预览</div>
    <div class="designiy-text-sticker-canvas">
      <div id="text-sticker" ref="textStickerEl" :class="{ 'text-vertical': textStickerVertical }"
        :style="{ 
        color: textStickerColor, 
        fontWeight: textStickerWeight, 
        letterSpacing: textStickerLetterSpacing + 'px' ,
        fontSize: textStickerFontSize +'px',
        lineHeight: textStickerLineHeight +'em',
        writingMode: textStickerVertical ?   'vertical-rl' : '',
        textOrientation: textStickerVertical ?  'upright' : '',
        fontStyle: textStickerIsItalic ? 'italic' : 'normal'
        }"
        style="white-space: pre;">
        {{ textStickerText }}
      </div>
    </div>

    <div class="designiy-text-sticker-title">贴纸内容</div>
    <textarea class="designiy-text-sticker-textarea" placeholder="输入贴纸内容..." v-model="textStickerText" />

    <hr class="designiy-text-sticker-divider">
   
    <div class="designiy-text-sticker-title">文字属性</div>


      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">文字厚度 </div>
          <input class="designiy-text-sticker-form-item-input" type="number" step="100" max="900" min="0" v-model="textStickerWeight">
      </div>


      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">文字间距 </div>
          <input class="designiy-text-sticker-form-item-input" type="number" step="1" v-model="textStickerLetterSpacing">
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">字号</div>
          <input class="designiy-text-sticker-form-item-input" type="number" step="1" max="100" min="0" v-model="textStickerFontSize">
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">行高 </div>
        <input  class="designiy-text-sticker-form-item-input" type="number" step="0.1" max="100" min="0" v-model="textStickerLineHeight">
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">纵向排列 </div>
          <div class="designiy-text-sticker-form-item-textbtn" @click="textStickerVertical = !textStickerVertical">
            {{ textStickerVertical ? '是' : '否' }}
          </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">使用斜体 </div>
          <div class="designiy-text-sticker-form-item-textbtn" @click="textStickerIsItalic = !textStickerIsItalic">
            {{ textStickerIsItalic ? '是' : '否' }}
          </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">文字字体</div>
        <div>
          
        </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">颜色</div>
        <div>
          
        </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">文字对齐方式</div>
          <div class="designiy-text-sticker-form-item-textbtn">
            
          </div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">文字阴影</div>
      </div>

      <div class="designiy-text-sticker-form-item">
        <div class="designiy-text-sticker-form-item-label">文字装饰</div>
      </div>

    <hr class="designiy-text-sticker-divider">

    <div class="designiy-text-sticker-title">背景属性</div> 
    
    <hr class="designiy-text-sticker-divider">




    <!-- <el-select style="margin-top:10px" v-model="fontFile" placeholder="选择字体文件">
      <el-option v-for="(f, index) in fonts" :key="index" :label="f.name" :value="f.file">
      </el-option>
    </el-select>

    <el-switch style="margin-top:10px;" v-model="textStickerVertical" active-text="垂直排列" inactive-text="水平排列" />

    <div style="margin-top:10px">
      文字颜色:
      <el-color-picker show-alpha size="small" v-model="textStickerColor" color-format="rgb" />
    </div> -->

    <div style="flex:1"></div>


  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch, reactive } from 'vue';
import { showBaseModelSelectDialog, currentModelInfo, canvasBgColor, canvasBgOpacity, textStickerText, textStickerColor, textStickerWeight,textStickerFontSize, textStickerLineHeight } from '../../store.ts'
import { getFonts, getTextStickerUrl } from '@/api/index';
import { useDebounceFn } from '@vueuse/core'
import { More } from '@element-plus/icons-vue';
import { textStickerIsItalic } from '../../store';

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
  padding: 0px 15px;
  width: 240px;
  height: 100%;
}

.designiy-text-sticker-canvas {
  width: 100%;
  height: 160px;
  min-height: 160px;
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
  cursor: pointer;
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

.designiy-text-sticker-textarea{
    outline: none;
    width: 100%;
    background-color: transparent !important;
    color: #fff !important;
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
  padding: 3px 0;
  &:focus-within{
       outline: 1px solid var(--el-color-primary);
    }
}

.designiy-text-sticker-form-item-input{
    height: 24px;
    width: 60px;
    color: #fff;
    font-size: 12px;
    text-align: right;
    background-color: transparent;
    border:none;
    outline:none;
    position: relative;
    display: inline-block;
    padding-right: 5px;
    &::-webkit-inner-spin-button{
      position: absolute;
      margin-left: 10px;
      width: 20px;
      height: 16px!important;
      left: 0%;
    }
}

.designiy-text-sticker-form-item-textbtn{
  color: #fff;
  font-size: 12px;
  padding-left: 5px;
  cursor: pointer;
  text-align: right;
  padding-right: 5px;
  &:hover{
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

.designiy-text-sticker-title{
  color: #fff;
  margin: 15px 0 10px 0;
  font-size: 10px;
}

.designiy-text-sticker-divider{
  margin:5px 0; border:none;border-top: 1px solid rgba(255,255,255,.2);
}

</style>
  