<template>
  <el-form label-width="80px" :model="formData">
    <el-card header="数据配置" class="property-group" shadow="never">
      <el-form-item label="节点数据">
        <el-input
          v-model="nodesJson"
          type="textarea"
          :rows="6"
          placeholder='[{"id":"A","name":"Node A"},{"id":"B","name":"Node B"}]'
          @blur="onNodesChange"
        />
        <div v-if="nodesError" class="text-red-500 text-xs mt-1">
          {{ nodesError }}
        </div>
      </el-form-item>
      <el-form-item label="链接数据">
        <el-input
          v-model="linksJson"
          type="textarea"
          :rows="6"
          placeholder='[{"source":"A","target":"B","value":10}]'
          @blur="onLinksChange"
        />
        <div v-if="linksError" class="text-red-500 text-xs mt-1">
          {{ linksError }}
        </div>
      </el-form-item>
    </el-card>

    <el-card header="样式配置" class="property-group" shadow="never">
      <el-form-item label="背景色">
        <ColorInput v-model="formData.backgroundColor" />
      </el-form-item>
      <el-form-item label="节点宽度">
        <el-input-number v-model="formData.nodeWidth" :min="5" :max="60" />
      </el-form-item>
      <el-form-item label="节点间距">
        <el-input-number v-model="formData.nodePadding" :min="0" :max="50" />
      </el-form-item>
    </el-card>

    <el-card header="尺寸配置" class="property-group" shadow="never">
      <el-form-item label="宽度">
        <el-input-number
          v-model="formData.width"
          :min="200"
          :max="2000"
          :step="10"
        />
      </el-form-item>
      <el-form-item label="高度">
        <el-input-number
          v-model="formData.height"
          :min="100"
          :max="1500"
          :step="10"
        />
      </el-form-item>
    </el-card>

    <el-card header="通用属性" class="property-group" shadow="never">
      <el-form-item label="X坐标">
        <el-input-number v-model="formData.x" :min="0" :max="2000" :step="1" />
      </el-form-item>
      <el-form-item label="Y坐标">
        <el-input-number v-model="formData.y" :min="0" :max="2000" :step="1" />
      </el-form-item>
      <el-form-item label="层级">
        <el-input-number v-model="formData.zIndex" :min="0" :max="999" />
      </el-form-item>
      <el-form-item label="旋转角度">
        <el-slider
          v-model="formData.rotate"
          :min="0"
          :max="360"
          show-input
          input-size="small"
        />
      </el-form-item>
      <el-form-item label="透明度">
        <el-slider
          v-model="formData.opacity"
          :min="0"
          :max="1"
          :step="0.01"
          show-input
          input-size="small"
        />
      </el-form-item>
    </el-card>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from "vue";

interface SankeyNode {
  id: string;
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface D3SankeyProperty {
  nodes: SankeyNode[];
  links: SankeyLink[];
  backgroundColor: string;
  width: number;
  height: number;
  nodeWidth: number;
  nodePadding: number;
  x: number;
  y: number;
  zIndex: number;
  rotate: number;
  opacity: number;
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<D3SankeyProperty>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const formData = ref<D3SankeyProperty>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (val) => {
    formData.value = { ...val };
  },
  { deep: true },
);

watch(
  formData,
  (val) => {
    emit("update:modelValue", { ...val });
  },
  { deep: true },
);

const nodesJson = ref(JSON.stringify(formData.value.nodes, null, 2));
const linksJson = ref(JSON.stringify(formData.value.links, null, 2));
const nodesError = ref("");
const linksError = ref("");

watch(
  () => formData.value.nodes,
  (val) => {
    nodesJson.value = JSON.stringify(val, null, 2);
  },
  { deep: true },
);

watch(
  () => formData.value.links,
  (val) => {
    linksJson.value = JSON.stringify(val, null, 2);
  },
  { deep: true },
);

const onNodesChange = () => {
  try {
    const parsed = JSON.parse(nodesJson.value);
    if (!Array.isArray(parsed)) {
      nodesError.value = "请输入有效的JSON数组";
      return;
    }
    formData.value.nodes = parsed.map((item: any) => ({
      id: String(item.id || ""),
      name: String(item.name || item.id || ""),
    }));
    nodesError.value = "";
  } catch (e) {
    nodesError.value = "JSON格式错误，请检查输入";
  }
};

const onLinksChange = () => {
  try {
    const parsed = JSON.parse(linksJson.value);
    if (!Array.isArray(parsed)) {
      linksError.value = "请输入有效的JSON数组";
      return;
    }
    formData.value.links = parsed.map((item: any) => ({
      source: String(item.source || ""),
      target: String(item.target || ""),
      value: Number(item.value) || 0,
    }));
    linksError.value = "";
  } catch (e) {
    linksError.value = "JSON格式错误，请检查输入";
  }
};

defineOptions({ name: "D3SankeyProperty" });
</script>

<style scoped lang="scss">
.property-group {
  margin-bottom: 12px;
}
</style>
