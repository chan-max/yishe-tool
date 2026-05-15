<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="source" title="ABC 记谱法">
      <operate-form-item>
        <template #name>乐谱</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.source"
            type="textarea"
            :rows="12"
            resize="vertical"
            spellcheck="false"
            placeholder="X:1
T:小星星
M:4/4
K:C
C C G G | A A G2 | F F E E | D D C2 |"
            class="abc-notation-source-input"
          ></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      />

      <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor" />
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

const activeNames = ref(["source", "basic", "common"]);
</script>

<style scoped>
.abc-notation-source-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}
</style>
