<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="chartType" title="图表类型">
      <operate-form-item>
        <template #name>图表类型</template>
        <template #content>
          <el-select
            v-model="currentOperatingCanvasChild.chartType"
            size="small"
            placeholder="选择图表类型"
          >
            <el-option
              v-for="item in chartTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="data" title="数据">
      <operate-form-item>
        <template #name>数据 (JSON)</template>
        <template #content>
          <el-input
            v-model="dataJson"
            type="textarea"
            :rows="10"
            resize="vertical"
            spellcheck="false"
            placeholder='{
  "labels": ["A", "B", "C"],
  "datasets": [{
    "label": "Sample",
    "data": [10, 20, 30]
  }]
}'
            class="chartjs-json-input"
          ></el-input>
          <div v-if="dataError" class="chartjs-error">{{ dataError }}</div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="options" title="配置">
      <operate-form-item>
        <template #name>配置 (JSON)</template>
        <template #content>
          <el-input
            v-model="optionsJson"
            type="textarea"
            :rows="8"
            resize="vertical"
            spellcheck="false"
            placeholder='{"plugins": {"legend": {"position": "top"}}}'
            class="chartjs-json-input"
          ></el-input>
          <div v-if="optionsError" class="chartjs-error">
            {{ optionsError }}
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
import { CHART_TYPES } from "../children/chartjs.tsx";

const activeNames = ref(["chartType", "data", "basic", "common"]);
const dataError = ref("");
const optionsError = ref("");

const chartTypes = CHART_TYPES;

const dataJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.data || {},
      null,
      2,
    );
  },
  set(val: string) {
    dataError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null) {
        currentOperatingCanvasChild.value.data = parsed;
      } else {
        dataError.value = "请输入 JSON 对象";
      }
    } catch {
      dataError.value = "JSON 格式错误";
    }
  },
});

const optionsJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.options || {},
      null,
      2,
    );
  },
  set(val: string) {
    optionsError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null) {
        currentOperatingCanvasChild.value.options = parsed;
      } else {
        optionsError.value = "请输入 JSON 对象";
      }
    } catch {
      optionsError.value = "JSON 格式错误";
    }
  },
});
</script>

<style scoped>
.chartjs-json-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.chartjs-error {
  color: #c45656;
  font-size: 12px;
  margin-top: 4px;
}
</style>
