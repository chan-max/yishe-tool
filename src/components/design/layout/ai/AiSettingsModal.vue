<template>
  <div v-if="modelValue" class="ai-settings-modal-mask" @click.self="handleClose">
    <div class="ai-settings-modal">
      <!-- Header -->
      <div class="ai-settings-modal__header">
        <div class="ai-settings-modal__title-box">
          <span class="ai-settings-modal__icon">⚙️</span>
          <span class="ai-settings-modal__title">AI 运行时设置</span>
        </div>
        <button class="ai-settings-modal__close-btn" @click="handleClose" title="关闭">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="ai-settings-modal__body">
        <!-- 1. 请求模式选择 -->
        <div class="ai-settings-section">
          <div class="ai-settings-section__label">请求连接模式</div>
          <div class="ai-settings-mode-cards">
            <!-- Proxy Card -->
            <div
              class="ai-settings-card"
              :class="{ 'is-active': form.mode === 'proxy' }"
              @click="form.mode = 'proxy'"
            >
              <div class="ai-settings-card__header">
                <div class="ai-settings-card__title-row">
                  <span class="ai-settings-card__icon">⚡️</span>
                  <span class="ai-settings-card__title">服务端代理</span>
                  <span class="ai-settings-card__badge badge-recommended">推荐</span>
                </div>
                <div class="ai-settings-radio">
                  <span class="ai-settings-radio__circle" :class="{ 'is-checked': form.mode === 'proxy' }"></span>
                </div>
              </div>
              <div class="ai-settings-card__desc">
                由后端服务安全中转，无需配置跨域，海外网络专线加速，保障 API Key 安全。
              </div>
            </div>

            <!-- Direct Card -->
            <div
              class="ai-settings-card"
              :class="{ 'is-active': form.mode === 'direct' }"
              @click="form.mode = 'direct'"
            >
              <div class="ai-settings-card__header">
                <div class="ai-settings-card__title-row">
                  <span class="ai-settings-card__icon">🔗</span>
                  <span class="ai-settings-card__title">前端直连</span>
                  <span class="ai-settings-card__badge badge-dev">开发者/本地模型</span>
                </div>
                <div class="ai-settings-radio">
                  <span class="ai-settings-radio__circle" :class="{ 'is-checked': form.mode === 'direct' }"></span>
                </div>
              </div>
              <div class="ai-settings-card__desc">
                浏览器直接请求大模型，延迟最低，支持本地 Ollama / vLLM 或私有网关。
              </div>
            </div>
          </div>
        </div>

        <!-- 2. 直连模式专属配置 -->
        <div v-if="form.mode === 'direct'" class="ai-settings-section ai-settings-direct-config">
          <div class="ai-settings-section__label">直连凭证来源</div>
          
          <div class="ai-settings-sub-sources">
            <label class="ai-settings-sub-radio" @click="form.directKeySource = 'system'">
              <span class="ai-settings-radio__circle" :class="{ 'is-checked': form.directKeySource === 'system' }"></span>
              <span class="ai-settings-sub-radio__label">使用系统分配 Key（解密后直连）</span>
            </label>
            <label class="ai-settings-sub-radio" @click="form.directKeySource = 'custom'">
              <span class="ai-settings-radio__circle" :class="{ 'is-checked': form.directKeySource === 'custom' }"></span>
              <span class="ai-settings-sub-radio__label">使用自定义配置（本地 Ollama / 私有 API）</span>
            </label>
          </div>

          <!-- 自定义参数表单 -->
          <div v-if="form.directKeySource === 'custom'" class="ai-settings-custom-fields">
            <div class="ai-settings-field">
              <label class="ai-settings-field__label">
                API Base URL <span class="required">*</span>
              </label>
              <input
                v-model="form.customConfig.baseURL"
                type="text"
                placeholder="例如 https://api.openai.com/v1 或 http://localhost:11434/v1"
                class="ai-settings-input"
              />
              <div class="ai-settings-field__hint">
                目标端点必须支持浏览器 CORS 跨域请求（如本地 Ollama 可设置 OLLAMA_ORIGINS="*"）。
              </div>
            </div>

            <div class="ai-settings-field">
              <label class="ai-settings-field__label">API Key</label>
              <div class="ai-settings-input-wrapper">
                <input
                  v-model="form.customConfig.apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  class="ai-settings-input"
                />
                <button
                  type="button"
                  class="ai-settings-input-action"
                  @click="showApiKey = !showApiKey"
                  :title="showApiKey ? '隐藏' : '显示'"
                >
                  {{ showApiKey ? '👁️' : '🙈' }}
                </button>
              </div>
              <div class="ai-settings-field__hint">本地 Ollama 或无需鉴权的本地网关可留空。</div>
            </div>

            <div class="ai-settings-field">
              <label class="ai-settings-field__label">默认模型 (Model Name)</label>
              <input
                v-model="form.customConfig.model"
                type="text"
                placeholder="例如 gpt-4o, deepseek-chat, llama3, qwen2.5"
                class="ai-settings-input"
              />
            </div>
          </div>
        </div>

        <!-- 3. 连通性测试区 -->
        <div class="ai-settings-section ai-settings-test-section">
          <div class="ai-settings-test-row">
            <button
              class="ai-settings-btn ai-settings-btn--test"
              :disabled="testing"
              @click="handleTestConnection"
            >
              <span v-if="testing" class="ai-settings-spinner"></span>
              <span>{{ testing ? '正在测试连接...' : '⚡️ 测试当前配置连通性' }}</span>
            </button>
          </div>

          <!-- 测试结果展示 -->
          <div v-if="testResult" class="ai-settings-test-result" :class="testResult.success ? 'is-success' : 'is-error'">
            <div class="ai-settings-test-result__header">
              <span class="ai-settings-test-result__tag">
                {{ testResult.success ? '✓ 连接正常' : '✗ 连接失败' }}
              </span>
              <span v-if="testResult.latencyMs > 0" class="ai-settings-test-result__latency">
                耗时 {{ testResult.latencyMs }}ms
              </span>
              <span v-if="testResult.model" class="ai-settings-test-result__model">
                模型: {{ testResult.model }}
              </span>
            </div>
            <div class="ai-settings-test-result__msg">
              {{ testResult.message }}
            </div>
            <div v-if="testResult.responsePreview" class="ai-settings-test-result__preview">
              响应示例: "{{ testResult.responsePreview }}"
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="ai-settings-modal__footer">
        <button class="ai-settings-btn ai-settings-btn--reset" @click="handleReset">
          恢复默认
        </button>
        <div class="ai-settings-modal__footer-right">
          <button class="ai-settings-btn ai-settings-btn--cancel" @click="handleClose">
            取消
          </button>
          <button class="ai-settings-btn ai-settings-btn--save" @click="handleSave">
            保存并应用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  aiSettings,
  updateAiSettings,
  resetAiSettings,
  testAiConnection,
  type AiSettings,
  type ConnectionTestResult,
} from "@/ai/settings";
import { message } from "ant-design-vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "saved"): void;
}>();

