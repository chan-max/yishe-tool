<template>
  <div class="ai-float-chat">
    <transition name="ai-chat-panel">
      <div v-if="open" class="ai-float-chat__panel">
        <div class="ai-float-chat__header">
          <span>AI 设计助手</span>
          <span v-if="processing" class="ai-float-chat__typing">生成中...</span>
          <el-button link size="small" @click="clearChat" class="ai-float-chat__clear-btn">
            <DeleteOutlined />
          </el-button>
        </div>

        <div class="ai-float-chat__messages" ref="messagesRef">
          <div v-if="messages.length === 0" class="ai-float-chat__empty">
            <div class="ai-float-chat__empty-icon">AI</div>
            <div>用一句话描述你想要的设计</div>
            <div class="ai-float-chat__quick-list">
              <div
                v-for="q in quickPrompts"
                :key="q.label"
                class="ai-float-chat__quick"
                @click="sendQuick(q.prompt)"
              >
                {{ q.label }}
              </div>
            </div>
          </div>

          <template v-for="(msg, i) in messages" :key="i">
            <div v-if="msg.role === 'user'" class="ai-float-chat__msg ai-float-chat__msg--user">
              <div class="ai-float-chat__bubble">{{ msg.content }}</div>
            </div>

            <div v-else class="ai-float-chat__msg ai-float-chat__msg--ai">
              <div class="ai-float-chat__bubble">
                <div v-if="msg.operations && msg.operations.length" class="ai-float-chat__ops">
                  <div
                    v-for="(op, j) in msg.operations"
                    :key="j"
                    class="ai-float-chat__op"
                    :class="{ 'ai-float-chat__op--ok': op.success, 'ai-float-chat__op--fail': !op.success }"
                  >
                    {{ op.success ? '✅' : '❌' }} {{ op.message }}
                  </div>
                </div>
                <div v-if="msg.text" class="ai-float-chat__text">{{ msg.text }}</div>
              </div>
            </div>
          </template>

          <div v-if="processing" class="ai-float-chat__msg ai-float-chat__msg--ai">
            <div class="ai-float-chat__bubble ai-float-chat__bubble--loading">
              <span class="ai-float-chat__dot"></span>
              <span class="ai-float-chat__dot"></span>
              <span class="ai-float-chat__dot"></span>
            </div>
          </div>
        </div>

        <div class="ai-float-chat__input-area">
          <div class="ai-float-chat__mode-bar">
            <el-radio-group v-model="designMode" size="small" :disabled="processing">
              <el-radio-button value="operation">逐步操作</el-radio-button>
              <el-radio-button value="direct">整体生成</el-radio-button>
            </el-radio-group>
          </div>
          <a-input
            v-model:value="inputText"
            :placeholder="designMode === 'direct' ? '描述你想生成的完整设计' : '描述设计，如：做一个粉色花卉贴纸'"
            :disabled="processing"
            @pressEnter="handleSend"
            allow-clear
          />
          <el-button
            type="primary"
            :icon="SendOutlined"
            :loading="processing"
            :disabled="!inputText.trim()"
            circle
            size="small"
            @click="handleSend"
          />
        </div>
      </div>
    </transition>

    <div
      class="ai-float-chat__trigger"
      @click="open = !open"
      :class="{ 'ai-float-chat__trigger--active': open }"
    >
      <div class="ai-float-chat__trigger-mark">
        <RobotOutlined />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { DeleteOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'
import {
  buildOperationsPrompt,
  parseOperationCalls,
  stripOperationBlocks,
  executeOperation,
  createDesignOperationContext,
  extractAiResponseText,
  buildDirectDesignPrompt,
  parseDirectDesignResult,
  validateDesignData,
  applyDesignToCanvas,
} from '@/operations'
import type { OperationResult } from '@/operations'
import { canvasStickerOptions } from '@/components/design/layout/canvas'

interface AiResultMsg {
  role: 'assistant'
  content: string
  text?: string
  operations?: OperationResult[]
}

type ChatMsg = AiResultMsg | { role: 'user'; content: string }

const open = ref(false)
const inputText = ref('')
const processing = ref(false)
const messages = ref<ChatMsg[]>([])
const messagesRef = ref<HTMLElement>()
const designMode = ref<'operation' | 'direct'>('operation')

const quickPrompts = [
  { label: '圆形贴纸', prompt: '创建一个圆形贴纸，红色背景，白色 "SALE 50%" 粗体大字居中' },
  { label: 'T恤印花', prompt: '为 T恤前胸创建一个印花设计，主图案是一只简约线条猫，居中，黑底白线' },
  { label: '马克杯', prompt: '为马克杯创建一个印花设计，写 "GOOD MORNING"，手写风格' },
  { label: '海报', prompt: '创建一个 A3 海报设计，极简风格，黑底白字 "EXHIBITION"' },
]

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function clearChat() {
  messages.value = []
}

function sendQuick(prompt: string) {
  inputText.value = prompt
  handleSend()
}

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || processing.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  processing.value = true
  scrollToBottom()

  try {
    if (designMode.value === 'direct') {
      await handleDirectDesign(text)
    } else {
      await handleOperationDesign(text)
    }
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      content: '',
      text: `请求失败: ${err?.message || '未知错误'}`,
    })
    message.error('AI 请求失败')
  } finally {
    processing.value = false
    scrollToBottom()
  }
}

