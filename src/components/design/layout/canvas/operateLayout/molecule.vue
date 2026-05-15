<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="source" title="分子结构">
      <operate-form-item>
        <template #name>输入类型</template>
        <template #content>
          <el-select
            v-model="currentOperatingCanvasChild.inputType"
            size="small"
          >
            <el-option label="SMILES" value="smiles"></el-option>
            <el-option label="MolBlock" value="molblock"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>源码</template>
        <template #content>
          <div class="molecule-source-editor">
            <div class="molecule-source-editor__toolbar">
              <el-popover
                v-model:visible="aiPopoverVisible"
                trigger="click"
                placement="right-start"
                width="340"
              >
                <div class="molecule-ai-popover">
                  <el-input
                    v-model="aiPrompt"
                    type="textarea"
                    :rows="4"
                    resize="vertical"
                    spellcheck="false"
                    :disabled="aiLoading"
                    placeholder="描述分子，例如：阿司匹林、苯环、咖啡因"
                    @keydown.enter.ctrl="generateMoleculeByAi"
                  ></el-input>

                  <div class="molecule-ai-popover__actions">
                    <el-button size="small" @click="aiPopoverVisible = false"
                      >取消</el-button
                    >
                    <el-button
                      size="small"
                      type="primary"
                      :loading="aiLoading"
                      :disabled="!aiPrompt.trim() || aiLoading"
                      @click="generateMoleculeByAi"
                    >
                      确定
                    </el-button>
                  </div>

                  <div v-if="aiError" class="molecule-error">{{ aiError }}</div>
                </div>

                <template #reference>
                  <el-button size="small" type="primary" plain
                    >AI 生成 SMILES</el-button
                  >
                </template>
              </el-popover>
            </div>

            <el-input
              v-model="currentOperatingCanvasChild.source"
              type="textarea"
              :rows="6"
              resize="vertical"
              spellcheck="false"
              :placeholder="
                currentOperatingCanvasChild.inputType === 'molblock'
                  ? '粘贴 MolBlock 格式...'
                  : 'c1ccccc1 (苯)'
              "
              class="molecule-source-editor__input"
            ></el-input>
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

    <el-collapse-item name="config" title="Draw Options">
      <operate-form-item>
        <template #name>渲染配置</template>
        <template #content>
          <el-button size="small" type="primary" @click="openConfigDialog"
            >编辑配置</el-button
          >
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>

  <el-dialog
    v-model="configDialogVisible"
    title="编辑 RDKit Draw Options"
    fullscreen
    append-to-body
    destroy-on-close
    class="molecule-config-dialog"
  >
    <div class="molecule-config-editor">
      <el-input
        v-model="configText"
        type="textarea"
        spellcheck="false"
        resize="none"
        placeholder='{"width":350,"height":350}'
      ></el-input>
      <div v-if="configError" class="molecule-error">{{ configError }}</div>
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
import { generateMoleculeSmiles } from "../children/aiMoleculeService";

const activeNames = ref(["source", "basic", "style", "config", "common"]);
const aiPopoverVisible = ref(false);
const aiPrompt = ref("");
const aiLoading = ref(false);
const aiError = ref("");
const configDialogVisible = ref(false);
const configText = ref("");
const configError = ref("");

function syncConfigText() {
  configText.value = stringifyConfig(
    currentOperatingCanvasChild.value?.drawOptions || {},
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
      configError.value = "Draw Options 必须是一个对象";
      return;
    }
    currentOperatingCanvasChild.value.drawOptions = nextConfig;
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

async function generateMoleculeByAi() {
  const prompt = aiPrompt.value.trim();
  if (!prompt || aiLoading.value) return;

  aiLoading.value = true;
  aiError.value = "";

  try {
    const result = await generateMoleculeSmiles(
      prompt,
      currentOperatingCanvasChild.value?.source || "",
    );
    currentOperatingCanvasChild.value.source = result.smiles;
    aiPrompt.value = "";
    aiPopoverVisible.value = false;
  } catch (error: any) {
    aiError.value = error?.message || "AI 生成失败，请重试";
  } finally {
    aiLoading.value = false;
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    syncConfigText();
    aiError.value = "";
  },
  { immediate: true },
);
</script>

<style scoped>
.molecule-source-editor {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.molecule-source-editor__toolbar {
  display: flex;
  justify-content: flex-end;
}

.molecule-ai-popover {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.molecule-ai-popover__actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

.molecule-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}

.molecule-source-editor__input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.molecule-config-editor {
  height: calc(100vh - 142px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.molecule-config-editor :deep(.el-textarea),
.molecule-config-editor :deep(.el-textarea__inner) {
  flex: 1;
  min-height: 0;
  height: 100%;
}
</style>
