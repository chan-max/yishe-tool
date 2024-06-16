<template>
  <div class="container flex flex-col items-center">
    <div class="svg-canvas png-background">
      <svg-canvas ref="svgCanvasRef" :width="operatingSvgWidth" :height="operatingSvgHeight"></svg-canvas>
    </div>
    <div class="header">
      <el-button-group link style="width: 100%; display: flex">
        <el-popover :width="240" trigger="click">
          <div class="tags">
            <el-tag @click="add" round> 文字类 </el-tag>
            <div style="flex:1;"></div>
          </div>
          <template #reference>
            <el-button style="flex: 1">
              添加元素 {{ svgCanvasChildren.length }}
            </el-button>
          </template>
        </el-popover>
        <el-button @click="exportToPng"> 导出 png </el-button>
      </el-button-group>
    </div>
    <div class="operate">
      <div class="w-full h-full flex items-center justify-center" v-if="!svgCanvasChildren.length"> 暂无元素 </div>
      <el-tabs v-else tab-position="top">
        <el-tab-pane v-for="item, index in svgCanvasChildren" label="1">
          <el-collapse v-model="actives">
            <el-collapse-item name="1">
              <template #title>
                <div class="title">文字属性</div>
              </template>
              <el-row :gutter="24" align="middle">
                <el-col :span="24">
                  <operateItemTextContent v-model="item.textContent"></operateItemTextContent>
                </el-col>
                <el-col :span="12">
                  <operateItemFontSize v-model="item.fontSize"></operateItemFontSize>
                </el-col>
                <el-col :span="12">
                  <operateItemFontWeight v-model="item.fontWeight"></operateItemFontWeight>
                </el-col>
                <el-col :span="12">
                  <operateItemFontItalic v-model="item.italic"></operateItemFontItalic>
                </el-col>
                <el-col :span="12">
                  <operateItemFontColor v-model="item.fontColor"></operateItemFontColor>
                </el-col>
                
                <el-col :span="24">
                  <operateItemFontFamily v-model="item.fontFamilyInfo"></operateItemFontFamily>
                </el-col>
                <el-col :span="12">
                  <operateItemLineHeight v-model="item.lineHeight"></operateItemLineHeight>
                </el-col>
                <el-col :span="12">
                  <operateItemLetterSpacing v-model="item.letterSpacing"></operateItemLetterSpacing>
                </el-col>
                <el-col :span="12">
                  <operate-form-item>
                    <template #icon> <icon-writing-mode></icon-writing-mode> </template>
                    <template #name> 排列方式 </template>
                    <template #content> </template>
                  </operate-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <div class="title">文字位置</div>
            </template>
          </el-collapse-item>
            <!-- <el-collapse-item name="3">
              <template #title>
                <div class="title">背景和边框</div>
              </template>
              <el-row :gutter="24" align="middle">
                <el-col :span="12">
                  <operateItemBackground v-model="item.background"></operateItemBackground>
                </el-col> 
                <el-col :span="12">
                  <operate-form-item>
                    <template #icon><icon-border-color></icon-border-color> </template>
                    <template #name> 边框颜色 </template>
                    <template #content>
                      <color-picker v-model:pureColor="operatingTextStickerOptions.borderColor"></color-picker>
                    </template>
                  </operate-form-item>
                </el-col>
                <el-col :span="12">
                  <operate-form-item>
                    <template #icon><icon-border-style></icon-border-style> </template>
                    <template #name> 边框样式 </template>
                    <template #content> </template>
                  </operate-form-item>
                </el-col>
                <el-col :span="12">
                  <operate-form-item>
                    <template #icon><icon-border-width></icon-border-width> </template>
                    <template #name> 边框宽度 </template>
                    <template #content>
                      <el-input type="number" v-model="operatingTextStickerOptions.borderWidth" min="0" max="5" step=".1"
                        size="small"></el-input>
                    </template>
                  </operate-form-item>
                </el-col>
              </el-row>
            </el-collapse-item> -->
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { Canvg } from "canvg";
import operate from "./operate.vue";
import {
  svgToBase64,
  downloadByFile,
  svgToFile,
  svgToPngFile,
} from "@/common/transform/index";
import {
  SvgCanvas,
  operatingSvgWidth,
  operatingSvgHeight,
  addSvgCanvasChild,
} from "./template";
import {  svgCanvasChildren,} from '@/components/design/store'
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import operateFormItem from "@/components/design/components/operate/operateFormItem.vue";
import colorPicker from "../../components/colorPicker.vue";

import iconWritingMode from "@/components/design/assets/icon/writing-mode.svg?component";

import iconBorderWidth from "@/components/design/assets/icon/border-width.svg?component";
import iconBorderStyle from "@/components/design/assets/icon/border-style.svg?component";
import iconBorderColor from "@/components/design/assets/icon/border-color.svg?component";
import { operatingTextStickerOptions, showFontList } from "../../store";
import operateItemTextContent from '@/components/design/components/operate/textContent.vue'
import operateItemFontSize from '@/components/design/components/operate/fontSize.vue'
import operateItemFontWeight from '@/components/design/components/operate/fontWeight.vue'
import operateItemFontItalic from '@/components/design/components/operate/italic.vue'
import operateItemFontColor from '@/components/design/components/operate/fontColor.vue'
import operateItemFontFamily from '@/components/design/components/operate/fontFamily.vue'
import operateItemLineHeight from '@/components/design/components/operate/lineHeight.vue'
import operateItemLetterSpacing from '@/components/design/components/operate/letterSpacing.vue'
import operateItemBackground from '@/components/design/components/operate/background.vue'



const r = ref();

const actives = ref(["1", "2", "3", "4"]);




const svgCanvasRef = ref();

function add() {
  addSvgCanvasChild('text');
  document.body.click()
}

async function exportToPng() {
  let png = await svgToPngFile(svgCanvasRef.value);
  downloadByFile(png);
}
</script>

<style lang="less" scoped>
.container {
  width: 320px;
  height: 100%;
}

.svg-canvas {
  width: 300px;
  height: 300px;
  display: flex;
  margin: 10px;
  align-items: center;
  justify-content: center;
}

.operate {
  flex: 1;
  width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
}

.header {
  padding: .4em 1em;
  width: 100%;
}

.tags {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: .8em .4em;

  :deep(.el-tag) {
    cursor: pointer;
  }
}

.main {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.title {
  font-size: 1rem;
  font-weight: bold;
}
</style>
