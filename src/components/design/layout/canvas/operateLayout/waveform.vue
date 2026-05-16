<template>
  <el-collapse v-model="waveformCollapseActives">
    <el-collapse-item name="1" title="音频波形">
      <operate-form-item>
        <template #icon><icon></icon></template>
        <template #name>音频URL</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.audioUrl"
            placeholder="请输入音频URL"
            clearable
            size="small"
          >
          </el-input>
        </template>
      </operate-form-item>

      <operateItemColor
        label="波形色"
        v-model="currentOperatingCanvasChild.waveColor"
      >
      </operateItemColor>

      <operateItemColor
        label="进度色"
        v-model="currentOperatingCanvasChild.progressColor"
      >
      </operateItemColor>

      <operate-form-item>
        <template #icon><icon></icon></template>
        <template #name>波形高度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.height"
            :min="20"
            :max="300"
            :step="1"
            size="small"
          >
          </el-slider>
        </template>
      </operate-form-item>

      <operateItemBackgroundColor
        v-model="currentOperatingCanvasChild.backgroundColor"
      >
      </operateItemBackgroundColor>
    </el-collapse-item>

    <el-collapse-item name="2" title="尺寸">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      >
      </operateItemSize>
    </el-collapse-item>

    <el-collapse-item name="3" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>

    <el-collapse-item name="4">
      <template #title>
        <div class="title">滤镜效果</div>
      </template>
      <operateItemFilterGroup
        v-model="currentOperatingCanvasChild.filter"
      ></operateItemFilterGroup>
    </el-collapse-item>

    <operateItemClipPath
      v-model="currentOperatingCanvasChild.clipPath"
    ></operateItemClipPath>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";

import operateItemColor from "@/components/design/layout/canvas/operate/color/index.vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemFilterGroup from "@/components/design/layout/canvas/operate/filter/group.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import operateItemClipPath from "@/components/design/layout/canvas/operate/clipPath/index.vue";

import { currentOperatingCanvasChild } from "../index.tsx";

const waveformCollapseActives = ref(["1", "2", "3", "4"]);
</script>

<style></style>
