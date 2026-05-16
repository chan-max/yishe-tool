<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="noise" title="噪声参数">
      <operate-form-item>
        <template #name>缩放 (Scale)</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.scale"
            :min="10"
            :max="200"
            :step="1"
            show-input
            input-size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>八度 (Octaves)</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.octaves"
            :min="1"
            :max="8"
            :step="1"
            show-input
            input-size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>持续度 (Persistence)</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.persistence"
            :min="0"
            :max="1"
            :step="0.05"
            show-input
            input-size="small"
          />
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="colors" title="渐变颜色">
      <operate-form-item>
        <template #name>颜色 1</template>
        <template #content>
          <color-picker
            v-model="currentOperatingCanvasChild.color1"
          ></color-picker>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>颜色 2</template>
        <template #content>
          <color-picker
            v-model="currentOperatingCanvasChild.color2"
          ></color-picker>
        </template>
      </operate-form-item>
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
import colorPicker from "@/components/design/layout/canvas/operate/color/index.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["noise", "colors", "basic", "style", "common"]);
</script>

<style scoped></style>
