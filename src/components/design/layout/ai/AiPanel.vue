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
    <div
      class="ai-panel__input"
      :class="{ 'is-drag-over': isDragOver }"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <div
        v-if="showMemberCount || showJobCount"
        class="ai-panel__task-options"
      >
        <label v-if="showMemberCount" class="ai-panel__task-count">
          <span>成员</span>
          <input
            v-model.number="taskOptions.memberCount"
            type="number"
            min="2"
            max="12"
            :disabled="isProcessing"
          />
        </label>
        <label v-if="showJobCount" class="ai-panel__task-count">
          <span>数量</span>
          <input
            v-model.number="taskOptions.jobCount"
            type="number"
            min="1"
            max="100"
            :disabled="isProcessing"
          />
        </label>
      </div>

      <div v-if="taskOptions.preset === 'custom'" class="ai-panel__task-custom">
        <select v-model="taskOptions.source" title="设计来源">
          <option value="blank">新建设计</option>
          <option value="current-canvas">当前画布</option>
          <option value="reference-image">参考图片</option>
        </select>
        <select v-model="taskOptions.intent" title="任务意图">
          <option value="create">创建</option>
          <option value="edit">修改</option>
          <option value="analyze">分析</option>
          <option value="optimize">优化</option>
        </select>
        <select v-model="taskOptions.outputKind" title="输出结构">
          <option value="single">单图</option>
          <option value="group">组图</option>
          <option value="independent-batch">独立批量</option>
        </select>
        <select
          v-model="taskOptions.delivery"
          title="交付动作"
          :disabled="taskOptions.outputKind !== 'single'"
        >
          <option value="canvas">仅画布</option>
          <option value="save">保存素材</option>
          <option value="export">导出 PNG</option>
        </select>
        <input
          v-model="taskOptions.customInstructions"
          class="ai-panel__task-instructions"
          placeholder="附加约束"
          :disabled="isProcessing"
        />
      </div>

      <!-- Image Preview Card -->
      <div v-if="selectedImage" class="ai-panel__image-card">
        <div class="ai-panel__image-thumb-wrapper">
          <img :src="selectedImage.preview" class="ai-panel__image-thumb" />
          <button class="ai-panel__image-remove" @click="removeImage" title="删除图片">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="ai-panel__image-info">
          <div class="ai-panel__image-title-row">
            <span class="ai-panel__image-badge">参考图</span>
            <span class="ai-panel__image-filename">{{ selectedImage.name }}</span>
          </div>
          <span v-if="selectedImage.size" class="ai-panel__image-filesize">{{ selectedImage.size }}</span>
        </div>
      </div>

      <!-- Image Processing Loading -->
      <div v-else-if="isPreparingImage" class="ai-panel__image-loading">
        <div class="ai-panel__spinner"></div>
        <span>正在优化参考图片...</span>
      </div>

      <!-- Drag Hint -->
      <div v-if="isDragOver" class="ai-panel__drag-hint">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <span>松开上传参考图</span>
      </div>

      <div class="ai-panel__input-tools">
        <button
          class="ai-panel__upload-btn"
          :class="{ 'is-active': !!selectedImage }"
          :disabled="isPreparingImage"
          @click="triggerImageUpload"
          title="上传参考图 (支持截图粘贴与拖拽)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        </button>
        <input ref="imageInputRef" type="file" accept="image/*" style="display:none" @change="handleImageUpload" />

        <select
          v-model="taskOptions.preset"
          class="ai-panel__task-select"
          :disabled="isProcessing"
          title="设计模式"
        >
          <option
            v-for="preset in taskPresets"
            :key="preset.value"
            :value="preset.value"
          >
            {{ preset.label }}
          </option>
        </select>
      </div>

      <div class="ai-panel__input-row">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          class="ai-panel__input-field"
          :placeholder="isWaitingForUser ? '请输入选择...' : (selectedImage ? '描述你想参考此图制作的设计...' : '描述你想要的设计... (支持直接粘贴图片)')"
          :disabled="isPreparingImage || (isProcessing && !isWaitingForUser)"
          rows="1"
          @input="adjustTextareaHeight"
          @keydown.enter="handleKeydownEnter"
          @paste="handlePaste"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        />

        <button
          v-if="isProcessing && !isWaitingForUser"
          class="ai-panel__send-btn ai-panel__send-btn--stop"
          @click="handleStop"
          title="停止生成"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
        </button>
        <button
          v-else
          class="ai-panel__send-btn"
          :class="{ 'is-ready': inputText.trim() || selectedImage }"
          :disabled="(!inputText.trim() && !selectedImage) || (isProcessing && !isWaitingForUser)"
          @click="handleSend"
          title="发送 (Enter)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
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
import {
  AGENT_TASK_PRESETS,
  resolveAgentTaskSpec,
  validateAgentTaskSpec,
  type AgentTaskOptions,
} from "@/ai/agent/task-spec";

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
const textareaRef = ref<HTMLTextAreaElement>();
const customAnswer = ref("");
const imageInputRef = ref<HTMLInputElement>();
const selectedImage = ref<{ file: File; preview: string; name: string; size?: string } | null>(null);
const isPreparingImage = ref(false);
const isDragOver = ref(false);
const autoFollowMessages = ref(true);
const hasUnreadMessages = ref(false);
const taskPresets = AGENT_TASK_PRESETS;
const taskOptions = useLocalStorage<AgentTaskOptions>(
  "_1s_ai_task_options_v1",
  {
    preset: "standard",
    source: "blank",
    intent: "create",
    outputKind: "single",
    jobCount: 3,
    memberCount: 2,
    delivery: "canvas",
    customInstructions: "",
  },
  { mergeDefaults: true },
);
const showMemberCount = computed(
  () =>
    taskOptions.value.preset === "group" ||
    (taskOptions.value.preset === "custom" &&
      taskOptions.value.outputKind === "group"),
);
const showJobCount = computed(
  () =>
    taskOptions.value.preset === "batch" ||
    (taskOptions.value.preset === "custom" &&
      taskOptions.value.outputKind === "independent-batch"),
);
watch(
  () => [taskOptions.value.preset, taskOptions.value.outputKind] as const,
  ([preset, outputKind]) => {
    if (
      preset === "custom" &&
      outputKind !== "single"
    ) {
      taskOptions.value.delivery = "save";
    }
  },
);