const showApiKey = ref(false);
const testing = ref(false);
const testResult = ref<ConnectionTestResult | null>(null);

const form = reactive<AiSettings>({
  mode: "proxy",
  directKeySource: "system",
  customConfig: {
    baseURL: "https://api.openai.com/v1",
    apiKey: "",
    model: "gpt-4o",
    temperature: 0.7,
  },
});

function initForm() {
  form.mode = aiSettings.value.mode || "proxy";
  form.directKeySource = aiSettings.value.directKeySource || "system";
  form.customConfig = {
    baseURL: aiSettings.value.customConfig?.baseURL || "https://api.openai.com/v1",
    apiKey: aiSettings.value.customConfig?.apiKey || "",
    model: aiSettings.value.customConfig?.model || "gpt-4o",
    temperature: aiSettings.value.customConfig?.temperature ?? 0.7,
  };
  testResult.value = null;
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      initForm();
    }
  },
  { immediate: true },
);

function handleClose() {
  emit("update:modelValue", false);
}

async function handleTestConnection() {
  testing.value = true;
  testResult.value = null;
  try {
    const result = await testAiConnection(form);
    testResult.value = result;
    if (result.success) {
      message.success(`连接测试成功 (耗时: ${result.latencyMs}ms)`);
    } else {
      message.error("连接测试失败，请检查配置");
    }
  } catch (err: any) {
    testResult.value = {
      success: false,
      latencyMs: 0,
      message: err.message || "测试请求异常",
    };
    message.error("测试请求异常");
  } finally {
    testing.value = false;
  }
}

