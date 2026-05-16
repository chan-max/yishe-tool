<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="confetti" title="撒花效果">
      <operate-form-item>
        <template #name>预设</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.preset" size="small">
            <el-option label="默认" value="default" />
            <el-option label="烟花" value="fireworks" />
            <el-option label="雪花" value="snow" />
            <el-option label="庆祝" value="celebration" />
            <el-option label="校园" value="school" />
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
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>扩散角度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.spread"
            :min="10"
            :max="180"
            :step="5"
            size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>初始速度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.startVelocity"
            :min="10"
            :max="100"
            :step="5"
            size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>衰减</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.decay"
            :min="0.5"
            :max="1"
            :step="0.05"
            size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>重力</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.gravity"
            :min="0"
            :max="3"
            :step="0.1"
            size="small"
          />
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      />
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operateItemBackgroundColor
        v-model="currentOperatingCanvasChild.backgroundColor"
      />
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild" />
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["confetti", "basic", "style", "common"]);
</script>
