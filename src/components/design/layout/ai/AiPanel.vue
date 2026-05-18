<template>
  <div v-if="open" class="ai-panel" :class="{ minimized: isMinimized }">
    <!-- 头部 -->
    <div class="panel-header">
      <div class="header-left">
        <span class="header-icon">🎨</span>
        <span class="header-title">AI 设计助手</span>
      </div>
      <div class="header-right">
        <button class="header-btn" @click="isMinimized = !isMinimized" :title="isMinimized ? '展开' : '最小化'">
          {{ isMinimized ? '□' : '—' }}
        </button>
        <button class="header-btn" @click="clearChat" title="清空对话">
          🗑️
        </button>
        <button class="header-btn close-btn" @click="$emit('close')" title="关闭">
          ✕
        </button>
      </div>
    </div>

    <!-- 最小化时不显示内容 -->
    <template v-if="!isMinimized">
      <!-- 消息区域 -->
      <div class="messages-container" ref="messagesRef">
        <!-- 欢迎页 -->
        <div v-if="messages.length === 0" class="welcome">
          <div class="welcome-icon">🎨</div>
          <h3>AI 设计助手</h3>
          <p>描述你想要的设计，我会帮你创建</p>

          <div class="quick-actions">
            <div class="quick-title">快速开始</div>
            <div
              v-for="q in quickPrompts"
              :key="q.label"
              class="quick-item"
              @click="sendQuick(q.prompt)"
            >
              <span class="quick-icon">{{ q.icon }}</span>
              <span>{{ q.label }}</span>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div v-else class="messages-list">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message', `message--${msg.role}`]"
          >
            <!-- 用户消息 -->
            <template v-if="msg.role === 'user'">
              <div class="message-bubble user-bubble">
                {{ msg.content }}
              </div>
            </template>

            <!-- AI 消息 -->
            <template v-if="msg.role === 'assistant'">
              <div class="message-header">
                <span class="ai-avatar">AI</span>
                <span class="ai-name">设计助手</span>
              </div>
              <div class="message-bubble ai-bubble">
                <div v-if="msg.content" class="message-text">
                  {{ msg.content }}
                </div>
                <div v-if="msg.tool_calls?.length" class="tool-calls">
                  <div
                    v-for="call in msg.tool_calls"
                    :key="call.id"
                    class="tool-call"
                  >
                    <span class="tool-icon">⚡</span>
                    <span>{{ formatToolName(call.function.name) }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- 工具结果 -->
            <template v-if="msg.role === 'tool'">
              <div class="tool-result">
                <span
                  :class="parseResult(msg.content).success ? 'success' : 'error'"
                >
                  {{ parseResult(msg.content).success ? "✓" : "✗" }}
                </span>
                <span>{{ parseResult(msg.content).message }}</span>
              </div>
            </template>
          </div>

          <!-- 加载状态 -->
          <div v-if="isProcessing" class="message message--assistant">
            <div class="message-header">
              <span class="ai-avatar">AI</span>
              <span class="ai-name">设计助手</span>
            </div>
            <div class="message-bubble ai-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <button class="stop-btn" @click="handleStop">
                ⏹ 停止
              </button>
            </div>
          </div>

          <!-- 用户交互区域 -->
          <div v-if="interactionData" class="interaction-section">
            <div class="interaction-header">
              <span class="ai-avatar">AI</span>
              <span class="ai-name">需要你的选择</span>
            </div>
            <div class="interaction-content">
              <div class="interaction-question">
                {{ interactionData.question }}
              </div>

              <div
                v-if="interactionData.options?.length"
                class="interaction-options"
              >
                <div
                  v-for="opt in interactionData.options"
                  :key="opt"
                  class="option-btn"
                  @click="submitInteraction(opt)"
                >
                  {{ opt }}
                </div>
              </div>

              <div v-if="interactionData.options?.length" class="divider-text">
                或者
              </div>

              <div class="interaction-input">
                <input
                  v-model="customAnswer"
                  class="custom-input"
                  placeholder="输入你的回答..."
                  @keydown.enter="submitInteraction(customAnswer)"
                />
                <button
                  class="send-interaction-btn"
                  @click="submitInteraction(customAnswer)"
                  :disabled="!customAnswer.trim()"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <textarea
            v-model="inputText"
            class="message-input"
            placeholder="描述你想要的设计... (Ctrl+Enter 发送)"
            :disabled="isProcessing"
            @keydown="handleKeydown"
            rows="3"
          />
          <div class="input-footer">
            <span class="input-hint">Ctrl+Enter 发送</span>
            <div class="input-actions">
              <button
                v-if="isProcessing"
                class="action-btn stop-action"
                @click="handleStop"
              >
                ⏹ 停止
              </button>
              <button
                class="action-btn send-action"
                :disabled="!inputText.trim() || isProcessing"
                @click="handleSend"
              >
                发送 ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from "vue";
import { designAgent } from "@/ai/langgraph";
import type { AgentInteraction } from "@/ai/langgraph";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Agent
const agent = designAgent;

// 状态
const inputText = ref("");
const messagesRef = ref<HTMLElement>();
const customAnswer = ref("");
const isMinimized = ref(false);

// 计算属性
const messages = computed(() => agent.state.messages);
const isProcessing = computed(() => agent.isProcessing.value);
const interactionData = computed(() => agent.state.pendingInteraction);

// 快捷提示
const quickPrompts = [
  {
    icon: "🔴",
    label: "圆形贴纸",
    prompt: '创建一个圆形贴纸，红色背景，白色 "SALE 50%" 粗体大字居中',
  },
  {
    icon: "👕",
    label: "T恤印花",
    prompt:
      "为 T恤前胸创建一个印花设计，主图案是一只简约线条猫，居中，黑底白线",
  },
  {
    icon: "☕",
    label: "马克杯",
    prompt: '为马克杯创建一个印花设计，写 "GOOD MORNING"，手写风格',
  },
  {
    icon: "🎨",
    label: "海报设计",
    prompt: '创建一个 A3 海报设计，极简风格，黑底白字 "EXHIBITION"',
  },
];

// 监听事件
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = agent.onEvent((event) => {
    scrollToBottom();
  });
});

