<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="particles" title="粒子效果">
      <operate-form-item>
        <template #name>预设</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.preset" size="small">
            <el-option label="星星 (Stars)" value="stars"></el-option>
            <el-option label="气泡 (Bubbles)" value="bubbles"></el-option>
            <el-option label="雪花 (Snow)" value="snow"></el-option>
            <el-option label="火焰 (Fire)" value="fire"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>粒子数量</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.particleCount"
            size="small"
            :min="10"
            :max="500"
            :step="10"
          ></el-input-number>
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
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["particles", "basic", "style", "common"]);
</script>
