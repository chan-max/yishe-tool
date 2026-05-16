<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="source" title="DOT 语法">
      <operate-form-item>
        <template #name>Graphviz</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.dot"
            type="textarea"
            :rows="10"
            resize="vertical"
            spellcheck="false"
            placeholder="digraph {&#10;  a -> b&#10;}"
            class="graphviz-source-editor__input"
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

const activeNames = ref(["source", "basic", "common"]);
</script>

<style scoped>
.graphviz-source-editor__input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}
</style>
