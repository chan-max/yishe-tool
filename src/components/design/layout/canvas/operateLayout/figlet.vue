<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="text" title="文字">
      <operate-form-item>
        <template #name>文字内容</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.text"
            type="textarea"
            :rows="4"
            resize="vertical"
            spellcheck="false"
            placeholder="输入文字内容"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>字体</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.font" size="small">
            <el-option
              v-for="font in figletFonts"
              :key="font"
              :label="font"
              :value="font"
            ></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operateItemFontSize
        label="字体大小"
        v-model="currentOperatingCanvasChild.fontSize"
      ></operateItemFontSize>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operateItemBackgroundColor
        v-model="currentOperatingCanvasChild.backgroundColor"
      ></operateItemBackgroundColor>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemFontSize from "@/components/design/layout/canvas/operate/fontSize.vue";
import { currentOperatingCanvasChild } from "../index.tsx";
import { FIGLET_FONTS } from "../children/figlet.tsx";

const activeNames = ref(["text", "basic", "style", "common"]);
const figletFonts = FIGLET_FONTS;
</script>
