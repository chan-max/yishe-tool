<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="source" title="代码">
      <operate-form-item>
        <template #name>源码</template>
        <template #content>
          <div class="code-block-source-editor">
            <div class="code-block-source-editor__toolbar">
              <el-popover
                v-model:visible="aiPopoverVisible"
                trigger="click"
                placement="right-start"
                width="340"
              >
                <div class="code-block-ai-popover">
                  <el-input
                    v-model="aiPrompt"
                    type="textarea"
                    :rows="4"
                    resize="vertical"
                    spellcheck="false"
                    :disabled="aiLoading"
                    placeholder="描述代码，例如：写一个 Vue 组合式函数，处理倒计时"
                    @keydown.enter.ctrl="generateCodeByAi"
                  ></el-input>

                  <div class="code-block-ai-popover__actions">
                    <el-button size="small" @click="aiPopoverVisible = false">取消</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      :loading="aiLoading"
                      :disabled="!aiPrompt.trim() || aiLoading"
                      @click="generateCodeByAi"
                    >
                      确定
                    </el-button>
                  </div>

                  <div v-if="aiError" class="code-block-error">{{ aiError }}</div>
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
              placeholder="const message = 'Hello Shiki'"
              class="code-block-source-editor__input"
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
        <template #name>语言</template>
        <template #content>
          <el-select
            v-model="currentOperatingCanvasChild.language"
            size="small"
            filterable
            allow-create
          >
            <el-option
              v-for="lang in CODE_BLOCK_LANGUAGES"
              :key="lang"
              :label="lang"
              :value="lang"
            ></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>主题</template>
        <template #content>
          <el-select
            v-model="currentOperatingCanvasChild.theme"
            size="small"
            filterable
            allow-create
          >
            <el-option
              v-for="theme in CODE_BLOCK_THEMES"
              :key="theme"
              :label="theme"
              :value="theme"
            ></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>文件名</template>
        <template #content>
          <el-input v-model="currentOperatingCanvasChild.filename" size="small" placeholder="example.ts"></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>显示项</template>
        <template #content>
          <div class="code-block-switches">
            <el-checkbox v-model="currentOperatingCanvasChild.showHeader" size="small">标题栏</el-checkbox>
            <el-checkbox v-model="currentOperatingCanvasChild.showLineNumbers" size="small">行号</el-checkbox>
            <el-checkbox v-model="currentOperatingCanvasChild.wrap" size="small">换行</el-checkbox>
          </div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operateItemFontSize
        label="代码字号"
        v-model="currentOperatingCanvasChild.fontSize"
      ></operateItemFontSize>
      <operateItemFontFamily
        label="代码字体"
        v-model="currentOperatingCanvasChild.fontFamilyInfo"
      ></operateItemFontFamily>
      <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor"></operateItemBackgroundColor>

      <operate-form-item>
        <template #name>行高</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.lineHeight"
            size="small"
            :min="0.8"
            :max="3"
            :step="0.05"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>内边距</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.padding.value"
            size="small"
            :min="0"
            :max="1000"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>圆角</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.borderRadius.value"
            size="small"
            :min="0"
            :max="1000"
          ></el-input-number>
        </template>
      </operate-form-item>
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
    title="编辑 Shiki Config"
    fullscreen
    append-to-body
    destroy-on-close
    class="code-block-config-dialog"
  >
    <div class="code-block-config-editor">
      <el-input
        v-model="configText"
        type="textarea"
        spellcheck="false"
        resize="none"
        placeholder="{ transformers: [] }"
      ></el-input>
      <div v-if="configError" class="code-block-error">{{ configError }}</div>
    </div>

    <template #footer>
      <el-button @click="configDialogVisible = false">取消</el-button>
      <el-button @click="formatConfigText">格式化</el-button>
      <el-button type="primary" @click="confirmConfigText">应用配置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import operateItemFontSize from '@/components/design/layout/canvas/operate/fontSize.vue'
import operateItemFontFamily from '@/components/design/layout/canvas/operate/fontFamily/fontFamily.vue'
import operateItemBackgroundColor from '@/components/design/layout/canvas/operate/backgroundColor.vue'
import { currentOperatingCanvasChild } from '../index.tsx'
import { CODE_BLOCK_LANGUAGES, CODE_BLOCK_THEMES } from '../children/codeBlock'
import { generateCodeBlockSource } from '../children/aiCodeBlockService'

const activeNames = ref(['source', 'basic', 'style', 'config', 'common'])
const aiPopoverVisible = ref(false)
const aiPrompt = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const configDialogVisible = ref(false)
const configText = ref('')
const configError = ref('')

function syncConfigText() {
  configText.value = stringifyConfig(currentOperatingCanvasChild.value?.config || {})
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

async function generateCodeByAi() {
  const prompt = aiPrompt.value.trim()
  if (!prompt || aiLoading.value) return

  aiLoading.value = true
  aiError.value = ''

  try {
    const result = await generateCodeBlockSource(
      prompt,
      currentOperatingCanvasChild.value?.language || 'text',
      currentOperatingCanvasChild.value?.source || '',
    )
    currentOperatingCanvasChild.value.source = result.source
    aiPrompt.value = ''
    aiPopoverVisible.value = false
  } catch (error: any) {
    aiError.value = error?.message || 'AI 生成失败，请重试'
  } finally {
    aiLoading.value = false
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    syncConfigText()
    aiError.value = ''
  },
  { immediate: true },
)
</script>

<style scoped>
.code-block-source-editor {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.code-block-source-editor__toolbar {
  display: flex;
  justify-content: flex-end;
}

.code-block-ai-popover {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-block-ai-popover__actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

.code-block-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}

.code-block-switches {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.code-block-source-editor__input :deep(.el-textarea__inner),
.code-block-config-editor :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.code-block-config-editor {
  height: calc(100vh - 142px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.code-block-config-editor :deep(.el-textarea),
.code-block-config-editor :deep(.el-textarea__inner) {
  flex: 1;
  min-height: 0;
  height: 100%;
}
</style>
