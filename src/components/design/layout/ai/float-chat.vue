<template>
  <div class="ai-float-chat">
    <transition name="ai-chat-panel">
      <div v-if="open" class="ai-float-chat__panel">
        <div class="ai-float-chat__header">
          <span>AI 设计助手</span>
          <span v-if="isProcessing" class="ai-float-chat__typing"
            >思考中...</span
          >
          <el-button
            link
            size="small"
            @click="clearChat"
            class="ai-float-chat__clear-btn"
          >
            <DeleteOutlined />
          </el-button>
        </div>

        <div class="ai-float-chat__messages" ref="messagesRef">
          <!-- 调试信息 -->
          <div
            style="
              background: #f0f0f0;
              padding: 8px;
              font-size: 12px;
              margin-bottom: 8px;
            "
          >
            调试: messages.length = {{ messages.length }}
          </div>

          <!-- 欢迎页 -->
          <div v-if="messages.length === 0" class="ai-float-chat__empty">
            <div class="ai-float-chat__empty-icon">🎨</div>
            <div>描述你想要的设计，我会帮你创建</div>
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

          <!-- 消息列表 -->
          <template v-for="msg in messages" :key="msg.id">
            <!-- 调试：显示每条消息 -->
            <div
              style="
                background: #e8f5e9;
                padding: 4px 8px;
                font-size: 11px;
                margin: 4px 0;
              "
            >
              [{{ msg.role }}] {{ msg.content?.substring(0, 50) }}...
            </div>

            <!-- 用户消息 -->
            <div
              v-if="msg.role === 'user'"
              class="ai-float-chat__msg ai-float-chat__msg--user"
            >
              <div class="ai-float-chat__bubble">{{ msg.content }}</div>
            </div>

            <!-- AI 消息 -->
            <div
              v-if="msg.role === 'assistant'"
              class="ai-float-chat__msg ai-float-chat__msg--ai"
            >
              <div class="ai-float-chat__bubble">
                <div v-if="msg.content" class="ai-float-chat__text">
                  {{ msg.content }}
                </div>
                <div v-if="msg.tool_calls?.length" class="ai-float-chat__tools">
                  <el-tag
                    v-for="call in msg.tool_calls"
                    :key="call.id"
                    size="small"
                    type="info"
                  >
                    🔧 {{ formatToolName(call.function.name) }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 工具结果 -->
            <div
              v-if="msg.role === 'tool'"
              class="ai-float-chat__msg ai-float-chat__msg--tool"
            >
              <div class="ai-float-chat__tool-result">
                <span
                  :class="
                    parseResult(msg.content).success ? 'success' : 'error'
                  "
                >
                  {{ parseResult(msg.content).success ? "✓" : "✗" }}
                </span>
                {{ parseResult(msg.content).message }}
              </div>
            </div>
          </template>

          <!-- 加载状态 -->
          <div
            v-if="isProcessing"
            class="ai-float-chat__msg ai-float-chat__msg--ai"
          >
            <div class="ai-float-chat__bubble ai-float-chat__bubble--loading">
              <span class="ai-float-chat__dot"></span>
              <span class="ai-float-chat__dot"></span>
              <span class="ai-float-chat__dot"></span>
            </div>
          </div>
        </div>

        <!-- 人工介入弹窗 -->
        <el-dialog
          v-model="showInteraction"
          :title="interactionData?.question || '请选择'"
          width="360px"
          :close-on-click-modal="false"
          append-to-body
        >
          <div
            v-if="interactionData?.options?.length"
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
          <el-divider v-if="interactionData?.options?.length">或者</el-divider>
          <el-input
            v-model="customAnswer"
            placeholder="输入你的回答..."
            @keydown.enter="submitInteraction(customAnswer)"
          />
          <template #footer>
            <el-button
              type="primary"
              :disabled="!customAnswer.trim()"
              @click="submitInteraction(customAnswer)"
            >
              确定
            </el-button>
          </template>
        </el-dialog>

        <!-- 输入区域 -->
        <div class="ai-float-chat__input-area">
          <el-input
            v-model="inputText"
            placeholder="描述你想要的设计..."
            :disabled="isProcessing"
            @keydown.enter.exact.prevent="handleSend"
            clearable
          />
          <el-button
            type="primary"
            :loading="isProcessing"
            :disabled="!inputText.trim()"
            @click="handleSend"
            circle
            size="small"
          >
            <template #icon>
              <SendOutlined />
            </template>
          </el-button>
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
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from "vue";
import {
  DeleteOutlined,
  RobotOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { designAgent } from "@/ai/langgraph";
import type { AgentInteraction } from "@/ai/langgraph";

// Agent
const agent = designAgent;

// 状态
const open = ref(false);
const inputText = ref("");
const messagesRef = ref<HTMLElement>();
const showInteraction = ref(false);
const interactionData = ref<AgentInteraction | null>(null);
const customAnswer = ref("");

// 计算属性 - 直接使用 agent.state.messages
const messages = computed(() => agent.state.messages);
const isProcessing = computed(() => agent.isProcessing.value);

// 快捷提示
const quickPrompts = [
  {
    label: "圆形贴纸",
    prompt: '创建一个圆形贴纸，红色背景，白色 "SALE 50%" 粗体大字居中',
  },
  {
    label: "T恤印花",
    prompt:
      "为 T恤前胸创建一个印花设计，主图案是一只简约线条猫，居中，黑底白线",
  },
  {
    label: "马克杯",
    prompt: '为马克杯创建一个印花设计，写 "GOOD MORNING"，手写风格',
  },
  {
    label: "海报",
    prompt: '创建一个 A3 海报设计，极简风格，黑底白字 "EXHIBITION"',
  },
];

// 监听事件
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = agent.onEvent((event) => {
    if (event.type === "interaction") {
      interactionData.value = event.data;
      showInteraction.value = true;
      customAnswer.value = "";
    }
    scrollToBottom();
  });
});

onUnmounted(() => {
  unsubscribe?.();
});

// 发送消息
function handleSend() {
  const text = inputText.value.trim();
  if (!text || isProcessing.value) return;
  agent.chat(text);
  inputText.value = "";
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
  showInteraction.value = false;
  customAnswer.value = "";
}

// 格式化工具名称
function formatToolName(name: string): string {
  const map: Record<string, string> = {
    get_canvas_state: "查看画布",
    add_text: "添加文字",
    add_rect: "添加矩形",
    set_background: "设置背景",
    ask_choice: "询问",
    request_feedback: "反馈",
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
.ai-float-chat {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 10000;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.ai-float-chat__trigger {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgba(102, 126, 234, 0.34);
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.96),
    rgba(246, 248, 255, 0.94)
  );
  box-shadow: 0 14px 34px rgba(37, 47, 88, 0.18);
  color: #26315f;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
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
  flex-shrink: 0;

  .ai-float-chat__trigger--active & {
    background: rgba(255, 255, 255, 0.18);
  }
}

.ai-float-chat__panel {
  position: absolute;
  bottom: 48px;
  left: 0;
  width: 380px;
  height: 520px;
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
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 24px;
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

  &--tool {
    justify-content: center;
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

.ai-float-chat__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.ai-float-chat__tool-result {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 11px;
  color: #666;

  .success {
    color: #52c41a;
  }
  .error {
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

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

.ai-float-chat__input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--1s-border-color, #eee);
  flex-shrink: 0;
}

// 交互选项
.interaction-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.option-btn {
  padding: 10px 14px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  font-size: 13px;

  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }
}

// 动画
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
