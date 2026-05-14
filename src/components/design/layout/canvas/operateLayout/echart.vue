<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="ai" title="AI 生成">
      <div class="echart-ai-generator">
        <el-input
          v-model="aiPrompt"
          type="textarea"
          :rows="4"
          resize="vertical"
          spellcheck="false"
          :disabled="aiLoading"
          placeholder="描述你想生成的图表，例如：生成一个粉色主题的月度销售折线图，包含 6 个月数据"
          @keydown.enter.ctrl="generateOptionByAi"
        ></el-input>

        <div class="echart-ai-generator__actions">
          <el-button
            size="small"
            type="primary"
            :loading="aiLoading"
            :disabled="!aiPrompt.trim() || aiLoading"
            @click="generateOptionByAi"
          >
            生成配置
          </el-button>
          <el-button
            size="small"
            :disabled="aiLoading || !hasOption"
            @click="openOptionDialog"
          >
            查看 JSON
          </el-button>
        </div>

        <div v-if="aiError" class="echart-option-error">{{ aiError }}</div>
      </div>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>

      <operate-form-item>
        <template #name>渲染器</template>
        <template #content>
          <el-select v-model="echartsOptions.renderer" size="small">
            <el-option label="Canvas" value="canvas"></el-option>
            <el-option label="SVG" value="svg"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>主题</template>
        <template #content>
          <el-input v-model="echartsOptions.theme" size="small" placeholder="默认主题"></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="option" title="Option">
      <operate-form-item>
        <template #name>JSON 配置</template>
        <template #content>
          <el-button size="small" type="primary" @click="openOptionDialog">编辑配置</el-button>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>

  <el-dialog
    v-model="optionDialogVisible"
    title="编辑 ECharts Option"
    fullscreen
    append-to-body
    destroy-on-close
    class="echart-option-dialog"
  >
    <div class="echart-option-editor">
      <el-input
        v-model="optionText"
        type="textarea"
        spellcheck="false"
        resize="none"
        placeholder="{ title: { text: '销量趋势' }, xAxis: {}, yAxis: {}, series: [] }"
      ></el-input>
      <div v-if="optionError" class="echart-option-error">{{ optionError }}</div>
    </div>

    <template #footer>
      <el-button @click="optionDialogVisible = false">取消</el-button>
      <el-button @click="formatOptionText">格式化</el-button>
      <el-button type="primary" @click="confirmOptionText">应用配置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { computed, ref, watch } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import { canvasStickerOptionsOnlyChild, currentOperatingCanvasChild } from '../index.tsx'
import {
  ensureEchartOptions,
} from '../children/echart/index.tsx'
import { generateEchartOption } from '../children/echart/aiEchartService'

const activeNames = ref(['ai', 'basic', 'option', 'common'])
const optionText = ref('')
const optionError = ref('')
const optionDialogVisible = ref(false)
const aiPrompt = ref('')
const aiLoading = ref(false)
const aiError = ref('')

const echartsOptions = computed(() => {
  return ensureEchartOptions(currentOperatingCanvasChild.value)
})

const hasOption = computed(() => {
  const option = echartsOptions.value.option
  return !!(option && typeof option === 'object' && Object.keys(option).length)
})

function syncOptionText() {
  optionText.value = stringifyOption(echartsOptions.value.option || {})
  optionError.value = ''
}

function openOptionDialog() {
  syncOptionText()
  optionDialogVisible.value = true
}

function confirmOptionText() {
  try {
    const nextOption = parseOptionText(optionText.value)
    if (!nextOption || typeof nextOption !== 'object' || Array.isArray(nextOption)) {
      optionError.value = 'Option 必须是一个 JSON 对象'
      return
    }
    echartsOptions.value.option = nextOption
    optionText.value = stringifyOption(nextOption)
    optionError.value = ''
    optionDialogVisible.value = false
  } catch (error: any) {
    optionError.value = error?.message || '配置解析失败'
  }
}

function formatOptionText() {
  try {
    optionText.value = stringifyOption(parseOptionText(optionText.value))
    optionError.value = ''
  } catch (error: any) {
    optionError.value = error?.message || '配置解析失败'
  }
}

function parseOptionText(text: string) {
  const source = (text || '{}').trim()
  if (!source) return {}

  try {
    return JSON.parse(source)
  } catch {
    // Continue with JavaScript object literal parsing.
  }

  try {
    return Function(
      'echarts',
      'echart',
      '"use strict";\n' +
      'const window = undefined, document = undefined, globalThis = undefined, global = undefined, process = undefined, require = undefined, importScripts = undefined, fetch = undefined, XMLHttpRequest = undefined;\n' +
      `return (${source});`,
    )(echarts, echarts)
  } catch (error: any) {
    throw new Error(error?.message ? `配置解析失败：${error.message}` : '配置解析失败')
  }
}

function stringifyOption(value: any, indent = 0, seen = new WeakSet<object>()): string {
  const space = '  '.repeat(indent)
  const nextSpace = '  '.repeat(indent + 1)

  if (value === null) return 'null'

  const valueType = typeof value
  if (valueType === 'function') return value.toString()
  if (valueType === 'string') return JSON.stringify(value)
  if (valueType === 'number') return Number.isFinite(value) ? String(value) : 'null'
  if (valueType === 'boolean') return String(value)
  if (valueType === 'undefined') return 'undefined'
  if (valueType === 'bigint') return `${value.toString()}n`

  if (value instanceof Date) {
    return `new Date(${JSON.stringify(value.toISOString())})`
  }

  if (value instanceof RegExp) {
    return value.toString()
  }

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
    const items = value.map((item) => `${nextSpace}${stringifyOption(item, indent + 1, seen)}`)
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
    return `${nextSpace}${safeKey}: ${stringifyOption(value[key], indent + 1, seen)}`
  })
  seen.delete(value)

  return `{\n${entries.join(',\n')}\n${space}}`
}

async function generateOptionByAi() {
  const prompt = aiPrompt.value.trim()
  if (!prompt || aiLoading.value) return

  aiLoading.value = true
  aiError.value = ''

  try {
    const canvasChild = canvasStickerOptionsOnlyChild.value
    const result = await generateEchartOption(prompt, echartsOptions.value.option || {}, {
      width: Number(canvasChild?.width?.value),
      height: Number(canvasChild?.height?.value),
      unit: canvasChild?.width?.unit || 'px',
    })
    echartsOptions.value.option = result.option
    optionText.value = stringifyOption(result.option)
    aiPrompt.value = ''
  } catch (error: any) {
    aiError.value = error?.message || 'AI 生成失败，请重试'
  } finally {
    aiLoading.value = false
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    syncOptionText()
    aiError.value = ''
  },
  { immediate: true },
)

watch(
  () => echartsOptions.value.option,
  syncOptionText,
  { deep: true },
)
</script>

<style scoped>
.echart-ai-generator {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 0 10px;
}

.echart-ai-generator__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.echart-option-editor {
  height: calc(100vh - 142px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.echart-option-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}

.echart-option-editor :deep(.el-textarea),
.echart-option-editor :deep(.el-textarea__inner) {
  height: 100%;
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}
</style>
