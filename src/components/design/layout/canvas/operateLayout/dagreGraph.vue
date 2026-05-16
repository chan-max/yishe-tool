<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="data" title="节点和边">
      <operate-form-item>
        <template #name>布局方向</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.rankdir" size="small">
            <el-option label="从上到下 (TB)" value="TB" />
            <el-option label="从左到右 (LR)" value="LR" />
            <el-option label="从下到上 (BT)" value="BT" />
            <el-option label="从右到左 (RL)" value="RL" />
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>节点数据</template>
        <template #content>
          <el-input
            v-model="nodesJson"
            type="textarea"
            :rows="6"
            resize="vertical"
            spellcheck="false"
            placeholder='[
  {"id": "a", "label": "A"},
  {"id": "b", "label": "B"}
]'
            class="dagre-graph-json-input"
          ></el-input>
          <div v-if="nodesJsonError" class="dagre-graph-json-error">
            {{ nodesJsonError }}
          </div>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>边数据</template>
        <template #content>
          <el-input
            v-model="edgesJson"
            type="textarea"
            :rows="6"
            resize="vertical"
            spellcheck="false"
            placeholder='[
  {"from": "a", "to": "b"}
]'
            class="dagre-graph-json-input"
          ></el-input>
          <div v-if="edgesJsonError" class="dagre-graph-json-error">
            {{ edgesJsonError }}
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

const activeNames = ref(["data", "basic", "common"]);
const nodesJsonError = ref("");
const edgesJsonError = ref("");

const nodesJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.nodes || [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      null,
      2,
    );
  },
  set(val: string) {
    nodesJsonError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        currentOperatingCanvasChild.value.nodes = parsed;
      } else {
        nodesJsonError.value = "请输入 JSON 数组";
      }
    } catch {
      nodesJsonError.value = "JSON 格式错误";
    }
  },
});

const edgesJson = computed({
  get() {
    return JSON.stringify(
      currentOperatingCanvasChild.value?.edges || [{ from: "a", to: "b" }],
      null,
      2,
    );
  },
  set(val: string) {
    edgesJsonError.value = "";
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        currentOperatingCanvasChild.value.edges = parsed;
      } else {
        edgesJsonError.value = "请输入 JSON 数组";
      }
    } catch {
      edgesJsonError.value = "JSON 格式错误";
    }
  },
});
</script>

<style scoped>
.dagre-graph-json-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.dagre-graph-json-error {
  color: #c45656;
  font-size: 12px;
  margin-top: 4px;
}
</style>
