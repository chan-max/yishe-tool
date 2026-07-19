<template>
  <div
    v-if="open || isOpen"
    ref="panelRef"
    class="ai-panel"
    :class="{ 'is-dragging': isDragging, 'is-dark': isDarkMode }"
    :style="panelPosition.x >= 0 ? { left: panelPosition.x + 'px', top: panelPosition.y + 'px', right: 'auto' } : {}"
  >
    <!-- Header -->
    <div class="ai-panel__header" @mousedown="onDragStart">
      <span class="ai-panel__title">AI 设计</span>
      <span v-if="isProcessing" class="ai-panel__status">{{ agentPhaseLabel }}</span>
      <span v-if="planProgress" class="ai-panel__plan">
        {{ planProgress.settled }}/{{ planProgress.total }}
        <template v-if="planProgress.failed"> · {{ planProgress.failed }} 失败</template>
      </span>
      <div class="ai-panel__header-actions">
        <button class="ai-panel__icon-btn" @click="copyConversationLog" title="复制对话日志">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
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
      <div class="ai-panel__progress-bar" :style="{ width: (planProgress.settled / planProgress.total * 100) + '%' }"></div>
    </div>

    <!-- Messages -->
    <div class="ai-panel__messages" ref="messagesRef" @scroll="handleMessagesScroll">
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
      <div v-if="hiddenMessageCount > 0" class="ai-panel__history-note">
        已折叠 {{ hiddenMessageCount }} 条较早记录
      </div>
      <template v-for="msg in visibleMessages" :key="msg.id">
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
      <button
        v-if="hasUnreadMessages"
        class="ai-panel__latest-btn"
        @click="scrollToBottom(true)"
      >
        查看最新进度
      </button>
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
      <div v-else-if="isPreparingImage" class="ai-panel__image-processing">
        正在优化参考图片...
      </div>
      <div class="ai-panel__input-row">
        <button class="ai-panel__icon-btn" :disabled="isPreparingImage" @click="triggerImageUpload" title="上传图片">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        </button>
        <input ref="imageInputRef" type="file" accept="image/*" style="display:none" @change="handleImageUpload" />
        <input
          v-model="inputText"
          class="ai-panel__input-field"
          :placeholder="isWaitingForUser ? '请输入选择...' : '描述你想要的设计...'"
          :disabled="isPreparingImage || (isProcessing && !isWaitingForUser)"
          @keydown.enter.exact.prevent="handleSend"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
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
import { resolveAIToolName } from "@/ai/shared/tools";
import type { AgentInteraction } from "@/ai/langgraph";
import { isDarkMode } from "@/components/design/store";
import { prepareImageForAI } from "@/ai/image-preprocess";
import { getAgentPhaseLabel } from "@/ai/agent/presentation";

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
const isComposing = ref(false);
const messagesRef = ref<HTMLElement>();
const customAnswer = ref("");
const imageInputRef = ref<HTMLInputElement>();
const selectedImage = ref<{ file: File; preview: string; name: string } | null>(null);
const isPreparingImage = ref(false);
const autoFollowMessages = ref(true);
const hasUnreadMessages = ref(false);

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
const visibleMessages = computed(() => messages.value.slice(-50));
const hiddenMessageCount = computed(() => Math.max(0, messages.value.length - 50));
const isProcessing = computed(() => agent.isProcessing.value);
const isWaitingForUser = computed(() => agent.isWaitingForUser.value);
const interactionData = computed(() => agent.state.pendingInteraction);

const currentPlan = computed(() => agent.currentPlan.value);
const agentPhaseLabel = computed(() =>
  getAgentPhaseLabel(agent.state.status, currentPlan.value),
);

