<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="source" title="源码">
      <operate-form-item>
        <template #name>Mermaid</template>
        <template #content>
          <div class="mermaid-source-editor">
            <div class="mermaid-source-editor__toolbar">
              <el-popover
                v-model:visible="aiPopoverVisible"
                trigger="click"
                placement="right-start"
                width="340"
              >
                <div class="mermaid-ai-popover">
                  <el-input
                    v-model="aiPrompt"
                    type="textarea"
                    :rows="4"
                    resize="vertical"
                    spellcheck="false"
                    :disabled="aiLoading"
                    placeholder="描述图表，例如：生成一个 AI 绘图流程图，包含输入、模型、审核、输出"
                    @keydown.enter.ctrl="generateSourceByAi"
                  ></el-input>

                  <div class="mermaid-ai-popover__actions">
                    <el-button size="small" @click="aiPopoverVisible = false">取消</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      :loading="aiLoading"
                      :disabled="!aiPrompt.trim() || aiLoading"
                      @click="generateSourceByAi"
                    >
                      确定
                    </el-button>
                  </div>

                  <div v-if="aiError" class="mermaid-error">{{ aiError }}</div>
                </div>

                <template #reference>
                  <el-button size="small" type="primary" plain>AI</el-button>
                </template>
              </el-popover>
            </div>

            <el-input
              v-model="currentOperatingCanvasChild.source"
              type="textarea"
              :rows="10"
              resize="vertical"
              spellcheck="false"
              placeholder="flowchart TD&#10;  A[开始] --> B[完成]"
              class="mermaid-source-editor__input"
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

      <operate-form-item>
        <template #name>主题</template>
        <template #content>
          <el-select v-model="mermaidConfig.theme" size="small">
            <el-option label="Default" value="default"></el-option>
            <el-option label="Base" value="base"></el-option>
            <el-option label="Dark" value="dark"></el-option>
            <el-option label="Forest" value="forest"></el-option>
            <el-option label="Neutral" value="neutral"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor"></operateItemBackgroundColor>
    </el-collapse-item>

    <el-collapse-item name="config" title="Config">
      <operate-form-item>
        <template #name>原生配置</template>
        <template #content>
          <el-button size="small" type="primary" @click="openConfigDialog">编辑配置</el-button>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>

  <el-dialog
    v-model="configDialogVisible"
    title="编辑 Mermaid Config"
    fullscreen
    append-to-body
    destroy-on-close
    class="mermaid-config-dialog"
  >
    <div class="mermaid-config-editor">
      <div class="mermaid-config-editor__toolbar">
        <el-popover
          v-model:visible="configAiPopoverVisible"
          trigger="click"
          placement="right-start"
          width="360"
        >
          <div class="mermaid-ai-popover">
            <el-input
              v-model="configAiPrompt"
              type="textarea"
              :rows="4"
              resize="vertical"
              spellcheck="false"
              :disabled="configAiLoading"
              placeholder="描述配置风格，例如：白底蓝紫科技风，文字大一些，线条更粗"
              @keydown.enter.ctrl="generateConfigByAi"
            ></el-input>

            <div class="mermaid-ai-popover__actions">
              <el-button size="small" @click="configAiPopoverVisible = false">取消</el-button>
              <el-button
                size="small"
                type="primary"
                :loading="configAiLoading"
                :disabled="!configAiPrompt.trim() || configAiLoading"
                @click="generateConfigByAi"
              >
                确定
              </el-button>
            </div>

            <div v-if="configAiError" class="mermaid-error">{{ configAiError }}</div>
          </div>

          <template #reference>
            <el-button size="small" type="primary" plain>AI 生成配置</el-button>
          </template>
        </el-popover>
      </div>

      <el-input
        v-model="configText"
        type="textarea"
        spellcheck="false"
        resize="none"
        placeholder="{ theme: 'base', themeVariables: { fontSize: '28px' } }"
      ></el-input>
      <div v-if="configError" class="mermaid-error">{{ configError }}</div>
    </div>

    <template #footer>
      <el-button @click="configDialogVisible = false">取消</el-button>
      <el-button @click="formatConfigText">格式化</el-button>
      <el-button type="primary" @click="confirmConfigText">应用配置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import operateItemBackgroundColor from '@/components/design/layout/canvas/operate/backgroundColor.vue'
import { canvasStickerOptionsOnlyChild, currentOperatingCanvasChild } from '../index.tsx'
import { formatSizeOptionToPixelValue } from '../helper'
import { generateMermaidConfig, generateMermaidSource } from '../children/aiMermaidService'

const activeNames = ref(['source', 'basic', 'config', 'common'])
const aiPopoverVisible = ref(false)
const aiPrompt = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const configDialogVisible = ref(false)
const configText = ref('')
const configError = ref('')
const configAiPopoverVisible = ref(false)
const configAiPrompt = ref('')
const configAiLoading = ref(false)
const configAiError = ref('')

const mermaidConfig = computed(() => {
  const child = currentOperatingCanvasChild.value
  if (!child.config || typeof child.config !== 'object' || Array.isArray(child.config)) {
    child.config = {}
  }
  if (!child.config.theme) {
    child.config.theme = 'default'
  }
  return child.config
})

function syncConfigText() {
  configText.value = stringifyConfig(mermaidConfig.value || {})
  configError.value = ''
}

function openConfigDialog() {
  syncConfigText()
  configDialogVisible.value = true
}

function confirmConfigText() {
  try {
    const nextConfig = parseConfigText(configText.value)
    if (!nextConfig || typeof nextConfig !== 'object' || Array.isArray(nextConfig)) {
      configError.value = 'Config 必须是一个对象'
      return
    }
    currentOperatingCanvasChild.value.config = nextConfig
    configText.value = stringifyConfig(nextConfig)
    configError.value = ''
    configDialogVisible.value = false
  } catch (error: any) {
    configError.value = error?.message || '配置解析失败'
  }
}