function adjustTextareaHeight() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = "auto";
  const newHeight = Math.min(el.scrollHeight, 160);
  el.style.height = `${Math.max(34, newHeight)}px`;
}

function handleKeydownEnter(e: KeyboardEvent) {
  if (e.shiftKey) return;
  if (isComposing.value) return;
  e.preventDefault();
  handleSend();
}

function resetTextareaHeight() {
  inputText.value = "";
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = "34px";
    }
  });
}

watch(inputText, (val) => {
  if (!val) {
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = "34px";
      }
    });
  } else {
    nextTick(adjustTextareaHeight);
  }
});

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
    const resolvedTask = resolveAgentTaskSpec(text, taskOptions.value, {
      hasReferenceImage: true,
    });
    const taskError = validateAgentTaskSpec(resolvedTask, {
      hasReferenceImage: true,
    });
    if (taskError) {
      alert(taskError);
      return;
    }
    agent.chatWithImage(text, selectedImage.value.preview, {
      task: { ...taskOptions.value },
    });
    selectedImage.value = null;
    resetTextareaHeight();
    scrollToBottom(true);
    return;
  }
  const text = inputText.value.trim();
  if (!text) return;
  if (isWaitingForUser.value) {
    agent.submitUserResponse(text);
    resetTextareaHeight();
    scrollToBottom(true);
    return;
  }
  if (isProcessing.value) return;
  const resolvedTask = resolveAgentTaskSpec(text, taskOptions.value, {
    hasReferenceImage: false,
  });
  const taskError = validateAgentTaskSpec(resolvedTask, {
    hasReferenceImage: false,
  });
  if (taskError) {
    alert(taskError);
    return;
  }
  agent.chat(text, { task: { ...taskOptions.value } });
  resetTextareaHeight();
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
  input.value = "";
  await processUploadedFile(file);
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf("image") !== -1) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        processUploadedFile(file);
        break;
      }
    }
  }
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  if (file.type.startsWith("image/")) {
    processUploadedFile(file);
  }
}

