<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="spec" title="Vega-Lite Spec">
      <operate-form-item>
        <template #name>Spec (JSON)</template>
        <template #content>
          <div class="vegalite-spec-editor">
            <el-input
              v-model="specJson"
              type="textarea"
              :rows="12"
              resize="vertical"
              spellcheck="false"
              placeholder='{&#10;  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",&#10;  "data": { "values": [...] },&#10;  "mark": "bar",&#10;  "encoding": { ... }&#10;}'
              class="vegalite-spec-input"
            ></el-input>
            <div v-if="specError" class="vegalite-error">{{ specError }}</div>
          </div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      />

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
import { ref, computed } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["spec", "basic", "common"]);
const specError = ref("");

const specJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.spec || {},
      null,
      2,
    );
  },
  set(val: string) {
    specError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        currentOperatingCanvasChild.value.spec = parsed;
      } else {
        specError.value = "请输入 JSON 对象";
      }
    } catch {
      specError.value = "JSON 格式错误";
    }
  },
});
</script>

<style scoped>
.vegalite-spec-editor {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vegalite-spec-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.vegalite-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}
</style>