onUnmounted(() => {
  unsubscribe?.();
});

// 处理键盘事件
function handleKeydown(e: KeyboardEvent) {
  // Ctrl+Enter 或 Cmd+Enter 发送
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    handleSend();
    return;
  }
  // 普通 Enter 不拦截，允许换行
}

// 发送消息
function handleSend() {
  const text = inputText.value.trim();
  if (!text || isProcessing.value) return;
  agent.chat(text);
  inputText.value = "";
  scrollToBottom();
}

// 停止处理
function handleStop() {
  agent.clearMessages();
}

// 快捷发送
function sendQuick(prompt: string) {
  inputText.value = prompt;
  handleSend();
}

// 清空对话
function clearChat() {
  agent.clearMessages();
}

// 提交交互
function submitInteraction(answer: string) {
  if (!answer.trim()) return;
  agent.submitUserResponse(answer.trim());
  customAnswer.value = "";
}

// 格式化工具名称
function formatToolName(name: string): string {
  const map: Record<string, string> = {
    get_canvas_state: "查看画布",
    add_text: "添加文字",
    add_rect: "添加矩形",
    set_background: "设置背景",
    canvas_smartSize: "设置尺寸",
    ask_choice: "询问用户",
    request_feedback: "请求反馈",
  };
  return map[name] || name;
}

// 解析结果
function parseResult(content: string) {
  try {
    const parsed = JSON.parse(content);
    return {
      success: parsed.success !== false,
      message: parsed.message || (parsed.success ? "成功" : "失败"),
    };
  } catch {
    return { success: true, message: content };
  }
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
}

watch(() => messages.value.length, scrollToBottom);
</script>

<style lang="less" scoped>
.ai-panel {
  position: fixed;
  top: 60px;
  right: 16px;
  bottom: 16px;
  width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;

  &.minimized {
    height: 56px;
    bottom: auto;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 20px;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.close-btn:hover {
    background: rgba(255, 0, 0, 0.4);
  }
}

// 消息容器
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

// 欢迎页
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
}

.welcome-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.welcome h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.welcome p {
  color: #666;
  font-size: 13px;
  margin-bottom: 24px;
}

.quick-actions {
  width: 100%;
  max-width: 280px;
}

.quick-title {
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
  text-align: left;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;

  &:hover {
    background: #e8eaed;
  }
}

.quick-icon {
  font-size: 16px;
}

// 消息列表
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  &--user {
    display: flex;
    justify-content: flex-end;
  }

  &--assistant {
    display: flex;
    flex-direction: column;
  }
}

.message-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.ai-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.message-bubble {
  max-width: 90%;
  padding: 10px 14px;
  border-radius: 10px;
  line-height: 1.5;
  font-size: 13px;

  &.user-bubble {
    background: #667eea;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  &.ai-bubble {
    background: #f5f7fa;
    border-bottom-left-radius: 4px;
  }
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.tool-calls {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e8e8e8;
}

.tool-call {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: #fff;
  border-radius: 4px;
  font-size: 11px;
  color: #666;
}

.tool-icon {
  font-size: 12px;
}

.tool-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #666;

  .success {
    color: #52c41a;
  }
  .error {
    color: #ff4d4f;
  }
}

// 打字指示器
.typing-indicator {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #999;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.stop-btn {
  width: 100%;
  padding: 6px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;

  &:hover {
    background: #ff7875;
  }
}

// 交互区域
.interaction-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}

.interaction-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e8e8e8;
}

.interaction-content {
  padding: 12px;
}

.interaction-question {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
}

.interaction-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.option-btn {
  padding: 10px 12px;
  background: #f5f7fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  font-size: 13px;

  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
    color: #667eea;
  }
}

.divider-text {
  text-align: center;
  color: #999;
  font-size: 11px;
  margin: 8px 0;
}

.interaction-input {
  display: flex;
  gap: 8px;
}

.custom-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #667eea;
  }
}

.send-interaction-btn {
  padding: 8px 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;

  &:hover {
    background: #5a6fd6;
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
}

// 输入区域
.input-area {
  flex-shrink: 0;
  padding: 12px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
}

.input-wrapper {
  background: #f5f7fa;
  border-radius: 10px;
  overflow: hidden;
}

.message-input {
  width: 100%;
  padding: 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #999;
  }

  &:disabled {
    opacity: 0.6;
  }
}

.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}

.input-hint {
  font-size: 11px;
  color: #999;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &.send-action {
    background: #667eea;
    color: #fff;

    &:hover:not(:disabled) {
      background: #5a6fd6;
    }

    &:disabled {
      background: #d9d9d9;
      cursor: not-allowed;
    }
  }

  &.stop-action {
    background: #ff4d4f;
    color: #fff;

    &:hover {
      background: #ff7875;
    }
  }
}
</style>