async function processUploadedFile(file: File) {
  if (file.size > 10 * 1024 * 1024) { alert("图片不能超过 10MB"); return; }
  isPreparingImage.value = true;
  try {
    const prepared = await prepareImageForAI(file);
    selectedImage.value = {
      file,
      preview: prepared.preview,
      name: file.name,
      size: formatFileSize(file.size),
    };
  } catch (error: any) {
    console.warn("[AI] 参考图片预处理失败，回退原图:", error);
    const reader = new FileReader();
    const preview = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    selectedImage.value = {
      file,
      preview,
      name: file.name,
      size: formatFileSize(file.size),
    };
  } finally {
    isPreparingImage.value = false;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
  /* ---- Flat theme variables ---- */
  --bg: #ffffff;
  --bg-elevated: #f8fafc;
  --bg-subtle: #f1f5f9;
  --bg-input: #ffffff;
  --text: #0f172a;
  --text-secondary: #334155;
  --text-body: #1e293b;
  --text-subtle: #475569;
  --text-muted: #64748b;
  --text-faint: #94a3b8;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-divider: #e2e8f0;
  --tag-bg: #f1f5f9;
  --user-bg: #4f46e5;
  --user-text: #ffffff;
  --ai-bg: #f8fafc;
  --ai-text: #0f172a;
  --ai-border: #e2e8f0;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-muted: #818cf8;
  --accent-alpha: rgba(79, 70, 229, 0.15);
  --disabled: #e2e8f0;
  --shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);

  &.is-dark {
    --bg: #18181b;
    --bg-elevated: #27272a;
    --bg-subtle: #27272a;
    --bg-input: #18181b;
    --text: #f4f4f5;
    --text-secondary: #e4e4e7;
    --text-body: #d4d4d8;
    --text-subtle: #a1a1aa;
    --text-muted: #71717a;
    --text-faint: #52525b;
    --border: #27272a;
    --border-strong: #3f3f46;
    --border-divider: #27272a;
    --tag-bg: #27272a;
    --user-bg: #6366f1;
    --user-text: #ffffff;
    --ai-bg: #27272a;
    --ai-text: #f4f4f5;
    --ai-border: #3f3f46;
    --accent: #6366f1;
    --accent-hover: #4f46e5;
    --accent-muted: #818cf8;
    --accent-alpha: rgba(99, 102, 241, 0.25);
    --disabled: #3f3f46;
    --shadow: 0 8px 32px rgba(0, 0, 0, 0.36);
  }

  position: fixed;
  top: 80px; right: 16px;
  width: 380px; height: 560px; max-height: calc(100vh - 120px);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  display: flex; flex-direction: column;
  z-index: 1000; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  font-size: 13px;
  color: var(--text);
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;

  &.is-dragging { user-select: none; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15); }
}

/* ---- Header ---- */
.ai-panel__header {
  display: flex; align-items: center;
  height: 40px; padding: 0 10px 0 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  cursor: grab; flex-shrink: 0; gap: 8px;
  .is-dragging & { cursor: grabbing; }
}
.ai-panel__title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; color: var(--text); }
.ai-panel__status { font-size: 11px; font-weight: 500; color: var(--accent); background: var(--accent-alpha); padding: 2px 6px; border-radius: 4px; }
.ai-panel__plan { font-size: 11px; color: var(--text-muted); }
.ai-panel__header-actions { margin-left: auto; display: flex; gap: 2px; }

/* ---- Icon button ---- */
.ai-panel__icon-btn {
  width: 28px; height: 28px; border: none; background: transparent;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s; flex-shrink: 0;
  &:hover { color: var(--text); background: var(--bg-subtle); }
  &:disabled { color: var(--text-faint); cursor: default; &:hover { background: transparent; } }
  &--sm { width: 22px; height: 22px; }
}

/* ---- Progress ---- */
.ai-panel__progress { height: 2px; background: var(--bg-subtle); flex-shrink: 0; }
.ai-panel__progress-bar { height: 100%; background: var(--accent); transition: width 0.25s ease; }

