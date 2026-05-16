<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="markdown" title="Markdown">
      <operate-form-item>
        <template #name>Markdown</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.markdown"
            type="textarea"
            :rows="10"
            resize="vertical"
            spellcheck="false"
            placeholder="# 主题&#10;## 分支1&#10;### 子节点1&#10;### 子节点2&#10;## 分支2"
          ></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>

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

const activeNames = ref(["markdown", "basic", "common"]);
</script>

<style scoped></style>
