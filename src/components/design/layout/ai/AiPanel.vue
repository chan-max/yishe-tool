<template>
  <div
    v-if="open || isOpen"
    ref="panelRef"
    class="ai-panel"
    :class="{ 'is-dragging': isDragging }"
    :style="panelPosition.x >= 0 ? { left: panelPosition.x + 'px', top: panelPosition.y + 'px', right: 'auto' } : {}"
  >
    <!-- Header -->
    <div class="ai-panel__header" @mousedown="onDragStart">
      <span class="ai-panel__title">AI 设计</span>
      <span v-if="isProcessing" class="ai-panel__status">思考中</span>
      <span v-if="planProgress" class="ai-panel__plan">{{ planProgress.done }}/{{ planProgress.total }}</span>
      <div class="ai-panel__header-actions">
        <button class="ai-panel__icon-btn" @click="handleSelfTest" :disabled="isProcessing" title="自测">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </button>
        <button class="ai-panel__icon-btn" @click="clearChat" title="清空">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
        </button>
        <button class="ai-panel__icon-btn" @click="handleClose" title="关闭">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- Progress -->
    <div v-if="planProgress" class="ai-panel__progress">
      <div class="ai-panel__progress-bar" :style="{ width: (planProgress.done / planProgress.total * 100) + '%' }"></div>
    </div>

    <!-- Messages -->
    <div class="ai-panel__messages" ref="messagesRef">
      <!-- Empty -->
      <div v-if="messages.length === 0" class="ai-panel__empty">
        <p class="ai-panel__empty-text">描述你想要的设计</p>
        <div class="ai-panel__quick">
          <button v-for="q in quickPrompts" :key="q.label" class="ai-panel__quick-btn" @click="sendQuick(q.prompt)">
            {{ q.label }}
          </button>
        </div>
      </div>

      <!-- Messages list -->
      <template v-for="msg in messages" :key="msg.id">
        <!-- User -->
        <div v-if="msg.role === 'user'" class="ai-panel__msg ai-panel__msg--user">
          {{ msg.content }}
        </div>
        <!-- AI -->
        <div v-if="msg.role === 'assistant'" class="ai-panel__msg ai-panel__msg--ai">
          <div v-if="msg.content" class="ai-panel__msg-text">{{ msg.content }}</div>
          <div v-if="msg.tool_calls?.length" class="ai-panel__tool-calls">
            <span v-for="call in msg.tool_calls" :key="call.id" class="ai-panel__tool-tag">
              {{ formatToolName(call.function.name) }}
            </span>
          </div>
        </div>
        <!-- Tool result -->
        <div v-if="msg.role === 'tool'" class="ai-panel__tool-result">
          {{ parseResult(msg.content).message }}
        </div>
      </template>

      <!-- Loading -->
      <div v-if="isProcessing" class="ai-panel__msg ai-panel__msg--ai">
        <div class="ai-panel__dots">
          <span></span><span></span><span></span>
        </div>
        <button v-if="!isWaitingForUser" class="ai-panel__stop-btn" @click="handleStop">停止</button>
      </div>

      <!-- Interaction -->
      <div v-if="interactionData" class="ai-panel__interaction">
        <div class="ai-panel__interaction-q">{{ interactionData.question }}</div>
        <div v-if="interactionData.options?.length" class="ai-panel__interaction-opts">
          <button v-for="opt in interactionData.options" :key="opt" @click="submitInteraction(opt)">{{ opt }}</button>
        </div>
        <div class="ai-panel__interaction-row">
          <input v-model="customAnswer" placeholder="自定义回答..." @keydown.enter="submitInteraction(customAnswer)" />
          <button @click="submitInteraction(customAnswer)" :disabled="!customAnswer.trim()">发送</button>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="ai-panel__input">
      <div v-if="selectedImage" class="ai-panel__image-preview">
        <img :src="selectedImage.preview" />
        <span class="ai-panel__image-name">{{ selectedImage.name }}</span>
        <button class="ai-panel__icon-btn ai-panel__icon-btn--sm" @click="removeImage">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="ai-panel__input-row">
        <button class="ai-panel__icon-btn" @click="triggerImageUpload" title="上传图片">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        </button>
        <input ref="imageInputRef" type="file" accept="image/*" style="display:none" @change="handleImageUpload" />
        <input
          v-model="inputText"
          class="ai-panel__input-field"
          :placeholder="isWaitingForUser ? '请输入选择...' : '描述你想要的设计...'"
          :disabled="isProcessing && !isWaitingForUser"
          @keydown.enter.exact.prevent="handleSend"
        />
        <button
          v-if="isProcessing && !isWaitingForUser"
          class="ai-panel__send-btn ai-panel__send-btn--stop"
          @click="handleStop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
        </button>
        <button
          v-else
          class="ai-panel__send-btn"
          :disabled="(!inputText.trim() && !selectedImage) || (isProcessing && !isWaitingForUser)"
          @click="handleSend"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick, watch, onMounted, onUnmounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { designAgent } from "@/ai/langgraph";
import type { AgentInteraction } from "@/ai/langgraph";

const isOpen = useLocalStorage("_1s_ai_panel_open", false);

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

