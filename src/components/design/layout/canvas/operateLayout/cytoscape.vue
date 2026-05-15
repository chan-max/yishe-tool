<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="elements" title="节点和边">
      <operate-form-item>
        <template #name>布局</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.layout" size="small">
            <el-option label="预设位置 (preset)" value="preset" />
            <el-option label="网格 (grid)" value="grid" />
            <el-option label="圆形 (circle)" value="circle" />
            <el-option label="同心圆 (concentric)" value="concentric" />
            <el-option label="层级 (breadthfirst)" value="breadthfirst" />
            <el-option label="力导向 (cose)" value="cose" />
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>元素数据</template>
        <template #content>
          <el-input
            v-model="elementsJson"
            type="textarea"
            :rows="12"
            resize="vertical"
            spellcheck="false"
            placeholder='[
  {"data": {"id": "A", "label": "开始"}},
  {"data": {"id": "B", "label": "处理"}},
  {"data": {"source": "A", "target": "B"}}
]'
            class="cytoscape-elements-input"
          ></el-input>
          <div v-if="jsonError" class="cytoscape-json-error">{{ jsonError }}</div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operate-form-item>
        <template #name>节点颜色</template>
        <template #content>
          <el-color-picker v-model="nodeColor" size="small" />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>边颜色</template>
        <template #content>
          <el-color-picker v-model="edgeColor" size="small" />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>文字颜色</template>
        <template #content>
          <el-color-picker v-model="labelColor" size="small" />
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
import { ref, computed, watch } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["elements", "style", "basic", "common"]);
const jsonError = ref("");

const elementsJson = computed({
  get() {
    return JSON.stringify(currentOperatingCanvasChild.value?.elements || [], null, 2);
  },
  set(val: string) {
    jsonError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        currentOperatingCanvasChild.value.elements = parsed;
      } else {
        jsonError.value = "请输入 JSON 数组";
      }
    } catch {
      jsonError.value = "JSON 格式错误";
    }
  },
});

const nodeColor = computed({
  get() {
    return currentOperatingCanvasChild.value?.style?.nodeColor || '#4A90D9';
  },
  set(val: string) {
    if (!currentOperatingCanvasChild.value.style) {
      currentOperatingCanvasChild.value.style = {};
    }
    currentOperatingCanvasChild.value.style.nodeColor = val;
  },
});

const edgeColor = computed({
  get() {
    return currentOperatingCanvasChild.value?.style?.edgeColor || '#666666';
  },
  set(val: string) {
    if (!currentOperatingCanvasChild.value.style) {
      currentOperatingCanvasChild.value.style = {};
    }
    currentOperatingCanvasChild.value.style.edgeColor = val;
  },
});

const labelColor = computed({
  get() {
    return currentOperatingCanvasChild.value?.style?.labelColor || '#333333';
  },
  set(val: string) {
    if (!currentOperatingCanvasChild.value.style) {
      currentOperatingCanvasChild.value.style = {};
    }
    currentOperatingCanvasChild.value.style.labelColor = val;
  },
});
</script>

<style scoped>
.cytoscape-elements-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.cytoscape-json-error {
  color: #c45656;
  font-size: 12px;
  margin-top: 4px;
}
</style>
