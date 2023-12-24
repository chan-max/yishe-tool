<template>
  <div class="designiy-custom-text-sticker-content">
    <operate-form-item>
      <template #icon> <icon-font-size></icon-font-size> </template>
      <template #name> 显示大小 </template>
      <template #content> 
        <el-input
          style="width:60px;"
          type="number"
          v-model="operatingTextStickerOptions.fontSize"
          size="small"
        ></el-input>
      </template>
    </operate-form-item>
    <operate-form-item>
      <template #icon> <icon-bold></icon-bold> </template>
      <template #name> 厚度 </template>
      <template #content>
        <el-select
          style="width:60px;"
          v-model="operatingTextStickerOptions.fontWeight"
          size="small"
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
          min="-1"
          max="1"
          step=".1"
        ></el-input>
      </template>
    </operate-form-item>
    <operate-form-item>
      <template #icon> <icon-writing-mode></icon-writing-mode> </template>
      <template #name> 排列方式 </template>
      <template #content> </template>
    </operate-form-item>
    <operate-form-item>
      <template #icon> <icon-font-family></icon-font-family> </template>
      <template #name> 个性字体 </template>
      <template #content>
        <div @click="showFontList = true">无</div>
      </template>
    </operate-form-item>
    <operate-form-item>
      <template #icon> <icon-italic></icon-italic> </template>
      <template #name> 斜体 </template>
      <template #content>
        <div
          @click="
            operatingTextStickerOptions.italic = !operatingTextStickerOptions.italic
          "
        >
          {{ operatingTextStickerOptions.italic ? "是" : "否" }}
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
    <operate-form-item>
      <template #icon> </template>
      <template #name> 文字边框 </template>
      <template #content> </template>
    </operate-form-item>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import operateFormItem from "./operateFormItem.vue";
import iconBold from "@/icon/bold.svg?vueComponent";
import iconFontSize from "@/icon/font-size.svg?vueComponent";
import iconFontColor from "@/icon/font-color.svg?vueComponent";
import colorPicker from "../../components/colorPicker.vue";
import iconLineHeight from "@/icon/line-height.svg?vueComponent";
import iconLetterSpacing from "@/icon/letter-spacing.svg?vueComponent";
import iconWritingMode from "@/icon/writing-mode.svg?vueComponent";
import iconFontFamily from "@/icon/font-family.svg?vueComponent";
import iconBackgroundColor from "@/icon/background-color.svg?vueComponent";
import iconItalic from "@/icon/italic.svg?vueComponent";

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
</script>

<style>
.designiy-custom-text-sticker-content {
  height: 100%;
  width: 100%;
  padding: 10px 0;
  margin: 10px 0;
  overflow: auto;
}
</style>