async function handleDirectDesign(text: string) {
  const systemPrompt = buildDirectDesignPrompt(canvasStickerOptions.value)
  const response = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    responseFormat: { type: 'json_object' },
  })

  const content = extractAiResponseText(response)

  let designData: any = null

  try {
    const trimmed = content.trim()
    const firstBrace = trimmed.indexOf('{')
    if (firstBrace >= 0) {
      designData = JSON.parse(trimmed.slice(firstBrace))
    }
  } catch {
    designData = parseDirectDesignResult(content)
  }

  if (!designData) {
    messages.value.push({
      role: 'assistant',
      content,
      text: `⚠️ AI 未返回有效的设计 JSON。\n\nAI 回复内容：\n${content.slice(0, 500)}\n\n请尝试更明确的描述，例如："做一个粉色背景白色文字的贴纸，文字内容是"生日快乐""`,
    })
    return
  }

  const validation = validateDesignData(designData)
  if (!validation.valid) {
    messages.value.push({
      role: 'assistant',
      content,
      text: `⚠️ 设计数据校验失败：${validation.errors.join('；')}\n\n请重新描述你的设计需求。`,
    })
    return
  }

  applyDesignToCanvas(designData)

  messages.value.push({
    role: 'assistant',
    content,
    operations: [{ success: true, message: '已生成完整设计并应用到画布' }],
  })
  message.success('设计已生成并应用到画布')
}

async function handleOperationDesign(text: string) {
  const systemPrompt = buildOperationsPrompt()
  const response = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
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

  const displayText = stripOperationBlocks(content).trim()

  messages.value.push({
    role: 'assistant',
    content,
    text: displayText || (opResults.length > 0 ? undefined : '未识别到可执行的设计操作，请尝试更具体的描述'),
    operations: opResults.length > 0 ? opResults : undefined,
  })

  if (opResults.length > 0) {
    const allOk = opResults.every((r) => r.success)
    if (allOk) {
      message.success(`已执行 ${opResults.length} 个操作`)
    }
  }
}
</script>

<style lang="less" scoped>
.ai-float-chat {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ai-float-chat__trigger {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgba(102, 126, 234, 0.34);
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(246, 248, 255, 0.94));
  box-shadow: 0 14px 34px rgba(37, 47, 88, 0.18);
  color: #26315f;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.6);
    box-shadow: 0 18px 42px rgba(37, 47, 88, 0.24);
  }

  &--active {
    color: #fff;
    border-color: rgba(118, 75, 162, 0.36);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

.ai-float-chat__trigger-mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0;
  flex-shrink: 0;

  .ai-float-chat__trigger--active & {
    background: rgba(255, 255, 255, 0.18);
  }
}

.ai-float-chat__panel {
  position: absolute;
  bottom: 48px;
  left: 0;
  width: 360px;
  height: 480px;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  box-shadow: 0 22px 56px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-float-chat__header {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  color: #1f2937;
  font-size: 14px;
  font-weight: 700;
  gap: 8px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.92);
}

.ai-float-chat__typing {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.8;
}

.ai-float-chat__clear-btn {
  margin-left: auto;
  color: #64748b !important;

  &:hover {
    color: #1f2937 !important;
  }
}

.ai-float-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-float-chat__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 13px;
  gap: 12px;
}

.ai-float-chat__empty-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
}

.ai-float-chat__quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  max-width: 300px;
}

.ai-float-chat__quick {
  padding: 4px 10px;
  background: #f0f2f5;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;

  &:hover {
    background: #e8eaed;
  }
}

.ai-float-chat__msg {
  display: flex;

  &--user {
    justify-content: flex-end;
  }

  &--ai {
    justify-content: flex-start;
  }
}

.ai-float-chat__bubble {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;

  .ai-float-chat__msg--user & {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .ai-float-chat__msg--ai & {
    background: #f0f2f5;
    color: #333;
    border-bottom-left-radius: 4px;
  }
}

.ai-float-chat__text {
  white-space: pre-wrap;
}

.ai-float-chat__ops {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
}

.ai-float-chat__op {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);

  &--ok {
    color: #52c41a;
  }

  &--fail {
    color: #ff4d4f;
  }
}

.ai-float-chat__bubble--loading {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.ai-float-chat__dot {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes dotPulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.ai-float-chat__input-area {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--1s-border-color, #eee);
  flex-shrink: 0;

  :deep(.ant-input-affix-wrapper) {
    border-radius: 18px;
    font-size: 13px;
    flex: 1;
    min-width: 0;
  }
}

.ai-float-chat__mode-bar {
  width: 100%;
  margin-bottom: 2px;

  :deep(.el-radio-group) {
    width: 100%;
  }

  :deep(.el-radio-button) {
    flex: 1;
  }

  :deep(.el-radio-button__inner) {
    width: 100%;
    font-size: 12px;
    padding: 4px 0;
  }
}

.ai-float-chat-panel-enter-active,
.ai-float-chat-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.ai-float-chat-panel-enter-from,
.ai-float-chat-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