function formatConfigText() {
  try {
    configText.value = stringifyConfig(parseConfigText(configText.value))
    configError.value = ''
  } catch (error: any) {
    configError.value = error?.message || '配置解析失败'
  }
}

function parseConfigText(text: string) {
  const source = (text || '{}').trim()
  if (!source) return {}

  try {
    return JSON.parse(source)
  } catch {
    // Continue with JavaScript object literal parsing.
  }

  try {
    return Function(
      '"use strict";\n' +
      'const window = undefined, document = undefined, globalThis = undefined, global = undefined, process = undefined, require = undefined, importScripts = undefined, fetch = undefined, XMLHttpRequest = undefined;\n' +
      `return (${source});`,
    )()
  } catch (error: any) {
    throw new Error(error?.message ? `配置解析失败：${error.message}` : '配置解析失败')
  }
}

function stringifyConfig(value: any, indent = 0, seen = new WeakSet<object>()): string {
  const space = '  '.repeat(indent)
  const nextSpace = '  '.repeat(indent + 1)

  if (value === null) return 'null'

  const valueType = typeof value
  if (valueType === 'function') return value.toString()
  if (valueType === 'string') return JSON.stringify(value)
  if (valueType === 'number') return Number.isFinite(value) ? String(value) : 'null'
  if (valueType === 'boolean') return String(value)
  if (valueType === 'undefined') return 'undefined'

  if (typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (seen.has(value)) {
    return 'undefined'
  }
  seen.add(value)

  if (Array.isArray(value)) {
    if (!value.length) {
      seen.delete(value)
      return '[]'
    }
    const items = value.map((item) => `${nextSpace}${stringifyConfig(item, indent + 1, seen)}`)
    seen.delete(value)
    return `[\n${items.join(',\n')}\n${space}]`
  }

  const keys = Object.keys(value)
  if (!keys.length) {
    seen.delete(value)
    return '{}'
  }

  const entries = keys.map((key) => {
    const safeKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)
    return `${nextSpace}${safeKey}: ${stringifyConfig(value[key], indent + 1, seen)}`
  })
  seen.delete(value)

  return `{\n${entries.join(',\n')}\n${space}}`
}

async function generateSourceByAi() {
  const prompt = aiPrompt.value.trim()
  if (!prompt || aiLoading.value) return

  aiLoading.value = true
  aiError.value = ''

  try {
    const canvasChild = canvasStickerOptionsOnlyChild.value
    const mermaidChild = currentOperatingCanvasChild.value
    const result = await generateMermaidSource(prompt, mermaidChild?.source || '', {
      canvasWidth: Number(canvasChild?.width?.value),
      canvasHeight: Number(canvasChild?.height?.value),
      unit: canvasChild?.width?.unit || 'px',
      elementWidth: Number(formatSizeOptionToPixelValue(mermaidChild?.width)),
      elementHeight: Number(formatSizeOptionToPixelValue(mermaidChild?.height)),
    })
    currentOperatingCanvasChild.value.source = result.source
    aiPrompt.value = ''
    aiPopoverVisible.value = false
  } catch (error: any) {
    aiError.value = error?.message || 'AI 生成失败，请重试'
  } finally {
    aiLoading.value = false
  }
}

async function generateConfigByAi() {
  const prompt = configAiPrompt.value.trim()
  if (!prompt || configAiLoading.value) return

  configAiLoading.value = true
  configAiError.value = ''

  try {
    const canvasChild = canvasStickerOptionsOnlyChild.value
    const mermaidChild = currentOperatingCanvasChild.value
    let currentConfig = mermaidConfig.value || {}
    try {
      currentConfig = parseConfigText(configText.value)
      configError.value = ''
    } catch (error: any) {
      configError.value = error?.message || '当前配置解析失败，AI 已基于已应用配置生成'
    }

    const result = await generateMermaidConfig(prompt, mermaidChild?.source || '', currentConfig, {
      canvasWidth: Number(canvasChild?.width?.value),
      canvasHeight: Number(canvasChild?.height?.value),
      unit: canvasChild?.width?.unit || 'px',
      elementWidth: Number(formatSizeOptionToPixelValue(mermaidChild?.width)),
      elementHeight: Number(formatSizeOptionToPixelValue(mermaidChild?.height)),
    })

    currentOperatingCanvasChild.value.config = result.config
    configText.value = stringifyConfig(result.config)
    configError.value = ''
    configAiPrompt.value = ''
    configAiPopoverVisible.value = false
  } catch (error: any) {
    configAiError.value = error?.message || 'AI 生成失败，请重试'
  } finally {
    configAiLoading.value = false
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    syncConfigText()
    aiError.value = ''
    configAiError.value = ''
  },
  { immediate: true },
)
</script>

<style scoped>
.mermaid-source-editor {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mermaid-source-editor__toolbar {
  display: flex;
  justify-content: flex-end;
}

.mermaid-ai-popover {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mermaid-ai-popover__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.mermaid-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}

.mermaid-source-editor__input :deep(.el-textarea__inner),
.mermaid-config-editor :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.mermaid-config-editor {
  height: calc(100vh - 142px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.mermaid-config-editor__toolbar {
  display: flex;
  justify-content: flex-start;
}

.mermaid-config-editor :deep(.el-textarea),
.mermaid-config-editor :deep(.el-textarea__inner) {
  flex: 1;
  min-height: 0;
  height: 100%;
}
</style>
