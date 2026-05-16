<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="chart" title="图表设置">
      <operate-form-item>
        <template #name>图表类型</template>
        <template #content>
          <el-select
            v-model="currentOperatingCanvasChild.chartType"
            size="small"
          >
            <el-option
              v-for="type in chartTypes"
              :key="type"
              :label="type"
              :value="type"
            ></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>标签 (Labels)</template>
        <template #content>
          <el-input
            v-model="labelsText"
            type="textarea"
            :rows="3"
            resize="vertical"
            spellcheck="false"
            placeholder='["Jan","Feb","Mar","Apr","May"]'
            @blur="parseLabels"
          ></el-input>
          <div v-if="labelsError" class="frappe-chart-error">
            {{ labelsError }}
          </div>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>数据集 (Datasets)</template>
        <template #content>
          <el-input
            v-model="datasetsText"
            type="textarea"
            :rows="4"
            resize="vertical"
            spellcheck="false"
            placeholder='[{"values": [25, 40, 30, 35, 8]}]'
            @blur="parseDatasets"
          ></el-input>
          <div v-if="datasetsError" class="frappe-chart-error">
            {{ datasetsError }}
          </div>
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
import { ref, watch } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import { currentOperatingCanvasChild } from "../index.tsx";
import { FRAPPE_CHART_TYPES } from "../children/frappeChart.tsx";

const activeNames = ref(["chart", "basic", "common"]);
const chartTypes = FRAPPE_CHART_TYPES;

const labelsText = ref("");
const labelsError = ref("");
const datasetsText = ref("");
const datasetsError = ref("");

function syncLabelsText() {
  try {
    const labels = currentOperatingCanvasChild.value?.labels;
    if (Array.isArray(labels)) {
      labelsText.value = JSON.stringify(labels, null, 2);
    } else {
      labelsText.value = '["Jan","Feb","Mar","Apr","May"]';
    }
    labelsError.value = "";
  } catch {
    labelsText.value = '["Jan","Feb","Mar","Apr","May"]';
    labelsError.value = "";
  }
}

function syncDatasetsText() {
  try {
    const datasets = currentOperatingCanvasChild.value?.datasets;
    if (Array.isArray(datasets)) {
      datasetsText.value = JSON.stringify(datasets, null, 2);
    } else {
      datasetsText.value = '[{"values": [25, 40, 30, 35, 8]}]';
    }
    datasetsError.value = "";
  } catch {
    datasetsText.value = '[{"values": [25, 40, 30, 35, 8]}]';
    datasetsError.value = "";
  }
}

function parseLabels() {
  try {
    const parsed = JSON.parse(labelsText.value);
    if (!Array.isArray(parsed)) {
      labelsError.value = "标签必须是一个数组";
      return;
    }
    currentOperatingCanvasChild.value.labels = parsed;
    labelsError.value = "";
  } catch (error: any) {
    labelsError.value = error?.message || "JSON 解析失败";
  }
}

function parseDatasets() {
  try {
    const parsed = JSON.parse(datasetsText.value);
    if (!Array.isArray(parsed)) {
      datasetsError.value = "数据集必须是一个数组";
      return;
    }
    currentOperatingCanvasChild.value.datasets = parsed;
    datasetsError.value = "";
  } catch (error: any) {
    datasetsError.value = error?.message || "JSON 解析失败";
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    syncLabelsText();
    syncDatasetsText();
  },
  { immediate: true },
);
</script>

<style scoped>
.frappe-chart-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
}
</style>