/* ---- Messages ---- */
.ai-panel__messages {
  flex: 1; overflow-y: auto; padding: 12px 14px;
  display: flex; flex-direction: column; gap: 8px;
  background: var(--bg);
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
}
.ai-panel__history-note {
  align-self: center; font-size: 11px; color: var(--text-muted);
  padding: 3px 10px; background: var(--bg-subtle); border-radius: 4px;
}
.ai-panel__latest-btn {
  position: sticky; bottom: 4px; align-self: center;
  border: 1px solid var(--border); border-radius: 6px;
  background: var(--bg); color: var(--accent);
  padding: 5px 12px; font-size: 11px; font-weight: 500; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* ---- Empty ---- */
.ai-panel__empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
.ai-panel__empty-text { margin: 0; font-size: 13px; font-weight: 500; color: var(--text-muted); }
.ai-panel__quick { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 260px; }
.ai-panel__quick-btn {
  padding: 8px 12px; background: var(--bg-elevated);
  border: 1px solid var(--border); border-radius: 6px;
  cursor: pointer; font-size: 12px; color: var(--text-secondary);
  text-align: left; transition: border-color 0.15s, color 0.15s, background 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); background: var(--bg); }
}

/* ---- Message bubbles ---- */
.ai-panel__msg {
  padding: 8px 12px; border-radius: 8px;
  line-height: 1.5; word-break: break-word; max-width: 88%; font-size: 13px;
  &--user { align-self: flex-end; background: var(--user-bg); color: var(--user-text); border-radius: 8px 8px 2px 8px; }
  &--ai { align-self: flex-start; background: var(--ai-bg); color: var(--ai-text); border: 1px solid var(--ai-border); border-radius: 8px 8px 8px 2px; }
}
.ai-panel__msg-text { white-space: pre-wrap; }
.ai-panel__tool-calls { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.ai-panel__tool-tag { padding: 2px 6px; background: var(--tag-bg); border-radius: 4px; font-size: 11px; font-weight: 500; color: var(--text-subtle); border: 1px solid var(--border); }
.ai-panel__tool-result { padding: 4px 10px; font-size: 11px; color: var(--text-muted); text-align: center; }

/* ---- Typing dots ---- */
.ai-panel__dots {
  display: flex; gap: 4px; padding: 2px 0;
  span {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--accent);
    animation: aiDot 1.2s infinite ease-in-out;
    &:nth-child(1) { animation-delay: -0.24s; }
    &:nth-child(2) { animation-delay: -0.12s; }
  }
}
@keyframes aiDot {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}
.ai-panel__stop-btn {
  margin-top: 4px;
  padding: 3px 10px; background: transparent;
  border: 1px solid var(--border); border-radius: 4px;
  cursor: pointer; font-size: 11px; color: var(--text-muted);
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); }
}

/* ---- Interaction ---- */
.ai-panel__interaction {
  border: 1px solid var(--border); border-radius: 6px;
  background: var(--bg-elevated);
  padding: 10px 12px; margin-top: 4px;
}
.ai-panel__interaction-q { font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--text); }
.ai-panel__interaction-opts {
  display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px;
  button {
    padding: 6px 10px; background: var(--bg);
    border: 1px solid var(--border); border-radius: 4px;
    cursor: pointer; font-size: 12px; color: var(--text-body);
    text-align: left; transition: border-color 0.15s, color 0.15s;
    &:hover { border-color: var(--accent); color: var(--accent); }
  }
}
.ai-panel__interaction-row {
  display: flex; gap: 6px;
  input {
    flex: 1; padding: 6px 10px;
    border: 1px solid var(--border-strong); border-radius: 4px;
    font-size: 12px; outline: none;
    background: var(--bg); color: var(--text);
    &:focus { border-color: var(--accent); }
  }
  button {
    padding: 6px 12px; background: var(--accent); color: #fff;
    border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;
    transition: background 0.15s;
    &:hover { background: var(--accent-hover); }
    &:disabled { background: var(--disabled); cursor: not-allowed; }
  }
}

/* ---- Input ---- */
.ai-panel__input {
  position: relative;
  flex-shrink: 0;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg);
  transition: border-color 0.2s, background-color 0.2s;

  &.is-drag-over {
    background: var(--accent-alpha);
    border-top-color: var(--accent);
  }
}

.ai-panel__task-options {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  margin-bottom: 8px;
}