const planProgress = computed(() => {
  if (!currentPlan.value?.steps) return null;
  const done = currentPlan.value.steps.filter((s: any) => s.status === 'done').length;
  const failed = currentPlan.value.steps.filter((s: any) => s.status === 'failed').length;
  return {
    settled: done + failed,
    done,
    failed,
    total: currentPlan.value.steps.length,
    goal: currentPlan.value.goal,
  };
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
  if (isComposing.value) return;
  if (selectedImage.value) {
    const text = inputText.value.trim() || "请分析这张图片的设计风格，然后创建一个类似的设计";
    agent.chatWithImage(text, selectedImage.value.preview);
    inputText.value = "";
    selectedImage.value = null;
    scrollToBottom(true);
    return;
  }
  const text = inputText.value.trim();
  if (!text) return;
  if (isWaitingForUser.value) {
    agent.submitUserResponse(text);
    inputText.value = "";
    scrollToBottom(true);
    return;
  }
  if (isProcessing.value) return;
  agent.chat(text);
  inputText.value = "";
  scrollToBottom(true);
}

function handleStop() { agent.stop(); }
function copyConversationLog() {
  const msgs = messages.value;
  if (msgs.length === 0) return;

  const lines: string[] = [];
  const sep = '='.repeat(60);
  lines.push(sep);
  lines.push(`AI 对话日志  ${new Date().toLocaleString()}`);
  lines.push(`消息总数: ${msgs.length}`);
  lines.push(sep);
  lines.push('');

  for (const msg of msgs) {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const iter = (msg.meta as any)?.iteration ? ` [第${(msg.meta as any).iteration}轮]` : '';
    const dur = (msg.meta as any)?.duration ? ` (${(msg.meta as any).duration}ms)` : '';
    lines.push(`--- ${msg.role.toUpperCase()}${iter}${dur} ${time} ---`);

    if (msg.content) lines.push(msg.content);

    if (msg.tool_calls?.length) {
      for (const call of msg.tool_calls) {
        lines.push(`\n工具调用: ${formatToolName(call.function.name)}`);
        try {
          const args = typeof call.function.arguments === 'string'
            ? JSON.parse(call.function.arguments)
            : call.function.arguments;
          lines.push('参数: ' + JSON.stringify(args, null, 2));
        } catch {
          lines.push('参数: ' + String(call.function.arguments));
        }
      }
    }

    if (msg.role === 'tool' && (msg.meta as any)?.toolResult) {
      lines.push('执行结果: ' + JSON.stringify((msg.meta as any).toolResult, null, 2));
    }

    if ((msg.meta as any)?.plan) {
      lines.push('计划: ' + JSON.stringify((msg.meta as any).plan, null, 2));
    }

    lines.push('');
  }

  const log = lines.join('\n');

  // 始终打印到控制台
  console.log('[AI 对话日志]\n' + log);
  console.log('[AI 对话日志] 完整 JSON:', JSON.stringify(msgs, null, 2));

  // 尝试复制到剪贴板
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(log).then(() => {
      console.log('[AI 对话日志] 已复制到剪贴板');
    }).catch(() => {
      console.warn('[AI 对话日志] 剪贴板写入失败，请从控制台复制');
    });
  } else {
    // 降级：用 textarea 复制
    const ta = document.createElement('textarea');
    ta.value = log;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* ignore */ }
    document.body.removeChild(ta);
    console.log('[AI 对话日志] 已复制到剪贴板（降级方式）');
  }
}

function triggerImageUpload() { imageInputRef.value?.click(); }

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { alert("图片不能超过 10MB"); return; }
  input.value = "";
  isPreparingImage.value = true;
  try {
    const prepared = await prepareImageForAI(file);
    selectedImage.value = { file, preview: prepared.preview, name: file.name };
  } catch (error: any) {
    console.warn("[AI] 参考图片预处理失败，回退原图:", error);
    const reader = new FileReader();
    const preview = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    selectedImage.value = { file, preview, name: file.name };
  } finally {
    isPreparingImage.value = false;
  }
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
  const resolvedName = resolveAIToolName(name);
  const compactName = resolvedName.replace(/\./g, "_");
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
  return map[compactName] || map[name] || resolvedName.split('.').pop() || resolvedName;
}

function parseResult(content: string) {
  try {
    const parsed = JSON.parse(content);
    return { success: parsed.success !== false, message: parsed.message || (parsed.success ? "完成" : "失败") };
  } catch {
    return { success: true, message: content };
  }
}

function handleMessagesScroll() {
  const element = messagesRef.value;
  if (!element) return;
  autoFollowMessages.value =
    element.scrollHeight - element.scrollTop - element.clientHeight < 48;
  if (autoFollowMessages.value) hasUnreadMessages.value = false;
}

function scrollToBottom(force = false) {
  if (!force && !autoFollowMessages.value) {
    hasUnreadMessages.value = true;
    return;
  }
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
      autoFollowMessages.value = true;
      hasUnreadMessages.value = false;
    }
  });
}

watch(
  () => messages.value.length,
  () => scrollToBottom(),
);
</script>

