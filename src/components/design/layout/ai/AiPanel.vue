<template>
  <div v-if="open || isOpen" class="ai-panel" :class="{ minimized: isMinimized }">
    <!-- 头部 -->
    <div class="panel-header">
      <div class="header-left">
        <span class="header-icon">🎨</span>
        <span class="header-title">AI 设计助手</span>
      </div>
      <div class="header-right">
        <button class="header-btn" @click="handleSelfTest" title="自测：截图评估+自动迭代" :disabled="isProcessing">
          🔬
        </button>
        <button class="header-btn" @click="copyChatLog" title="复制对话日志">
          📋
        </button>
        <button class="header-btn" @click="isMinimized = !isMinimized" :title="isMinimized ? '展开' : '最小化'">
          {{ isMinimized ? '□' : '—' }}
        </button>
        <button class="header-btn" @click="clearChat" title="清空对话">
          🗑️
        </button>
        <button class="header-btn close-btn" @click="handleClose" title="关闭">
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
          <!-- 调试模式开关 -->
          <div class="debug-toggle">
            <label class="debug-switch">
              <input type="checkbox" v-model="debugMode">
              <span class="debug-label">🔍 调试模式</span>
            </label>
          </div>

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
                <span v-if="debugMode && msg.meta?.iteration" class="iteration-badge">
                  第{{ msg.meta.iteration }}轮
                </span>
                <span v-if="debugMode && msg.meta?.duration" class="duration-badge">
                  {{ msg.meta.duration }}ms
                </span>
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
                
                <!-- 调试面板：AI 消息详情 -->
                <div v-if="debugMode" class="debug-panel">
                  <div class="debug-header" @click="msg._showDebug = !msg._showDebug">
                    <span>{{ msg._showDebug ? '▼' : '▶' }} 调试详情</span>
                  </div>
                  <div v-if="msg._showDebug" class="debug-content">
                    <div v-if="msg.tool_calls?.length" class="debug-section">
                      <div class="debug-title">工具调用：</div>
                      <div v-for="call in msg.tool_calls" :key="call.id" class="debug-item">
                        <div class="debug-name">{{ call.function.name }}</div>
                        <pre class="debug-json">{{ formatJson(call.function.arguments) }}</pre>
                      </div>
                    </div>
                    <div v-if="msg.meta?.llmResponse" class="debug-section">
                      <div class="debug-title">LLM 响应：</div>
                      <pre class="debug-json">{{ formatJson(msg.meta.llmResponse) }}</pre>
                    </div>
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
                <span v-if="debugMode && msg.meta?.duration" class="tool-duration">
                  {{ msg.meta.duration }}ms
                </span>
              </div>
              
              <!-- 调试面板：工具详情 -->
              <div v-if="debugMode" class="debug-panel tool-debug">
                <div class="debug-header" @click="msg._showDebug = !msg._showDebug">
                  <span>{{ msg._showDebug ? '▼' : '▶' }} 工具详情</span>
                </div>
                <div v-if="msg._showDebug" class="debug-content">
                  <div v-if="msg.tool_name" class="debug-section">
                    <div class="debug-title">工具名称：</div>
                    <div class="debug-value">{{ msg.tool_name }}</div>
                  </div>
                  <div v-if="msg.meta?.toolArgs" class="debug-section">
                    <div class="debug-title">调用参数：</div>
                    <pre class="debug-json">{{ formatJson(msg.meta.toolArgs) }}</pre>
                  </div>
                  <div v-if="msg.meta?.toolResult" class="debug-section">
                    <div class="debug-title">执行结果：</div>
                    <pre class="debug-json">{{ formatJson(msg.meta.toolResult) }}</pre>
                  </div>
                </div>
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
        <!-- 图片预览 -->
        <div v-if="selectedImage" class="image-preview">
          <img :src="selectedImage.preview" alt="预览" />
          <div class="image-info">
            <span class="image-name">{{ selectedImage.name }}</span>
            <button class="remove-image" @click="removeImage">✕</button>
          </div>
        </div>
        
        <div class="input-wrapper">
          <textarea
            v-model="inputText"
            class="message-input"
            :placeholder="isWaitingForUser ? '请输入您的选择...' : selectedImage ? '描述你想要的效果，或直接发送分析图片...' : '描述你想要的设计... (Ctrl+Enter 发送)'"
            :disabled="isProcessing && !isWaitingForUser"
            @keydown="handleKeydown"
            rows="3"
          />
          <div class="input-footer">
            <div class="input-left-actions">
              <button class="action-btn image-action" @click="triggerImageUpload" title="上传图片分析">
                📷
              </button>
              <input
                ref="imageInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleImageUpload"
              />
              <span class="input-hint">Ctrl+Enter 发送</span>
            </div>
            <div class="input-actions">
              <button
                v-if="isProcessing && !isWaitingForUser"
                class="action-btn stop-action"
                @click="handleStop"
              >
                ⏹ 停止
              </button>
              <button
                class="action-btn send-action"
                :disabled="(!inputText.trim() && !selectedImage) || (isProcessing && !isWaitingForUser)"
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
import { useLocalStorage } from "@vueuse/core";
import { designAgent } from "@/ai/langgraph";
import type { AgentInteraction } from "@/ai/langgraph";

