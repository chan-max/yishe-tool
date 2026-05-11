<template>
  <div class="ai-generate-panel">
    <div class="ai-generate-panel__header">
      <span class="ai-generate-panel__title">AI 设计助手</span>
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
        <div class="ai-generate-panel__section-title">描述你想要的设计</div>
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
        {{ processing ? 'AI 生成中...' : '生成设计' }}
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
  extractAiResponseText,
} from '@/operations'
import type { OperationResult } from '@/operations'

const quickTemplates = [
  { icon: '👕', label: 'T恤印花', prompt: '为 T恤前胸创建一个印花设计，主图案是一只简约线条猫，居中，大尺寸，黑底白线' },
  { icon: '☕', label: '马克杯', prompt: '为马克杯创建一个印花设计，写 "GOOD MORNING"，手写风格，棕色配米白背景' },
  { icon: '📱', label: '手机壳', prompt: '为手机壳创建一个后背设计，星空渐变背景，中间一个简约月亮图案' },
  { icon: '🎨', label: '海报设计', prompt: '创建一个 A3 海报设计，极简风格，黑底白字 "EXHIBITION"，大字号排版' },
  { icon: '🏷️', label: '贴纸', prompt: '创建一个圆形贴纸，红色背景，白色 "SALE 50%" 粗体大字居中' },
  { icon: '🛍️', label: '帆布袋', prompt: '为帆布袋创建正面印花设计，植物花卉线描插画，黑白线条风格，居中大面积' },
]

const placeholder = '描述产品和设计，例如：T恤前胸印花、马克杯印花设计、手机壳后背图案、海报设计、帆布袋印花... AI 会自动匹配正确的产品尺寸'

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

    const content = extractAiResponseText(response)

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