watch(() => props.open, (val) => { isOpen.value = val; });

const handleClose = () => {
  isOpen.value = false;
  emit("close");
};

const agent = designAgent;

// State
const inputText = ref("");
const messagesRef = ref<HTMLElement>();
const customAnswer = ref("");
const imageInputRef = ref<HTMLInputElement>();
const selectedImage = ref<{ file: File; preview: string; name: string } | null>(null);

// Drag
const panelRef = ref<HTMLElement>();
const isDragging = ref(false);
const dragOffset = reactive({ x: 0, y: 0 });
const panelPosition = reactive({ x: -1, y: -1 });

function onDragStart(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.ai-panel__icon-btn')) return;
  isDragging.value = true;
  const rect = panelRef.value?.getBoundingClientRect();
  if (rect) {
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
  }
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return;
  panelPosition.x = Math.max(0, Math.min(window.innerWidth - 380, e.clientX - dragOffset.x));
  panelPosition.y = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
}

function onDragEnd() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
}

// Computed
const messages = computed(() => agent.state.messages);
const isProcessing = computed(() => agent.isProcessing.value);
const isWaitingForUser = computed(() => agent.isWaitingForUser.value);
const interactionData = computed(() => agent.state.pendingInteraction);

const currentPlan = computed(() => {
  const lastPlanMsg = messages.value.findLast?.((m: any) => (m.meta as any)?.plan);
  return (lastPlanMsg?.meta as any)?.plan || null;
});

const planProgress = computed(() => {
  if (!currentPlan.value?.steps) return null;
  const done = currentPlan.value.steps.filter((s: any) => s.status === 'done').length;
  return { done, total: currentPlan.value.steps.length, goal: currentPlan.value.goal };
});

// Quick prompts — plain text, no emoji
const quickPrompts = [
  { label: "圆形促销贴纸", prompt: '创建一个圆形贴纸，红色背景，白色 "SALE 50%" 粗体大字居中' },
  { label: "T恤简约印花", prompt: "为 T恤前胸创建一个印花设计，主图案是一只简约线条猫，居中，黑底白线" },
  { label: "马克杯手写文字", prompt: '为马克杯创建一个印花设计，写 "GOOD MORNING"，手写风格' },
  { label: "极简海报", prompt: '创建一个 A3 海报设计，极简风格，黑底白字 "EXHIBITION"' },
];

// Events
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = agent.onEvent(() => { scrollToBottom(); });
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  unsubscribe?.();
});

// Actions
function handleSend() {
  if (selectedImage.value) {
    const text = inputText.value.trim() || "请分析这张图片的设计风格，然后创建一个类似的设计";
    agent.chatWithImage(text, selectedImage.value.preview);
    inputText.value = "";
    selectedImage.value = null;
    scrollToBottom();
    return;
  }
  const text = inputText.value.trim();
  if (!text) return;
  if (isWaitingForUser.value) {
    agent.submitUserResponse(text);
    inputText.value = "";
    scrollToBottom();
    return;
  }
  if (isProcessing.value) return;
  agent.chat(text);
  inputText.value = "";
  scrollToBottom();
}

function handleStop() { agent.clearMessages(); }
function handleSelfTest() { if (!isProcessing.value) { agent.selfTest(); scrollToBottom(); } }
function triggerImageUpload() { imageInputRef.value?.click(); }

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { alert("图片不能超过 10MB"); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImage.value = { file, preview: e.target?.result as string, name: file.name };
  };
  reader.readAsDataURL(file);
  input.value = "";
}

function removeImage() { selectedImage.value = null; }
function sendQuick(prompt: string) { inputText.value = prompt; handleSend(); }
function clearChat() { agent.clearMessages(); }

function submitInteraction(answer: string) {
  if (!answer.trim()) return;
  agent.submitUserResponse(answer.trim());
  customAnswer.value = "";
}

function formatToolName(name: string): string {
  const map: Record<string, string> = {
    canvas_clear: "清空画布",
    canvas_addChild: "添加元素",
    canvas_smartSize: "设置尺寸",
    canvas_setSize: "设置尺寸",
    canvas_setSizeByPreset: "预设尺寸",
    canvas_setBackgroundColor: "设置背景",
    canvas_remove: "删除元素",
    canvas_analyze: "分析画布",
    canvas_updateAndSaveSticker: "保存贴纸",
    element_setStyle: "修改样式",
    element_setTextContent: "修改文字",
    element_setBackground: "修改背景",
    resource_searchImage: "搜索图片",
    resource_searchFont: "搜索字体",
    ask_choice: "询问",
    request_feedback: "反馈",
  };
  return map[name] || name.split('.').pop() || name;
}

function parseResult(content: string) {
  try {
    const parsed = JSON.parse(content);
    return { success: parsed.success !== false, message: parsed.message || (parsed.success ? "完成" : "失败") };
  } catch {
    return { success: true, message: content };
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  });
}

watch(() => messages.value.length, scrollToBottom);
</script>