// 使用 useLocalStorage 缓存显示状态
const isOpen = useLocalStorage("_1s_ai_panel_open", false);

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

// 同步外部 open 状态到本地
watch(() => props.open, (val) => {
  isOpen.value = val;
});

// 关闭时更新本地状态
const handleClose = () => {
  isOpen.value = false;
  emit("close");
};

// Agent
const agent = designAgent;

// 状态
const inputText = ref("");
const messagesRef = ref<HTMLElement>();
const customAnswer = ref("");
const isMinimized = ref(false);
const debugMode = ref(false);  // 调试模式开关
const imageInputRef = ref<HTMLInputElement>();  // 图片上传 input 引用
const selectedImage = ref<{  // 选中的图片
  file: File;
  preview: string;  // base64
  name: string;
} | null>(null);

// 计算属性
const messages = computed(() => agent.state.messages);
const isProcessing = computed(() => agent.isProcessing.value);
const isWaitingForUser = computed(() => agent.isWaitingForUser.value);
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
  
  // 如果有图片，发送图片分析
  if (selectedImage.value) {
    const imageData = selectedImage.value.preview;
    const userMessage = text || "请分析这张图片的设计风格，然后创建一个类似的设计";
    
    // 调用 agent 的图片分析功能
    agent.chatWithImage(userMessage, imageData);
    
    inputText.value = "";
    selectedImage.value = null;
    scrollToBottom();
    return;
  }
  
  if (!text) return;
  
  // 如果 agent 在等待用户响应，直接提交
  if (isWaitingForUser.value) {
    agent.submitUserResponse(text);
    inputText.value = "";
    scrollToBottom();
    return;
  }
  
  // 如果 agent 在处理中，忽略
  if (isProcessing.value) return;
  
  agent.chat(text);
  inputText.value = "";
  scrollToBottom();
}

// 停止处理
function handleStop() {
  agent.clearMessages();
}

// 自测
function handleSelfTest() {
  if (isProcessing.value) return;
  agent.selfTest();
  scrollToBottom();
}

// 触发图片上传
function triggerImageUpload() {
  imageInputRef.value?.click();
}

// 处理图片上传
function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 检查文件大小（限制 10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert("图片大小不能超过 10MB");
    return;
  }

  // 转为 base64
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImage.value = {
      file,
      preview: e.target?.result as string,
      name: file.name,
    };
  };
  reader.readAsDataURL(file);
  
  // 清空 input 以便重复选择同一文件
  input.value = "";
}

