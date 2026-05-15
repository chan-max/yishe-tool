<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="component" title="组件类型">
      <operate-form-item>
        <template #name>图表类型</template>
        <template #content>
          <el-select
            v-model="currentOperatingCanvasChild.component"
            size="small"
            filterable
            placeholder="选择图表类型"
          >
            <el-option-group
              v-for="group in componentGroups"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.items"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="dataset" title="数据">
      <operate-form-item>
        <template #name>数据集</template>
        <template #content>
          <el-input
            v-model="datasetJson"
            type="textarea"
            :rows="10"
            resize="vertical"
            spellcheck="false"
            placeholder='[
  {"name": "项目 A", "values": [30]},
  {"name": "项目 B", "values": [25]}
]'
            class="vue-data-ui-dataset-input"
          ></el-input>
          <div v-if="datasetError" class="vue-data-ui-error">{{ datasetError }}</div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="config" title="配置">
      <operate-form-item>
        <template #name>组件配置</template>
        <template #content>
          <el-input
            v-model="configJson"
            type="textarea"
            :rows="8"
            resize="vertical"
            spellcheck="false"
            placeholder='{"style": {"chart": {"title": {"text": "标题"}}}}'
            class="vue-data-ui-config-input"
          ></el-input>
          <div v-if="configError" class="vue-data-ui-error">{{ configError }}</div>
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
import { ref, computed } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";
import { VUE_DATA_UI_COMPONENTS } from "../children/vueDataUi.tsx";

const activeNames = ref(["component", "dataset", "basic", "common"]);
const datasetError = ref("");
const configError = ref("");

const componentGroups = computed(() => {
  const groups: Record<string, { value: string; label: string }[]> = {};
  VUE_DATA_UI_COMPONENTS.forEach((item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  });

  const categoryLabels: Record<string, string> = {
    Charts: '图表',
    Mini: '迷你图',
    '3D': '3D',
    Table: '表格',
    Rating: '评分',
  };

  return Object.entries(groups).map(([key, items]) => ({
    label: categoryLabels[key] || key,
    items,
  }));
});

const datasetJson = computed({
  get() {
    return JSON.stringify(currentOperatingCanvasChild.value?.dataset || [], null, 2);
  },
  set(val: string) {
    datasetError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        currentOperatingCanvasChild.value.dataset = parsed;
      } else {
        datasetError.value = "请输入 JSON 数组";
      }
    } catch {
      datasetError.value = "JSON 格式错误";
    }
  },
});

const configJson = computed({
  get() {
    return JSON.stringify(currentOperatingCanvasChild.value?.config || {}, null, 2);
  },
  set(val: string) {
    configError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) {
        currentOperatingCanvasChild.value.config = parsed;
      } else {
        configError.value = "请输入 JSON 对象";
      }
    } catch {
      configError.value = "JSON 格式错误";
    }
  },
});
</script>

<style scoped>
.vue-data-ui-dataset-input :deep(.el-textarea__inner),
.vue-data-ui-config-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.vue-data-ui-error {
  color: #c45656;
  font-size: 12px;
  margin-top: 4px;
}
</style>