<style lang="less" scoped>
.ai-panel {
  position: fixed;
  top: 80px;
  right: 16px;
  width: 360px;
  height: 520px;
  max-height: calc(100vh - 120px);
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #1f2937;

  &.is-dragging {
    user-select: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}

/* ---- Header ---- */
.ai-panel__header {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 8px 0 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: grab;
  flex-shrink: 0;
  gap: 6px;

  .is-dragging & { cursor: grabbing; }
}

.ai-panel__title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.ai-panel__status {
  font-size: 11px;
  color: #8b5cf6;
}

.ai-panel__plan {
  font-size: 11px;
  color: #9ca3af;
}

.ai-panel__header-actions {
  margin-left: auto;
  display: flex;
  gap: 1px;
}

/* ---- Icon button ---- */
.ai-panel__icon-btn {
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: color 0.12s, background 0.12s;
  flex-shrink: 0;

  &:hover { color: #4b5563; background: #f5f5f5; }
  &:disabled { color: #d1d5db; cursor: default; &:hover { background: transparent; color: #d1d5db; } }

  &--sm { width: 20px; height: 20px; }
}

/* ---- Progress ---- */
.ai-panel__progress {
  height: 2px;
  background: #f5f5f5;
  flex-shrink: 0;
}

.ai-panel__progress-bar {
  height: 100%;
  background: #8b5cf6;
  transition: width 0.25s ease;
}

/* ---- Messages ---- */
.ai-panel__messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
}

/* ---- Empty ---- */
.ai-panel__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.ai-panel__empty-text {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.ai-panel__quick {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  max-width: 240px;
}

.ai-panel__quick-btn {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  color: #6b7280;
  text-align: left;
  transition: border-color 0.12s, color 0.12s;

  &:hover { border-color: #d1d5db; color: #374151; }
}

/* ---- Message bubbles ---- */
.ai-panel__msg {
  padding: 6px 10px;
  border-radius: 3px;
  line-height: 1.55;
  word-break: break-word;
  max-width: 88%;
  font-size: 13px;

  &--user {
    align-self: flex-end;
    background: #f0f0ff;
    color: #4338ca;
  }

  &--ai {
    align-self: flex-start;
    background: #fafafa;
  }
}

.ai-panel__msg-text {
  white-space: pre-wrap;
}

.ai-panel__tool-calls {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-top: 4px;
}

.ai-panel__tool-tag {
  padding: 1px 5px;
  background: #f0f0f0;
  border-radius: 2px;
  font-size: 11px;
  color: #6b7280;
}

.ai-panel__tool-result {
  padding: 3px 8px;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
}

/* ---- Typing dots ---- */
.ai-panel__dots {
  display: flex;
  gap: 3px;
  margin-bottom: 4px;

  span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #c4b5fd;
    animation: aiDot 1.2s infinite ease-in-out;
    &:nth-child(1) { animation-delay: -0.24s; }
    &:nth-child(2) { animation-delay: -0.12s; }
  }
}

@keyframes aiDot {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.ai-panel__stop-btn {
  padding: 2px 8px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 2px;
  cursor: pointer;
  font-size: 11px;
  color: #9ca3af;
  transition: border-color 0.12s, color 0.12s;

  &:hover { border-color: #d1d5db; color: #6b7280; }
}

/* ---- Interaction ---- */
.ai-panel__interaction {
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  padding: 8px 10px;
  margin-top: 4px;
}

.ai-panel__interaction-q {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
}

.ai-panel__interaction-opts {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 6px;

  button {
    padding: 5px 8px;
    background: transparent;
    border: 1px solid #f0f0f0;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    color: #4b5563;
    text-align: left;
    transition: border-color 0.12s, color 0.12s;

    &:hover { border-color: #8b5cf6; color: #7c3aed; }
  }
}

.ai-panel__interaction-row {
  display: flex;
  gap: 4px;

  input {
    flex: 1;
    padding: 5px 8px;
    border: 1px solid #e5e7eb;
    border-radius: 3px;
    font-size: 12px;
    outline: none;
    &:focus { border-color: #8b5cf6; }
  }

  button {
    padding: 5px 10px;
    background: #8b5cf6;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.12s;
    &:hover { background: #7c3aed; }
    &:disabled { background: #d1d5db; cursor: not-allowed; }
  }
}

/* ---- Input ---- */
.ai-panel__input {
  flex-shrink: 0;
  padding: 6px 8px;
  border-top: 1px solid #f0f0f0;
}

.ai-panel__image-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  padding: 3px 4px;
  background: #fafafa;
  border-radius: 3px;

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 2px;
  }
}

.ai-panel__image-name {
  flex: 1;
  font-size: 11px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-panel__input-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-panel__input-field {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.12s;

  &::placeholder { color: #c4c4c4; }
  &:focus { border-color: #8b5cf6; }
  &:disabled { background: #fafafa; }
}

.ai-panel__send-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #8b5cf6;
  color: #fff;
  flex-shrink: 0;
  transition: background 0.12s;

  &:hover { background: #7c3aed; }
  &:disabled { background: #d1d5db; cursor: not-allowed; }

  &--stop {
    background: #f5f5f5;
    color: #9ca3af;
    &:hover { background: #e5e5e5; color: #6b7280; }
  }
}
</style>