// 移除选中的图片
function removeImage() {
  selectedImage.value = null;
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

// 格式化 JSON（用于调试面板）
function formatJson(data: any): string {
  if (!data) return "null";
  if (typeof data === "string") {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }
  return JSON.stringify(data, null, 2);
}

// 复制对话日志
function copyChatLog() {
  const logLines: string[] = [];
  const timestamp = new Date().toLocaleString();
  
  logLines.push("=".repeat(60));
  logLines.push(`AI 对话日志`);
  logLines.push(`导出时间: ${timestamp}`);
  logLines.push(`消息总数: ${messages.value.length}`);
  logLines.push("=".repeat(60));
  logLines.push("");

  for (const msg of messages.value) {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const iteration = msg.meta?.iteration ? ` [第${msg.meta.iteration}轮]` : "";
    const duration = msg.meta?.duration ? ` (${msg.meta.duration}ms)` : "";
    
    // 消息头
    logLines.push(`--- ${msg.role.toUpperCase()}${iteration} | ${time}${duration} ---`);
    
    // 消息内容
    if (msg.content) {
      logLines.push(`内容: ${msg.content}`);
    }
    
    // 工具调用
    if (msg.tool_calls?.length) {
      logLines.push(`工具调用:`);
      for (const call of msg.tool_calls) {
        logLines.push(`  - ${call.function.name}`);
        try {
          const args = typeof call.function.arguments === "string" 
            ? JSON.parse(call.function.arguments) 
            : call.function.arguments;
          logLines.push(`    参数: ${JSON.stringify(args, null, 4).split("\n").join("\n    ")}`);
        } catch {
          logLines.push(`    参数: ${call.function.arguments}`);
        }
      }
    }
    
    // 工具结果
    if (msg.role === "tool") {
      logLines.push(`工具: ${msg.tool_name}`);
      if (msg.meta?.toolArgs) {
        logLines.push(`调用参数: ${JSON.stringify(msg.meta.toolArgs, null, 2)}`);
      }
      if (msg.meta?.toolResult) {
        logLines.push(`执行结果: ${JSON.stringify(msg.meta.toolResult, null, 2)}`);
      } else {
        logLines.push(`原始内容: ${msg.content}`);
      }
    }
    
    // 调试信息
    if (msg.meta?.llmResponse) {
      logLines.push(`LLM 响应: ${JSON.stringify(msg.meta.llmResponse, null, 2)}`);
    }
    
    logLines.push("");
  }

  // 复制到剪贴板
  const logText = logLines.join("\n");
  navigator.clipboard.writeText(logText).then(() => {
    // 显示成功提示
    const btn = document.querySelector('[title="复制对话日志"]');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = "✓";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }
  }).catch((err) => {
    console.error("复制失败:", err);
    // 降级方案：创建临时 textarea
    const textarea = document.createElement("textarea");
    textarea.value = logText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  });
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

// 调试模式相关样式
.debug-toggle {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

.debug-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #666;

  input[type="checkbox"] {
    cursor: pointer;
  }

  .debug-label {
    user-select: none;
  }
}

.iteration-badge {
  display: inline-block;
  padding: 2px 6px;
  background: #667eea;
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 8px;
}

.duration-badge {
  display: inline-block;
  padding: 2px 6px;
  background: #52c41a;
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 4px;
}

.tool-duration {
  display: inline-block;
  padding: 2px 6px;
  background: #faad14;
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 8px;
}

.debug-panel {
  margin-top: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
  background: #fafafa;

  &.tool-debug {
    margin-left: 24px;
    margin-top: 4px;
    border-color: #f0d0d0;
  }
}

.debug-header {
  padding: 6px 10px;
  background: #f0f0f0;
  cursor: pointer;
  font-size: 11px;
  color: #666;
  user-select: none;

  &:hover {
    background: #e8e8e8;
  }
}

.debug-content {
  padding: 8px 10px;
  font-size: 11px;
}

.debug-section {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.debug-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.debug-name {
  font-weight: 500;
  color: #667eea;
  margin-bottom: 4px;
}

.debug-value {
  color: #333;
  word-break: break-all;
}

.debug-json {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 6px 8px;
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

// 图片预览样式
.image-preview {
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;

  img {
    width: 100%;
    max-height: 150px;
    object-fit: contain;
    display: block;
  }

  .image-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    background: #f0f0f0;
    font-size: 11px;
    color: #666;
  }

  .image-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 8px;
  }

  .remove-image {
    width: 20px;
    height: 20px;
    border: none;
    background: #ff4d4f;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    flex-shrink: 0;

    &:hover {
      background: #ff7875;
    }
  }
}

// 输入左侧操作区
.input-left-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

// 图片上传按钮
.image-action {
  background: transparent;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
}
</style>
