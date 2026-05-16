<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>

      <operate-form-item style="align-items: start">
        <template #name>词语数据</template>
        <template #content>
          <el-input
            v-model="wordsText"
            type="textarea"
            size="small"
            :autosize="{ minRows: 5, maxRows: 12 }"
            placeholder='JSON 格式: [{"text": "Hello", "size": 40}]'
            @change="applyWordsText"
            @blur="applyWordsText"
          ></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="presentation" title="表现">
      <operate-form-item>
        <template #name>字体</template>
        <template #content>
          <el-input
            v-model="d3Cloud.fontFamily"
            size="small"
            placeholder="sans-serif"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>字重</template>
        <template #content>
          <el-input
            v-model="d3Cloud.fontWeight"
            size="small"
            placeholder="normal / bold / 600"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item style="align-items: start">
        <template #name>颜色列表</template>
        <template #content>
          <el-input
            v-model="colorsText"
            type="textarea"
            size="small"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="#111111, #ff4d6d, #2ec4b6"
            @change="applyColorsText"
            @blur="applyColorsText"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>背景色</template>
        <template #content>
          <el-color-picker
            v-model="backgroundColor"
            size="small"
            show-alpha
          ></el-color-picker>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="layout" title="布局">
      <operate-form-item>
        <template #name>内边距</template>
        <template #content>
          <el-input-number
            v-model="d3Cloud.padding"
            size="small"
            :min="0"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>螺旋方式</template>
        <template #content>
          <el-select v-model="d3Cloud.spiral" size="small">
            <el-option label="阿基米德" value="archimedean"></el-option>
            <el-option label="矩形" value="rectangular"></el-option>
          </el-select>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";
import { createDefaultD3CloudOptions } from "../children/d3Cloud.tsx";

const activeNames = ref(["basic", "presentation", "layout", "common"]);
const wordsText = ref("");
const colorsText = ref("");

const d3Cloud = computed(() => {
  const child = currentOperatingCanvasChild.value;
  if (!child.d3Cloud) {
    child.d3Cloud = {
      version: 1,
      ...createDefaultD3CloudOptions(),
    };
  }
  return child.d3Cloud;
});

const backgroundColor = computed({
  get() {
    return d3Cloud.value.backgroundColor || "#ffffff";
  },
  set(value: string) {
    d3Cloud.value.backgroundColor = value;
  },
});

function syncWordsText() {
  wordsText.value = JSON.stringify(d3Cloud.value.words || [], null, 2);
}

function applyWordsText() {
  try {
    const parsed = JSON.parse(wordsText.value);
    if (Array.isArray(parsed)) {
      d3Cloud.value.words = parsed.filter(
        (item) => item && typeof item.text === "string",
      );
    }
  } catch (error) {
    // 忽略解析错误
  }
}

function syncColorsText() {
  colorsText.value = (d3Cloud.value.colors || []).join(", ");
}

function applyColorsText() {
  d3Cloud.value.colors = colorsText.value
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

watch(
  d3Cloud,
  () => {
    syncWordsText();
    syncColorsText();
  },
  { immediate: true },
);
</script>