<style lang="less" scoped>
.ai-panel {
  /* ---- Light theme (default) ---- */
  --bg: #fff; --bg-elevated: #f3f4f6; --bg-subtle: #f5f5f5; --bg-input: #fafafa;
  --text: #000; --text-secondary: #1f2937; --text-body: #111827;
  --text-subtle: #374151; --text-muted: #4b5563; --text-faint: #6b7280;
  --border: #ebebeb; --border-strong: #ddd; --border-divider: #e0e0e0;
  --tag-bg: #e8e8e8;
  --user-bg: #eef2ff; --user-text: #3730a3;
  --ai-bg: #fff; --ai-text: #111; --ai-border: #e0e0e0;
  --accent: #8b5cf6; --accent-hover: #7c3aed; --accent-muted: #c4b5fd;
  --disabled: #d1d5db;
  --shadow: rgba(0,0,0,0.1);

  &.is-dark {
    --bg: #181818; --bg-elevated: #222; --bg-subtle: #252525; --bg-input: #1e1e1e;
    --text: #f0f0f0; --text-secondary: #d4d4d4; --text-body: #e0e0e0;
    --text-subtle: #aaa; --text-muted: #999; --text-faint: #777;
    --border: #2a2a2a; --border-strong: #383838; --border-divider: #3a3a3a;
    --tag-bg: #333;
    --user-bg: #1e1b4b; --user-text: #c7d2fe;
    --ai-bg: #222; --ai-text: #eee; --ai-border: #3a3a3a;
    --accent: #8b5cf6; --accent-hover: #7c3aed; --accent-muted: #7c3aed;
    --disabled: #444;
    --shadow: rgba(0,0,0,0.3);
  }

  position: fixed;
  top: 80px; right: 16px;
  width: 360px; height: 520px; max-height: calc(100vh - 120px);
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  display: flex; flex-direction: column;
  z-index: 1000; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: var(--text);
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  &.is-dragging { user-select: none; box-shadow: 0 2px 8px var(--shadow); }
}

/* ---- Header ---- */
.ai-panel__header {
  display: flex; align-items: center;
  height: 36px; padding: 0 8px 0 12px;
  border-bottom: 1px solid var(--border);
  cursor: grab; flex-shrink: 0; gap: 6px;
  .is-dragging & { cursor: grabbing; }
}
.ai-panel__title { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
.ai-panel__status { font-size: 11px; color: var(--accent); }
.ai-panel__plan { font-size: 11px; color: var(--text-faint); }
.ai-panel__header-actions { margin-left: auto; display: flex; gap: 1px; }

/* ---- Icon button ---- */
.ai-panel__icon-btn {
  width: 26px; height: 26px; border: none; background: transparent;
  border-radius: 3px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-faint);
  transition: color 0.12s, background 0.12s; flex-shrink: 0;
  &:hover { color: var(--text-subtle); background: var(--bg-subtle); }
  &:disabled { color: var(--disabled); cursor: default; &:hover { background: transparent; color: var(--disabled); } }
  &--sm { width: 20px; height: 20px; }
}

/* ---- Progress ---- */
.ai-panel__progress { height: 2px; background: var(--bg-elevated); flex-shrink: 0; }
.ai-panel__progress-bar { height: 100%; background: var(--accent); transition: width 0.25s ease; }

/* ---- Messages ---- */
.ai-panel__messages {
  flex: 1; overflow-y: auto; padding: 10px 12px;
  display: flex; flex-direction: column; gap: 6px;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border-divider); border-radius: 2px; }
}
.ai-panel__history-note {
  align-self: center; font-size: 11px; color: var(--text-faint);
  padding: 2px 8px; background: var(--bg-subtle); border-radius: 3px;
}
.ai-panel__latest-btn {
  position: sticky; bottom: 2px; align-self: center;
  border: 1px solid var(--border-strong); border-radius: 3px;
  background: var(--bg); color: var(--accent-hover);
  padding: 4px 10px; font-size: 11px; cursor: pointer;
  box-shadow: 0 1px 4px var(--shadow);
}

/* ---- Empty ---- */
.ai-panel__empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
.ai-panel__empty-text { margin: 0; font-size: 12px; color: var(--text-muted); }
.ai-panel__quick { display: flex; flex-direction: column; gap: 3px; width: 100%; max-width: 240px; }
.ai-panel__quick-btn {
  padding: 6px 10px; background: transparent;
  border: 1px solid var(--border); border-radius: 3px;
  cursor: pointer; font-size: 12px; color: var(--text-secondary);
  text-align: left; transition: border-color 0.12s, color 0.12s;
  &:hover { border-color: var(--accent); color: var(--accent-hover); }
}

