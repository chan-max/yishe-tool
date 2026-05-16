<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="data" title="数据">
      <operate-form-item>
        <template #name>Data (JSON 数组)</template>
        <template #content>
          <el-input
            v-model="dataJson"
            type="textarea"
            :rows="10"
            resize="vertical"
            spellcheck="false"
            placeholder='[{"x": [1,2,3,4], "y": [10,15,13,17], "type": "scatter"}]'
            class="plotly-json-input"
          ></el-input>
          <div v-if="dataError" class="plotly-error">{{ dataError }}</div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="layout" title="布局配置">
      <operate-form-item>
        <template #name>Layout (JSON)</template>
        <template #content>
          <el-input
            v-model="layoutJson"
            type="textarea"
            :rows="8"
            resize="vertical"
            spellcheck="false"
            placeholder='{"title": "My Chart", "xaxis": {"title": "X"}, "yaxis": {"title": "Y"}}'
            class="plotly-json-input"
          ></el-input>
          <div v-if="layoutError" class="plotly-error">{{ layoutError }}</div>
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

const activeNames = ref(["data", "layout", "basic", "common"]);
const dataError = ref("");
const layoutError = ref("");

const dataJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.data || [],
      null,
      2,
    );
  },
  set(val: string) {
    dataError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        currentOperatingCanvasChild.value.data = parsed;
      } else {
        dataError.value = "请输入 JSON 数组";
      }
    } catch {
      dataError.value = "JSON 格式错误";
    }
  },
});

const layoutJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.layout || {},
      null,
      2,
    );
  },
  set(val: string) {
    layoutError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null) {
        currentOperatingCanvasChild.value.layout = parsed;
      } else {
        layoutError.value = "请输入 JSON 对象";
      }
    } catch {
      layoutError.value = "JSON 格式错误";
    }
  },
});
</script>

<style scoped>
.plotly-json-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.plotly-error {
  color: #c45656;
  font-size: 12px;
  margin-top: 4px;
}
</style>
