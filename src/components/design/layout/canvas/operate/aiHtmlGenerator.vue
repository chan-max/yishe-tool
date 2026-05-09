<template>
  <div class="ai-html-gen">
    <el-radio-group v-model="mode" size="small" class="ai-html-gen__mode-switch">
      <el-radio-button value="generate">全新生成</el-radio-button>
      <el-radio-button value="modify">修改模板</el-radio-button>
      <el-radio-button value="bindings" :disabled="!hasBindings">改变量</el-radio-button>
    </el-radio-group>

    <div class="ai-html-gen__history" v-if="history.length">
      <div
        v-for="(item, index) in history"
        :key="index"
        class="ai-html-gen__history-item"
      >
        <div class="ai-html-gen__history-prompt">
          <span class="ai-html-gen__history-label">{{ modeLabelMap[item.mode] }}</span>
          {{ item.prompt }}
        </div>
        <el-button
          size="small"
          text
          type="primary"
          @click="redoItem(item)"
          class="ai-html-gen__history-redo"
        >
          重做
        </el-button>
      </div>
    </div>

    <div class="ai-html-gen__input-area">
      <el-input
        v-model="userInput"
        type="textarea"
        :rows="3"
        :placeholder="placeholderMap[mode]"
        resize="vertical"
        :disabled="loading"
        @keydown.enter.ctrl="handleExecute"
      />

      <div class="ai-html-gen__buttons">
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!userInput.trim() || loading"
          @click="handleExecute"
        >
          {{ executeLabel }}
        </el-button>
      </div>
    </div>

    <div v-if="error" class="ai-html-gen__error">
      <span>{{ error }}</span>
      <el-button size="small" type="primary" link @click="error = ''">关闭</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AiHtmlMode } from '@/components/design/layout/canvas/htmlTemplate/aiHtmlService'
import { generateHtml, modifyHtml, modifyBindings } from '@/components/design/layout/canvas/htmlTemplate/aiHtmlService'
import { ensureHtmlTemplateOptions } from '@/components/design/layout/canvas/htmlTemplate/runtime'

const props = defineProps<{
  modelValue: any
}>()

interface HistoryItem {
  prompt: string
  mode: AiHtmlMode
}

const mode = ref<AiHtmlMode>('generate')
const userInput = ref('')
const loading = ref(false)
const error = ref('')
const history = ref<HistoryItem[]>([])

const modeLabelMap: Record<AiHtmlMode, string> = {
  generate: '生成',
  modify: '修改',
  bindings: '变量',
}

const placeholderMap: Record<AiHtmlMode, string> = {
  generate: '描述你想生成的 HTML，例如：做一个圆形徽章，红色背景写着 SALE',
  modify: '描述你想做的修改，例如：把背景改成蓝色，字体加大',
  bindings: '描述变量调整，例如：标题改成"限时特惠"，主色改成红色',
}

const hasBindings = computed(() => {
  const target = props.modelValue
  if (!target) return false
  ensureHtmlTemplateOptions(target)
  return !!(target.htmlTemplateFields?.length || target.htmlBindings && Object.keys(target.htmlBindings).length > 0)
})

const executeLabel = computed(() => {
  const map: Record<AiHtmlMode, string> = {
    generate: history.value.length ? '重新生成' : '生成',
    modify: '执行修改',
    bindings: '更新变量',
  }
  return map[mode.value]
})

async function handleExecute() {
  const prompt = userInput.value.trim()
  if (!prompt) return

  loading.value = true
  error.value = ''

  try {
    const target = props.modelValue
    const currentHtml = target?.htmlContent || ''

    if (mode.value === 'generate') {
      const result = await generateHtml(prompt)
      if (target) {
        target.htmlContent = result.html
      }
    } else if (mode.value === 'modify') {
      if (!currentHtml) {
        throw new Error('当前没有 HTML 内容，请先生成或选择一个模板')
      }
      const result = await modifyHtml(currentHtml, prompt)
      if (result.unchanged) {
        if (hasBindings.value) {
          const bindResult = await modifyBindings(currentHtml, target.htmlBindings || {}, prompt)
          if (target) {
            Object.entries(bindResult.bindings).forEach(([key, value]) => {
              const segments = key.split('.')
              let cursor: any = target.htmlBindings
              segments.forEach((seg, i) => {
                if (i === segments.length - 1) {
                  cursor[seg] = value
                } else {
                  if (!cursor[seg] || typeof cursor[seg] !== 'object') {
                    cursor[seg] = {}
                  }
                  cursor = cursor[seg]
                }
              })
            })
          }
        } else {
          throw new Error('AI 未能做出有效修改，请尝试更具体的描述，或切换到「全新生成」模式')
        }
      } else if (target) {
        target.htmlContent = result.html
      }
    } else if (mode.value === 'bindings') {
      if (!currentHtml) {
        throw new Error('当前没有 HTML 内容')
      }
      ensureHtmlTemplateOptions(target)
      const currentBindings = target.htmlBindings || {}
      const result = await modifyBindings(currentHtml, currentBindings, prompt)
      if (target) {
        Object.entries(result.bindings).forEach(([key, value]) => {
          const segments = key.split('.')
          let cursor: any = target.htmlBindings
          segments.forEach((seg, i) => {
            if (i === segments.length - 1) {
              cursor[seg] = value
            } else {
              if (!cursor[seg] || typeof cursor[seg] !== 'object') {
                cursor[seg] = {}
              }
              cursor = cursor[seg]
            }
          })
        })
      }
    }

    history.value.push({ prompt, mode: mode.value })
    userInput.value = ''
  } catch (e: any) {
    error.value = e?.message || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

function redoItem(item: HistoryItem) {
  mode.value = item.mode
  userInput.value = item.prompt
  handleExecute()
}
</script>

<style scoped lang="less">
.ai-html-gen {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__mode-switch {
    width: 100%;
    display: flex;

    :deep(.el-radio-button) {
      flex: 1;

      .el-radio-button__inner {
        width: 100%;
        padding: 6px 0;
        font-size: 12px;
      }
    }
  }

  &__history {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 150px;
    overflow-y: auto;
    padding: 2px 0;
  }

  &__history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--1s-hover-background);
    font-size: 11px;
  }

  &__history-prompt {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--1s-text-color);
  }

  &__history-label {
    font-size: 10px;
    color: var(--1s-primary-color);
    margin-right: 4px;
    flex-shrink: 0;
  }

  &__history-redo {
    flex-shrink: 0;
    font-size: 11px;
  }

  &__input-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__buttons {
    display: flex;
    gap: 8px;
  }

  &__error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 4px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    font-size: 12px;
    color: #dc2626;
  }
}
</style>
