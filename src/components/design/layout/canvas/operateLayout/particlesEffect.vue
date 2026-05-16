<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="particles" title="粒子效果">
      <operate-form-item>
        <template #name>预设</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.preset" size="small">
            <el-option label="星星 (Stars)" value="stars"></el-option>
            <el-option label="气泡 (Bubbles)" value="bubbles"></el-option>
            <el-option label="雪花 (Snow)" value="snow"></el-option>
            <el-option label="火焰 (Fire)" value="fire"></el-option>
            <el-option label="自定义 (Custom)" value="custom"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item v-if="currentOperatingCanvasChild.preset === 'custom'">
        <template #name>自定义配置</template>
        <template #content>
          <div class="particles-config-editor">
            <el-button size="small" type="primary" @click="openConfigDialog"
              >编辑 JSON 配置</el-button
            >
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
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
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

  <el-dialog
    v-model="configDialogVisible"
    title="编辑 Particles.js 配置"
    fullscreen
    append-to-body
    destroy-on-close
    class="particles-config-dialog"
  >
    <div class="particles-config-container">
      <div class="particles-config-tips">
        <el-alert
          title="参考 particles.js JSON 配置格式"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
      <el-input
        v-model="configText"
        type="textarea"
        spellcheck="false"
        resize="none"
        placeholder='{"particles":{"number":{"value":100}}}'
        class="particles-config-input"
      ></el-input>
      <div v-if="configError" class="particles-config-error">
        {{ configError }}
      </div>
    </div>

    <template #footer>
      <el-button @click="configDialogVisible = false">取消</el-button>
      <el-button @click="formatConfigText">格式化</el-button>
      <el-button type="primary" @click="confirmConfigText">应用配置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["particles", "basic", "style", "common"]);
const configDialogVisible = ref(false);
const configText = ref("");
const configError = ref("");

function syncConfigText() {
  configText.value = stringifyConfig(
    currentOperatingCanvasChild.value?.config || {},
  );
  configError.value = "";
}

function openConfigDialog() {
  syncConfigText();
  configDialogVisible.value = true;
}

function confirmConfigText() {
  try {
    const nextConfig = parseConfigText(configText.value);
    if (
      !nextConfig ||
      typeof nextConfig !== "object" ||
      Array.isArray(nextConfig)
    ) {
      configError.value = "配置必须是一个对象";
      return;
    }
    currentOperatingCanvasChild.value.config = nextConfig;
    configText.value = stringifyConfig(nextConfig);
    configError.value = "";
    configDialogVisible.value = false;
  } catch (error: any) {
    configError.value = error?.message || "配置解析失败";
  }
}

function formatConfigText() {
  try {
    configText.value = stringifyConfig(parseConfigText(configText.value));
    configError.value = "";
  } catch (error: any) {
    configError.value = error?.message || "配置解析失败";
  }
}

function parseConfigText(text: string) {
  const source = (text || "{}").trim();
  if (!source) return {};

  try {
    return JSON.parse(source);
  } catch {
    // Continue with JavaScript object literal parsing.
  }

  try {
    return Function(
      '"use strict";\n' +
        "const window = undefined, document = undefined, globalThis = undefined, global = undefined, process = undefined, require = undefined, importScripts = undefined, fetch = undefined, XMLHttpRequest = undefined;\n" +
        `return (${source});`,
    )();
  } catch (error: any) {
    throw new Error(
      error?.message ? `配置解析失败：${error.message}` : "配置解析失败",
    );
  }
}

function stringifyConfig(
  value: any,
  indent = 0,
  seen = new WeakSet<object>(),
): string {
  const space = "  ".repeat(indent);
  const nextSpace = "  ".repeat(indent + 1);

  if (value === null) return "null";

  const valueType = typeof value;
  if (valueType === "function") return value.toString();
  if (valueType === "string") return JSON.stringify(value);
  if (valueType === "number")
    return Number.isFinite(value) ? String(value) : "null";
  if (valueType === "boolean") return String(value);
  if (valueType === "undefined") return "undefined";

  if (typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (seen.has(value)) {
    return "undefined";
  }
  seen.add(value);

  if (Array.isArray(value)) {
    if (!value.length) {
      seen.delete(value);
      return "[]";
    }
    const items = value.map(
      (item) => `${nextSpace}${stringifyConfig(item, indent + 1, seen)}`,
    );
    seen.delete(value);
    return `[\n${items.join(",\n")}\n${space}]`;
  }

  const keys = Object.keys(value);
  if (!keys.length) {
    seen.delete(value);
    return "{}";
  }

  const entries = keys.map((key) => {
    const safeKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    return `${nextSpace}${safeKey}: ${stringifyConfig(value[key], indent + 1, seen)}`;
  });
  seen.delete(value);

  return `{\n${entries.join(",\n")}\n${space}}`;
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    syncConfigText();
    configError.value = "";
  },
  { immediate: true },
);
</script>

<style scoped>
.particles-config-editor {
  width: 100%;
}

.particles-config-container {
  height: calc(100vh - 142px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.particles-config-tips {
  flex-shrink: 0;
}

.particles-config-container :deep(.el-textarea),
.particles-config-container :deep(.el-textarea__inner) {
  flex: 1;
  min-height: 0;
  height: 100%;
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.particles-config-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
  flex-shrink: 0;
}
</style>
