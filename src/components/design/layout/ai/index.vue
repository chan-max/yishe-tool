<template>
  <div class="ai-generate-panel">
    <div class="ai-generate-panel__header">
      <span class="ai-generate-panel__title">AI 生成贴纸</span>
      <el-button link size="small" @click="isAiPanelOpen = false">
        <CloseOutlined />
      </el-button>
    </div>

    <div class="ai-generate-panel__body">
      <div class="ai-generate-panel__section">
        <div class="ai-generate-panel__section-title">快捷模板</div>
        <div class="ai-generate-panel__templates">
          <div
            v-for="tpl in quickTemplates"
            :key="tpl.label"
            class="ai-generate-panel__template"
            @click="handleTemplate(tpl)"
          >
            <span class="ai-generate-panel__template-icon">{{ tpl.icon }}</span>
            <span class="ai-generate-panel__template-label">{{ tpl.label }}</span>
          </div>
        </div>
      </div>

      <div class="ai-generate-panel__section">
        <div class="ai-generate-panel__section-title">描述你想要的贴纸</div>
        <a-textarea
          v-model:value="inputText"
          :rows="4"
          :placeholder="placeholder"
          :disabled="processing"
          allow-clear
        />
      </div>

      <a-button
        type="primary"
        block
        size="large"
        :loading="processing"
        :disabled="!inputText.trim()"
        @click="handleGenerate"
      >
        {{ processing ? 'AI 生成中...' : '生成贴纸' }}
      </a-button>

      <div v-if="results.length > 0" class="ai-generate-panel__section">
        <div class="ai-generate-panel__section-title">执行结果</div>
        <div class="ai-generate-panel__results">
          <div
            v-for="(r, i) in results"
            :key="i"
            class="ai-generate-panel__result"
            :class="{ 'ai-generate-panel__result--ok': r.success, 'ai-generate-panel__result--fail': !r.success }"
          >
            <span>{{ r.success ? '✅' : '❌' }}</span>
            <span>{{ r.message }}</span>
          </div>
        </div>
      </div>

      <div v-if="aiResponse" class="ai-generate-panel__section">
        <div class="ai-generate-panel__section-title">AI 回复</div>
        <div class="ai-generate-panel__ai-reply">{{ aiResponse }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { isAiPanelOpen } from '@/ai/store'
import { aiText } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'
import {
  buildOperationsPrompt,
  parseOperationCalls,
  stripOperationBlocks,
  executeOperation,
  createDesignOperationContext,
} from '@/operations'
import type { OperationResult } from '@/operations'

const quickTemplates = [
  { icon: '🎯', label: '简约标题', prompt: '创建一个简约风格的贴纸，画布 1000x1000，白色背景，主文字写 "HELLO"，黑色粗体大字，居中显示' },
  { icon: '🎂', label: '生日快乐', prompt: '做一个粉色生日快乐贴纸，画布 1000x1000，粉色背景，主文字 "生日快乐" 紫色大字居中，副文字 "Happy Birthday" 白色小字' },
  { icon: '💪', label: '加油励志', prompt: '创建一个黑色背景的励志贴纸，画布 1000x1000，主文字 "加油" 红色粗体特大字居中' },
  { icon: '🎉', label: '节日庆祝', prompt: '做一个节日庆祝贴纸，画布 1000x1000，黄色背景，主文字 "新年快乐" 红色大字居中，副文字 "2026" 黑色中等字' },
  { icon: '🔥', label: '爆款推荐', prompt: '创建一个潮流风格贴纸，画布 1000x1000，黑色背景，主文字 "爆款" 白色粗体大字居中，副文字 "HOT" 红色小字' },
  { icon: '🏷️', label: '促销标签', prompt: '做一个促销标签贴纸，画布 1000x1000，红色背景，主文字 "限时特惠" 白色大字居中，副文字 "全场五折" 白色中等字' },
]

const placeholder = '例如：做一个写着"加油"的红色励志贴纸，黑色背景，白色粗体大字居中'

const inputText = ref('')
const processing = ref(false)
const results = ref<OperationResult[]>([])
const aiResponse = ref('')

function handleTemplate(tpl: { prompt: string }) {
  inputText.value = tpl.prompt
  handleGenerate()
}

async function handleGenerate() {
  const text = inputText.value.trim()
  if (!text || processing.value) return

  processing.value = true
  results.value = []
  aiResponse.value = ''

  try {
    const systemPrompt = buildOperationsPrompt()

    const response = await aiText({
      featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
      prompt: text,
      systemPrompt,
    })

    const rawContent = response?.choices?.[0]?.message?.content || ''
    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)

    const opCalls = parseOperationCalls(content)
    const opResults: OperationResult[] = []

    if (opCalls.length > 0) {
      const ctx = createDesignOperationContext()
      for (const call of opCalls) {
        const result = await executeOperation(call.op, call.params, ctx)
        opResults.push(result)
      }
    }

    results.value = opResults

    const displayContent = stripOperationBlocks(content)
    if (displayContent) {
      aiResponse.value = displayContent
    }

    if (opResults.length > 0) {
      const allOk = opResults.every((r) => r.success)
      if (allOk) {
        message.success(`生成完成，共执行 ${opResults.length} 个操作`)
      } else {
        const failCount = opResults.filter((r) => !r.success).length
        message.warning(`部分操作失败: ${failCount} 个`)
      }
    } else {
      message.info('AI 未返回操作指令')
    }
  } catch (err: any) {
    message.error('AI 请求失败: ' + (err?.message || '未知错误'))
  } finally {
    processing.value = false
  }
}
</script>

<style lang="less" scoped>
.ai-generate-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--1s-surface-background);
  color: var(--1s-text-color);
}

.ai-generate-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--1s-border-color);
  flex-shrink: 0;
}

.ai-generate-panel__title {
  font-size: 14px;
  font-weight: 600;
}

.ai-generate-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-generate-panel__section-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--1s-text-color-secondary);
  margin-bottom: 6px;
}

.ai-generate-panel__templates {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
}

.ai-generate-panel__template {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: var(--1s-elevated-background);
  border: 1px solid var(--1s-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--1s-accent-color);
    background: var(--1s-accent-color-soft);
  }
}

.ai-generate-panel__template-icon {
  font-size: 20px;
}

.ai-generate-panel__template-label {
  font-size: 11px;
  color: var(--1s-text-color);
  white-space: nowrap;
}

.ai-generate-panel__results {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-generate-panel__result {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;

  &--ok {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
  }

  &--fail {
    background: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }
}

.ai-generate-panel__ai-reply {
  padding: 8px 12px;
  background: var(--1s-elevated-background);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--1s-text-color-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
