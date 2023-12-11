<template>
  <div class="designiy-custom-text-sticker">
    <div class="designiy-custom-text-sticker-title">创作文本贴纸</div>

    <sticker-canvas></sticker-canvas>

    <tab v-model="activeTab" :items="['基础属性', '背景属性', '其他特效']"></tab>

    <div class="designiy-custom-text-sticker-content">

        <operate-form-item>
          <template #icon> <icon-font-size></icon-font-size> </template>
          <template #name> 显示大小 </template>
          <template #content>
            <el-input
              type="number"
              v-model="operatingTextStickerOptions.fontSize"
              size="small"
              style="width: 80px"
            ></el-input>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-bold></icon-bold> </template>
          <template #name> 厚度 </template>
          <template #content>
            <el-select
              v-model="operatingTextStickerOptions.fontWeight"
              size="small"
              style="width: 80px"
            >
              <el-option
                v-for="item in fontWeightOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-font-color></icon-font-color> </template>
          <template #name> 字体颜色</template>
          <template #content>
            <color-picker
              v-model:pureColor="operatingTextStickerOptions.fontColor"
              v-model:gradientColor="operatingTextStickerOptions.fontGradientColor"
        
            ></color-picker>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-line-height></icon-line-height> </template>
          <template #name> 行高 </template>
          <template #content>
            <el-input
              type="number"
              v-model="operatingTextStickerOptions.lineHeight"
              size="small"
              style="width: 80px"
              min="0"
              max="5"
              step=".1"
            ></el-input>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-letter-spacing></icon-letter-spacing> </template>
          <template #name> 间距 </template>
          <template #content>
            <el-input
              type="number"
              v-model="operatingTextStickerOptions.letterSpacing"
              size="small"
              style="width: 80px"
              min="-1"
              max="1"
              step=".1"
            ></el-input>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-writing-mode></icon-writing-mode> </template>
          <template #name> 排列方式 </template>
          <template #content>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-font-family></icon-font-family> </template>
          <template #name> 个性字体 </template>
          <template #content>
              <div @click="showFontList = true">
                 无
              </div>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-italic></icon-italic> </template>
          <template #name> 斜体 </template>
          <template #content>
              <div @click="operatingTextStickerOptions.italic = !operatingTextStickerOptions.italic">
                 {{operatingTextStickerOptions.italic ? '是' : '否'}}
              </div>
          </template>
        </operate-form-item>
        <operate-form-item>
          <template #icon> <icon-background-color></icon-background-color> </template>
          <template #name> 背景色 </template>
          <template #content>
            <color-picker
              v-model:pureColor="operatingTextStickerOptions.backgroundColor"
              v-model:gradientColor="operatingTextStickerOptions.backgroundGradientColor"
            ></color-picker>
          </template>
        </operate-form-item>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import stickerCanvas from "./canvas.vue";
import tab from "../../components/tab.vue";
import operateFormItem from "./operate/operateFormItem.vue";
import iconBold from "@/icon/bold.svg?vueComponent";
import iconFontSize from "@/icon/font-size.svg?vueComponent";
import iconFontColor from "@/icon/font-color.svg?vueComponent";
import colorPicker from "../../components/colorPicker.vue";
import iconLineHeight from '@/icon/line-height.svg?vueComponent';
import iconLetterSpacing from '@/icon/letter-spacing.svg?vueComponent'
import iconWritingMode from '@/icon/writing-mode.svg?vueComponent'
import iconFontFamily from '@/icon/font-family.svg?vueComponent'
import iconBackgroundColor from '@/icon/background-color.svg?vueComponent'
import iconItalic from '@/icon/italic.svg?vueComponent'

import { operatingTextStickerOptions, showFontList } from "../../store";

const fontWeightOptions = reactive([
  {
    value: "100",
    label: "超细体",
  },
  {
    value: "200",
    label: "特细体",
  },
  {
    value: "300",
    label: "细体",
  },
  {
    value: "400",
    label: "正常体",
  },
  {
    value: "500",
    label: "中等体",
  },
  {
    value: "600",
    label: "半粗体",
  },
  {
    value: "700",
    label: "粗体",
  },
  {
    value: "800",
    label: "特粗体",
  },
  {
    value: "900",
    label: "超粗体",
  },
]);

const activeTab = ref("基础属性");
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
  padding: 10px 10px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: #333;
}

.designiy-custom-text-sticker-content {
  height: 100%;
  width: 100%;
  padding:10px 0;
  overflow:auto;
}
</style>