.ai-panel__task-select,
.ai-panel__task-custom select,
.ai-panel__task-custom input {
  height: 26px;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-input);
  color: var(--text-secondary);
  font: inherit;
  font-size: 11px;
  outline: none;
  &:focus { border-color: var(--accent); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
}

.ai-panel__task-select {
  width: 92px;
  height: 34px;
  padding: 0 6px;
  flex-shrink: 0;
}

.ai-panel__task-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 11px;
  white-space: nowrap;

  input {
    width: 46px;
    height: 26px;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text);
    padding: 0 4px;
    font: inherit;
    text-align: center;
    outline: none;
    &:focus { border-color: var(--accent); }
  }
}

.ai-panel__task-custom {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 8px;

  select,
  input { width: 100%; box-sizing: border-box; padding: 0 6px; }

  .ai-panel__task-instructions { grid-column: 1 / -1; }
}

/* ---- Image Card Preview ---- */
.ai-panel__image-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 6px;
  animation: fadeInCard 0.2s ease-out;
}
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-panel__image-thumb-wrapper {
  position: relative;
  width: 36px; height: 36px;
  flex-shrink: 0;
}
.ai-panel__image-thumb {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.ai-panel__image-remove {
  position: absolute;
  top: -4px; right: -4px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #ef4444; color: #fff;
  border: 2px solid var(--bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s;
  &:hover { background: #dc2626; transform: scale(1.1); }
}

.ai-panel__image-info {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 2px;
}
.ai-panel__image-title-row {
  display: flex; align-items: center; gap: 6px;
}
.ai-panel__image-badge {
  font-size: 10px; font-weight: 600;
  color: var(--accent); background: var(--accent-alpha);
  padding: 1px 5px; border-radius: 3px;
  flex-shrink: 0;
}
.ai-panel__image-filename {
  font-size: 12px; font-weight: 500;
  color: var(--text);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ai-panel__image-filesize {
  font-size: 11px; color: var(--text-muted);
}

/* ---- Image Loading State ---- */
.ai-panel__image-loading {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px; padding: 6px 10px;
  background: var(--bg-subtle); border-radius: 6px;
  font-size: 12px; color: var(--text-muted);
}
.ai-panel__spinner {
  width: 14px; height: 14px;
  border: 2px solid var(--border-strong);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---- Drag Hint Overlay ---- */
.ai-panel__drag-hint {
  position: absolute;
  inset: 0;
  background: var(--bg);
  border: 2px dashed var(--accent);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  color: var(--accent); font-size: 13px; font-weight: 500;
  z-index: 10;
  pointer-events: none;
}

/* ---- Upload & Input & Send Buttons ---- */
.ai-panel__input-tools {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.ai-panel__input-row { display: flex; align-items: flex-end; gap: 6px; }

.ai-panel__upload-btn {
  width: 34px; height: 34px;
  border: 1px solid var(--border-strong);
  background: var(--bg-input);
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--bg-subtle);
  }
  &.is-active {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-alpha);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.ai-panel__input-field {
  flex: 1; min-width: 0; padding: 7px 10px;
  border: 1px solid var(--border-strong); border-radius: 6px;
  font-size: 13px; line-height: 1.45; outline: none;
  background: var(--bg-input); color: var(--text);
  resize: none; min-height: 34px; max-height: 160px;
  overflow-y: auto; font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder { color: var(--text-faint); }
  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-alpha);
  }
  &:disabled { background: var(--bg-subtle); color: var(--text-muted); cursor: not-allowed; }
}

.ai-panel__send-btn {
  width: 34px; height: 34px;
  border: none; border-radius: 6px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-subtle); color: var(--text-faint);
  border: 1px solid var(--border);
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-ready {
    background: var(--accent);
    color: #ffffff;
    border: none;
    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
    &:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.35);
    }
    &:active {
      transform: translateY(0) scale(0.95);
    }
  }

  &:disabled {
    background: var(--bg-subtle);
    color: var(--text-faint);
    border: 1px solid var(--border);
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }

  &--stop {
    background: #ef4444;
    color: #ffffff;
    border: none;
    opacity: 1;
    &:hover:not(:disabled) {
      background: #dc2626;
      transform: scale(1.04);
    }
  }
}
</style>
