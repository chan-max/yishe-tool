<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="shape" title="形状设置">
      <operate-form-item>
        <template #name>形状类型</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.shape" size="small">
            <el-option label="矩形" value="rect"></el-option>
            <el-option label="圆形" value="circle"></el-option>
            <el-option label="线条" value="line"></el-option>
            <el-option label="椭圆" value="ellipse"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>填充色</template>
        <template #content>
          <el-color-picker
            v-model="currentOperatingCanvasChild.fill"
            size="small"
            show-alpha
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>描边色</template>
        <template #content>
          <el-color-picker
            v-model="currentOperatingCanvasChild.stroke"
            size="small"
            show-alpha
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>描边宽度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.strokeWidth"
            :min="1"
            :max="10"
            :step="0.5"
            size="small"
            show-input
            input-size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>粗糙度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.roughness"
            :min="0"
            :max="5"
            :step="0.1"
            size="small"
            show-input
            input-size="small"
          />
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
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["shape", "basic", "common"]);
</script>

<style scoped>
.rough-shape-settings {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