/* ---- Message bubbles ---- */
.ai-panel__msg {
  padding: 6px 10px; border-radius: 3px;
  line-height: 1.55; word-break: break-word; max-width: 88%; font-size: 13px;
  &--user { align-self: flex-end; background: var(--user-bg); color: var(--user-text); }
  &--ai { align-self: flex-start; background: var(--ai-bg); color: var(--ai-text); border: 1px solid var(--ai-border); }
}
.ai-panel__msg-text { white-space: pre-wrap; }
.ai-panel__tool-calls { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 4px; }
.ai-panel__tool-tag { padding: 1px 5px; background: var(--tag-bg); border-radius: 2px; font-size: 11px; color: var(--text-subtle); }
.ai-panel__tool-result { padding: 3px 8px; font-size: 11px; color: var(--text-muted); text-align: center; }

/* ---- Typing dots ---- */
.ai-panel__dots {
  display: flex; gap: 3px; margin-bottom: 4px;
  span {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--accent-muted);
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
  padding: 2px 8px; background: transparent;
  border: 1px solid var(--border-divider); border-radius: 2px;
  cursor: pointer; font-size: 11px; color: var(--text-muted);
  transition: border-color 0.12s, color 0.12s;
  &:hover { border-color: var(--accent); color: var(--accent-hover); }
}

/* ---- Interaction ---- */
.ai-panel__interaction {
  border: 1px solid var(--border); border-radius: 3px;
  padding: 8px 10px; margin-top: 4px;
}
.ai-panel__interaction-q { font-size: 12px; font-weight: 500; margin-bottom: 6px; color: var(--text); }
.ai-panel__interaction-opts {
  display: flex; flex-direction: column; gap: 3px; margin-bottom: 6px;
  button {
    padding: 5px 8px; background: transparent;
    border: 1px solid var(--border); border-radius: 3px;
    cursor: pointer; font-size: 12px; color: var(--text-body);
    text-align: left; transition: border-color 0.12s, color 0.12s;
    &:hover { border-color: var(--accent); color: var(--accent-hover); }
  }
}
.ai-panel__interaction-row {
  display: flex; gap: 4px;
  input {
    flex: 1; padding: 5px 8px;
    border: 1px solid var(--border-divider); border-radius: 3px;
    font-size: 12px; outline: none;
    background: var(--bg); color: var(--text);
    &:focus { border-color: var(--accent); }
  }
  button {
    padding: 5px 10px; background: var(--accent); color: #fff;
    border: none; border-radius: 3px; cursor: pointer; font-size: 12px;
    transition: background 0.12s;
    &:hover { background: var(--accent-hover); }
    &:disabled { background: var(--disabled); cursor: not-allowed; }
  }
}

/* ---- Input ---- */
.ai-panel__input { flex-shrink: 0; padding: 6px 8px; border-top: 1px solid var(--border); }
.ai-panel__image-preview {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 4px; padding: 3px 4px;
  background: var(--bg-subtle); border-radius: 3px;
  img { width: 32px; height: 32px; object-fit: cover; border-radius: 2px; }
}
.ai-panel__image-name {
  flex: 1; font-size: 11px; color: var(--text-faint);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ai-panel__image-processing {
  margin-bottom: 4px; padding: 4px 6px; border-radius: 3px;
  background: var(--bg-subtle); color: var(--text-muted); font-size: 11px;
}
.ai-panel__input-row { display: flex; align-items: center; gap: 4px; }
.ai-panel__input-field {
  flex: 1; padding: 6px 8px;
  border: 1px solid var(--border-strong); border-radius: 3px;
  font-size: 12px; outline: none;
  background: var(--bg); color: var(--text);
  transition: border-color 0.12s;
  &::placeholder { color: var(--text-faint); }
  &:focus { border-color: var(--accent); }
  &:disabled { background: var(--bg-input); }
}
.ai-panel__send-btn {
  width: 28px; height: 28px; border: none; border-radius: 3px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: #fff; flex-shrink: 0;
  transition: background 0.12s;
  &:hover { background: var(--accent-hover); }
  &:disabled { background: var(--disabled); cursor: not-allowed; }
  &--stop {
    background: var(--bg-subtle); color: var(--text-faint);
    &:hover { background: var(--border-divider); color: var(--text-muted); }
  }
}
</style>