function handleSave() {
  updateAiSettings({
    mode: form.mode,
    directKeySource: form.directKeySource,
    customConfig: {
      baseURL: form.customConfig.baseURL,
      apiKey: form.customConfig.apiKey,
      model: form.customConfig.model,
      temperature: form.customConfig.temperature,
    },
  });
  message.success(
    form.mode === "proxy" ? "已切换至「服务端代理」模式" : "已切换至「前端直连」模式",
  );
  emit("saved");
  handleClose();
}

function handleReset() {
  resetAiSettings();
  initForm();
  message.info("已恢复为默认设置（服务端代理模式）");
}
</script>

<style scoped lang="less">
.ai-settings-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.18s ease-out;
}

.ai-settings-modal {
  width: 520px;
  max-width: 92vw;
  max-height: 88vh;
  background: var(--1s-container-background, #1e1e24);
  color: var(--1s-text-color, #e0e0e0);
  border: 1px solid var(--1s-border-color, rgba(255, 255, 255, 0.12));
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: zoomIn 0.18s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* Header */
.ai-settings-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-settings-modal__title-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-settings-modal__icon {
  font-size: 16px;
}

.ai-settings-modal__title {
  font-size: 15px;
  font-weight: 600;
}

.ai-settings-modal__close-btn {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Body */
.ai-settings-modal__body {
  padding: 16px 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-settings-section__label {
  font-size: 12px;
  font-weight: 600;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Mode Cards */
.ai-settings-mode-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ai-settings-card {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &.is-active {
    background: rgba(99, 102, 241, 0.12);
    border-color: #6366f1;
  }
}

.ai-settings-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-settings-card__title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.ai-settings-card__icon {
  font-size: 14px;
}

.ai-settings-card__title {
  font-size: 13px;
  font-weight: 600;
}

.ai-settings-card__badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;

  &.badge-recommended {
    background: rgba(16, 185, 129, 0.18);
    color: #34d399;
  }

  &.badge-dev {
    background: rgba(245, 158, 11, 0.18);
    color: #fbbf24;
  }
}

.ai-settings-card__desc {
  font-size: 11px;
  color: #8f9099;
  line-height: 1.4;
}

/* Radio circle */
.ai-settings-radio__circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  position: relative;
  display: inline-block;
  flex-shrink: 0;

  &.is-checked {
    border-color: #6366f1;
    background: #6366f1;

    &::after {
      content: "";
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #fff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

/* Direct Config */
.ai-settings-direct-config {
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 14px;
}

.ai-settings-sub-sources {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.ai-settings-sub-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #d1d5db;
}

.ai-settings-custom-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.ai-settings-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-settings-field__label {
  font-size: 12px;
  font-weight: 500;
  color: #bbb;

  .required {
    color: #ef4444;
  }
}

.ai-settings-field__hint {
  font-size: 11px;
  color: #71717a;
  line-height: 1.3;
}

.ai-settings-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.ai-settings-input {
  width: 100%;
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  padding: 0 10px;
  color: #fff;
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #6366f1;
  }
}

.ai-settings-input-action {
  position: absolute;
  right: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
}

/* Test Section */
.ai-settings-test-section {
  padding-top: 4px;
}

.ai-settings-test-row {
  display: flex;
  justify-content: flex-start;
}

.ai-settings-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  transition: all 0.15s;

  &--test {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: #e5e7eb;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.14);
    }
  }

  &--reset {
    background: transparent;
    color: #9ca3af;

    &:hover {
      color: #ef4444;
    }
  }

  &--cancel {
    background: rgba(255, 255, 255, 0.06);
    color: #d1d5db;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &--save {
    background: #6366f1;
    color: #fff;

    &:hover {
      background: #4f46e5;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ai-settings-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Test Result Card */
.ai-settings-test-result {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.is-success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
  }

  &.is-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
  }
}

.ai-settings-test-result__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ai-settings-test-result__msg {
  color: #e5e7eb;
  word-break: break-all;
  line-height: 1.4;
}

.ai-settings-test-result__preview {
  color: #9ca3af;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer */
.ai-settings-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.15);
}

.ai-settings-modal__footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
