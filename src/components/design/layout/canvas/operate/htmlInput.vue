<template>
  <operate-form-item style="align-items: start">
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <div class="html-editor-trigger">
        <div class="html-editor-trigger__actions">
          <el-button size="small" type="primary" plain @click="openEditor">全屏编辑</el-button>
          <el-button size="small" @click="clearContent" :disabled="!model">清空</el-button>
        </div>
      </div>
    </template>
  </operate-form-item>

  <el-dialog
    v-model="dialogVisible"
    title="编辑 HTML 代码"
    fullscreen
    append-to-body
    class="html-editor-dialog"
    :close-on-click-modal="false"
    @open="handleDialogOpen"
  >
    <div class="html-editor-dialog__layout">
      <div class="html-editor-dialog__main">
        <div class="html-editor-dialog__toolbar">
          <div class="html-editor-dialog__hint">
            支持 HTML + 内联 <code>&lt;style&gt;</code>，推荐使用
            <code v-pre>{{text.title}}</code>、<code v-pre>{{color.primary}}</code>、
            <code v-pre>{{image.logo.url}}</code> 这类变量写法。
            <span class="html-editor-dialog__meta">{{ draftSummary }}</span>
          </div>
        </div>

        <div v-if="editorError" class="html-editor-dialog__error">
          <span>{{ editorError }}</span>
          <el-button size="small" type="primary" link @click="retryLoadEditor">重新加载</el-button>
        </div>

        <div v-loading="loadingEditor" class="html-editor-dialog__editor-shell">
          <div v-show="!editorError" ref="editorContainerRef" class="html-editor-dialog__editor"></div>
        </div>
      </div>

      <div class="html-editor-dialog__sidebar">
        <el-tabs v-model="activeTabName" class="html-editor-dialog__tabs" stretch>
          <!-- Tab 1: 模板变量 -->
          <el-tab-pane label="模板变量" name="variables">
            <div class="html-editor-dialog__sidebar-content">
              <div class="html-editor-dialog__section-header">
                <span>提示：点击变量可以直接插入到编辑器光标处</span>
              </div>

              <!-- 模板/魔术变量 -->
              <div class="html-editor-dialog__variable-section">
                <div class="html-editor-dialog__variable-section-name">
                  当前模板变量
                  <span class="badge" v-if="templateMagicVariableItems.length">
                    {{ templateMagicVariableItems.length }}
                  </span>
                </div>
                <div v-if="templateMagicVariableItems.length" class="html-editor-dialog__variable-list compact-list">
                  <div
                    v-for="item in templateMagicVariableItems"
                    :key="item.token"
                    class="html-editor-dialog__variable-row"
                    @click="insertVariable(item.token)"
                  >
                    <div class="variable-token-container">
                      <el-tag size="small" :type="getBadgeType(item.type)" class="type-tag">{{ item.type.toUpperCase() }}</el-tag>
                      <code class="clickable-code">{{ item.token }}</code>
                    </div>
                    <span class="variable-desc">{{ item.description }}</span>
                  </div>
                </div>
                <div v-else class="html-editor-dialog__variable-empty">
                  当前暂无已识别的模板变量。
                </div>
              </div>

              <!-- 系统变量 -->
              <div class="html-editor-dialog__variable-section" style="margin-top: 16px;">
                <div class="html-editor-dialog__variable-section-name">
                  内置系统变量
                  <span class="badge">{{ systemMagicVariableItems.length }}</span>
                </div>
                <div class="html-editor-dialog__variable-list compact-list">
                  <div
                    v-for="item in systemMagicVariableItems"
                    :key="item.token"
                    class="html-editor-dialog__variable-row"
                    @click="insertVariable(item.token)"
                  >
                    <div class="variable-token-container">
                      <el-tag size="small" type="info" class="type-tag">SYS</el-tag>
                      <code class="clickable-code">{{ item.token }}</code>
                    </div>
                    <span class="variable-desc">{{ item.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- Tab 2: 组件配置 -->
          <el-tab-pane label="组件配置" name="widget">
            <div class="html-editor-dialog__sidebar-content scrollable-panel">
              <div v-if="boundChildren.length === 0" class="widget-empty">
                <el-empty description="当前模板没有挂载子组件" :image-size="60">
                  <template #extra>
                    <div style="font-size: 11px; color: #8a8f98; line-height: 1.6; text-align: left; padding: 0 10px;">
                      您可以在 HTML 代码中添加形如 <code v-pre>{{child.chart}}</code> 的变量，然后在页面右侧面板将其绑定为特定组件（如 ECharts 图表、二维码等）。
                    </div>
                  </template>
                </el-empty>
              </div>
              <div v-else class="widget-config-panel">
                <div class="widget-select-row">
                  <div class="widget-label">选择要配置的组件：</div>
                  <el-select v-model="selectedChildId" placeholder="选择组件进行配置" style="width: 100%">
                    <el-option
                      v-for="child in boundChildren"
                      :key="child.id"
                      :value="child.id"
                      :label="`${canvasChildLabelMap[child.type]} (${child.id.slice(-4)})`"
                    />
                  </el-select>
                </div>

                <div v-if="selectedChild" class="widget-form-container">
                  <div class="widget-form-header">
                    <span class="widget-type-badge">{{ selectedChild.type.toUpperCase() }}</span>
                    <span class="widget-id-text">ID: {{ selectedChild.id.slice(-6) }}</span>
                  </div>
                  <div class="widget-form-content">
                    <component :is="CanvasChildOperationComponentMap[selectedChild.type]" />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- Tab 3: 语法速查 -->
          <el-tab-pane label="语法速查" name="docs">
            <div class="html-editor-dialog__sidebar-content scrollable-panel font-size-11">
              <div class="doc-section">
                <div class="doc-title">变量语法规范</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>文字</strong>: <code v-pre>{{text.title}}</code></div>
                  <div class="doc-bullet"><strong>颜色</strong>: <code v-pre>{{color.primary}}</code> 或 <code v-pre>{{color.primary.css}}</code></div>
                  <div class="doc-bullet"><strong>图片</strong>: <code v-pre>{{image.logo.url}}</code></div>
                  <div class="doc-bullet"><strong>组件</strong>: <code v-pre>{{child.salesChart}}</code></div>
                  <div class="doc-bullet"><strong>HTML子模板</strong>: <code v-pre>{{html.subBlock}}</code></div>
                </div>
              </div>
              
              <div class="doc-section" style="margin-top: 12px;">
                <div class="doc-title">CSS 限定范围保护</div>
                <div class="doc-content">
                  <div class="doc-paragraph">
                    编辑器支持手写 <code>&lt;style&gt;</code>。保存后，所有 CSS 选择器都会自动被增加属性限制，使其只作用在当前贴纸内，避免样式冲突。
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <template #footer>
      <div class="html-editor-dialog__footer">
        <div class="html-editor-dialog__footer-tip">
          当前元素只维护一份 HTML 源码；模板库和变量绑定最终都会编译到这里。
        </div>
        <div class="html-editor-dialog__footer-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/text-content.svg?component";
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import {
  detachHtmlTemplateFromTarget,
  hasHtmlMagicVariables,
  syncHtmlTemplateFieldsFromContent,
} from "@/components/design/layout/canvas/htmlTemplate/runtime.ts";
import type { HtmlTemplateFieldDefinition } from "@/components/design/layout/canvas/htmlTemplate/types";

import {
  canvasStickerOptions,
  currentOperatingCanvasChildId,
  CanvasChildOperationComponentMap,
  canvasChildLabelMap,
} from "../index.tsx";

import { EditorState, Extension } from "@codemirror/state";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { html } from "@codemirror/lang-html";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";

const model = defineModel<string>({ default: "" });

const props = defineProps({
  label: {
    default: "html代码",
  },
  placeholder: {
    default: "请输入",
  },
  templateTarget: {
    type: Object,
    default: null,
  },
});

const dialogVisible = ref(false);
const loadingEditor = ref(false);
const editorError = ref("");
const draftValue = ref("");
const editorContainerRef = ref<HTMLElement | null>(null);
const editorInstance = shallowRef<EditorView | null>(null);

const activeTabName = ref("variables");
const selectedChildId = ref("");
let originalActiveChildId = "this_is_html_id";

const boundChildren = computed(() => {
  if (!canvasStickerOptions.value?.children) return [];
  return canvasStickerOptions.value.children.filter(
    (c: any) => c.type !== "canvas" && c.type !== "html"
  );
});

const selectedChild = computed(() => {
  return canvasStickerOptions.value.children.find((c: any) => c.id === selectedChildId.value);
});

function getBadgeType(type: string) {
  switch (type) {
    case "text":
    case "textarea":
      return "info";
    case "color":
      return "success";
    case "image":
      return "warning";
    case "font":
      return "primary";
    case "child":
      return "danger";
    case "html":
      return "warning";
    default:
      return "info";
  }
}

function insertVariable(token: string) {
  if (!editorInstance.value) return;
  const view = editorInstance.value;
  const state = view.state;
  const mainSelection = state.selection.main;
  
  view.dispatch({
    changes: {
      from: mainSelection.from,
      to: mainSelection.to,
      insert: token
    },
    selection: { anchor: mainSelection.from + token.length }
  });
  view.focus();
}

function restoreActiveElement() {
  currentOperatingCanvasChildId.value = originalActiveChildId;
}

watch(activeTabName, (tab) => {
  if (tab === "variables") {
    currentOperatingCanvasChildId.value = "this_is_html_id";
  } else if (tab === "widget" && selectedChildId.value) {
    currentOperatingCanvasChildId.value = selectedChildId.value;
  }
});

watch(selectedChildId, (newId) => {
  if (activeTabName.value === "widget" && newId) {
    currentOperatingCanvasChildId.value = newId;
  }
});

const draftSummary = computed(() => {
  const value = String(draftValue.value ?? "");
  return `${value.split(/\r?\n/).length} 行 · ${value.length} 字符`;
});

const systemMagicVariableItems = [
  { token: "{{canvas.width}}", description: "画布宽度数值", type: "canvas" },
  { token: "{{canvas.height}}", description: "画布高度数值", type: "canvas" },
  { token: "{{canvas.widthUnit}}", description: "画布宽度单位", type: "canvas" },
  { token: "{{canvas.heightUnit}}", description: "画布高度单位", type: "canvas" },
  { token: "{{canvas.widthCss}}", description: "画布宽度 CSS 值", type: "canvas" },
  { token: "{{canvas.heightCss}}", description: "画布高度 CSS 值", type: "canvas" },
  { token: "{{element.id}}", description: "当前元素 id", type: "element" },
  { token: "{{element.zIndex}}", description: "当前元素层级", type: "element" },
];

const templateMagicVariableItems = computed(() => {
  const fields = Array.isArray(props.templateTarget?.htmlTemplateFields)
    ? (props.templateTarget?.htmlTemplateFields as HtmlTemplateFieldDefinition[])
    : [];

  return fields.flatMap((field) => createMagicVariableItemsForField(field));
});

function createMagicVariableItemsForField(field: HtmlTemplateFieldDefinition): any[] {
  switch (field.type) {
    case "color":
      return [
        {
          token: `{{${field.key}}}`,
          description: `${field.label}，直接输出颜色值`,
          type: field.type,
        },
        {
          token: `{{${field.key}.css}}`,
          description: `${field.label}，颜色 CSS 别名`,
          type: field.type,
        },
      ];
    case "image":
      return [
        {
          token: `{{${field.key}.url}}`,
          description: `${field.label}，图片地址`,
          type: field.type,
        },
        {
          token: `{{${field.key}.src}}`,
          description: `${field.label}，图片地址别名`,
          type: field.type,
        },
        {
          token: `{{${field.key}.name}}`,
          description: `${field.label}，图片名称`,
          type: field.type,
        },
      ];
    case "font":
      return [
        {
          token: `{{${field.key}.family}}`,
          description: `${field.label}，渲染后的字体 family`,
          type: field.type,
        },
        {
          token: `{{${field.key}.name}}`,
          description: `${field.label}，字体名称`,
          type: field.type,
        },
      ];
    case "child":
      return [
        {
          token: field.key.startsWith("child.") ? `{{${field.key}}}` : `{{child.${field.key}}}`,
          description: `${field.label}，嵌入组件插槽（如 ECharts、Sticker 等）`,
          type: field.type,
        },
      ];
    case "html":
      return [
        {
          token: field.key.startsWith("html.") ? `{{${field.key}}}` : `{{html.${field.key}}}`,
          description: `${field.label}，递归嵌套的 HTML 代码片段`,
          type: field.type,
        },
      ];
    case "textarea":
    case "text":
    default:
      return [
        {
          token: `{{${field.key}}}`,
          description: `${field.label}，文本变量`,
          type: field.type,
        },
      ];
  }
}

/** Build autocomplete completions from magic variable lists */
function buildCompletions(cx: CompletionContext) {
  const allVariables: any[] = [
    ...systemMagicVariableItems,
    ...templateMagicVariableItems.value,
  ];

  const word = cx.matchBefore(/\{\{[\w.]*$/);
  if (!word || word.from === word.to) return null;

  return {
    from: word.from,
    options: allVariables.map((v) => ({
      label: v.token,
      type: "variable",
      detail: v.description,
    })),
  };
}

function refreshEditor() {
  nextTick(() => {
    if (!editorInstance.value) return;
    editorInstance.value.dispatch({ selection: editorInstance.value.state.selection });
    editorInstance.value.focus();
  });
}

function syncEditorValue(value: string) {
  if (!editorInstance.value) return;
  if (editorInstance.value.state.doc.toString() === value) {
    refreshEditor();
    return;
  }
  editorInstance.value.dispatch({
    changes: {
      from: 0,
      to: editorInstance.value.state.doc.length,
      insert: value,
    },
  });
  refreshEditor();
}

function mountEditor() {
  if (!editorContainerRef.value) return;

  if (editorInstance.value) {
    syncEditorValue(draftValue.value);
    return;
  }

  const extensions: Extension[] = [
    html({
      selfClosingTags: true,
      matchClosingTags: true,
    }),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    foldGutter(),
    bracketMatching(),
    closeBrackets(),
    autocompletion({ override: [buildCompletions] }),
    indentUnit.of("  "),
    indentOnInput(),
    history(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
    ]),
    oneDark,
    EditorView.lineWrapping,
    EditorView.updateListener.of((update: ViewUpdate) => {
      if (update.docChanged) {
        const nextValue = update.state.doc.toString();
        if (nextValue !== draftValue.value) {
          draftValue.value = nextValue;
        }
      }
    }),
    EditorState.tabSize.of(2),
  ];

  const state = EditorState.create({
    doc: draftValue.value,
    extensions,
  });

  editorInstance.value = new EditorView({
    state,
    parent: editorContainerRef.value,
  });
}

function openEditor() {
  draftValue.value = String(model.value ?? "");
  editorError.value = "";
  dialogVisible.value = true;
}

async function initializeEditor() {
  loadingEditor.value = true;
  editorError.value = "";

  try {
    // 确保 DOM 更新完成后再挂载编辑器
    await nextTick();
    // 再等一帧确保 dialog 容器有实际尺寸
    await new Promise((r) => requestAnimationFrame(r));

    if (!editorContainerRef.value) {
      throw new Error("Editor container not available");
    }

    mountEditor();
  } catch (error) {
    console.error("[htmlInput] failed to initialize CodeMirror 6", error);
    editorError.value = `编辑器加载失败：${error instanceof Error ? error.message : "请稍后重试。"}`;
  } finally {
    loadingEditor.value = false;
  }
}

function handleDialogOpen() {
  initializeEditor();
}

function retryLoadEditor() {
  // Destroy existing instance and reinitialize
  if (editorInstance.value) {
    editorInstance.value.destroy();
    editorInstance.value = null;
  }
  initializeEditor();
}

function handleCancel() {
  draftValue.value = String(model.value ?? "");
  syncEditorValue(draftValue.value);
  dialogVisible.value = false;
}

function handleSave() {
  const nextValue = String(draftValue.value ?? "");
  const previousValue = String(model.value ?? "");
  const hasChanged = nextValue !== previousValue;

  model.value = nextValue;

  if (hasChanged && props.templateTarget) {
    const preserveBindings = hasHtmlMagicVariables(nextValue);
    if (preserveBindings) {
      const inferredFields = syncHtmlTemplateFieldsFromContent(props.templateTarget, nextValue);
      detachHtmlTemplateFromTarget(props.templateTarget, {
        preserveBindings: inferredFields.length > 0,
      });
    } else {
      detachHtmlTemplateFromTarget(props.templateTarget);
    }
  }

  dialogVisible.value = false;
}

function clearContent() {
  model.value = "";
  draftValue.value = "";
  syncEditorValue("");

  if (props.templateTarget) {
    detachHtmlTemplateFromTarget(props.templateTarget);
  }
}

watch(dialogVisible, (visible) => {
  if (visible) {
    refreshEditor();
  }
});

watch(
  () => model.value,
  (value) => {
    if (!dialogVisible.value) {
      draftValue.value = String(value ?? "");
    }
  }
);

onBeforeUnmount(() => {
  if (editorInstance.value) {
    editorInstance.value.destroy();
    editorInstance.value = null;
  }
  if (editorContainerRef.value) {
    editorContainerRef.value.innerHTML = "";
  }
});
</script>

<style scoped lang="less">
.html-editor-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.html-editor-trigger__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.html-editor-dialog__layout {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
  height: 100%;
}

.html-editor-dialog__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow: hidden;
}

.html-editor-dialog__sidebar {
  width: 420px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 180px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  overflow: hidden;
}

.html-editor-dialog__sidebar-header {
  flex-shrink: 0;
  padding: 16px 20px;
  background: rgba(248, 250, 252, 0.9);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.html-editor-dialog__sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.html-editor-dialog__sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 20px;
  max-height: calc(100vh - 240px);
}

.html-editor-dialog__doc-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.html-editor-dialog__doc-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.html-editor-dialog__doc-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.html-editor-dialog__doc-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.html-editor-dialog__doc-item {
  font-size: 11px;
  line-height: 1.5;
  color: #64748b;
}

.html-editor-dialog__doc-item strong {
  color: #475569;
}

.html-editor-dialog__doc-item code {
  padding: 1px 4px;
  border-radius: 3px;
  background: #f1f5f9;
  color: #0369a1;
  font-size: 10px;
}

.html-editor-dialog__doc-note {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(239, 246, 255, 0.9);
  border: 1px solid rgba(147, 197, 253, 0.7);
  color: #1e40af;
  font-size: 11px;
  line-height: 1.5;
}

.html-editor-dialog__doc-note code {
  padding: 1px 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  color: #1d4ed8;
  font-size: 10px;
}

.html-editor-dialog__field-config {
  margin: 8px 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.html-editor-dialog__field-config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11px;
  line-height: 1.4;
  color: #64748b;
}

.html-editor-dialog__field-config-item:last-child {
  margin-bottom: 0;
}

.html-editor-dialog__field-config-item code {
  min-width: 60px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #ffffff;
  color: #0369a1;
  font-size: 10px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
}

.html-editor-dialog__doc-type {
  padding: 8px 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.html-editor-dialog__doc-type-name {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.html-editor-dialog__doc-type-syntax {
  margin-bottom: 4px;
}

.html-editor-dialog__doc-type-syntax code {
  padding: 2px 6px;
  border-radius: 4px;
  background: #ffffff;
  color: #0369a1;
  font-size: 10px;
  border: 1px solid #e2e8f0;
}

.html-editor-dialog__doc-type-desc {
  font-size: 10px;
  color: #64748b;
  line-height: 1.4;
}

.html-editor-dialog__doc-example {
  margin-bottom: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.html-editor-dialog__doc-example:last-child {
  margin-bottom: 0;
}

.html-editor-dialog__doc-example-title {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.html-editor-dialog__doc-example-code {
  font-family: 'SFMono-Regular', 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

.html-editor-dialog__doc-example-code code {
  display: block;
  padding: 6px 8px;
  border-radius: 4px;
  background: #ffffff;
  color: #0f172a;
  font-size: 10px;
  line-height: 1.4;
  border: 1px solid #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
}

.html-editor-dialog__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.88);
}

.html-editor-dialog__hint {
  flex: 1;
  font-size: 12px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.html-editor-dialog__hint code {
  padding: 1px 4px;
  border-radius: 4px;
  background: var(--el-fill-color-light);
  color: var(--el-color-primary);
  font-size: 11px;
}

.html-editor-dialog__meta {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-left: 4px;
}


.html-editor-dialog__variable-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.html-editor-dialog__variable-section-name {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
}

.html-editor-dialog__variable-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  padding-right: 4px;
}

.html-editor-dialog__variable-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(226, 232, 240, 0.86);
  background: #f8fafc;
}

.html-editor-dialog__variable-item code {
  width: fit-content;
  padding: 1px 5px;
  border-radius: 4px;
  background: #ffffff;
  color: var(--el-color-primary);
  font-size: 11px;
  flex-shrink: 0;
}

.html-editor-dialog__variable-item span {
  font-size: 11px;
  color: #64748b;
}

.html-editor-dialog__variable-empty {
  padding: 6px 8px;
  border-radius: 6px;
  background: #f8fafc;
  font-size: 11px;
  line-height: 1.5;
  color: #64748b;
}

.html-editor-dialog__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--el-color-danger-light-5);
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  font-size: 13px;
  box-shadow: 0 10px 24px rgba(252, 165, 165, 0.14);
}

.html-editor-dialog__editor-shell {
  flex: 1 1 auto;
  min-height: 400px;
  max-height: calc(100vh - 180px);
  height: 100%;
  padding: 4px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 10px;
  overflow: auto;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.html-editor-dialog__editor {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.html-editor-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.html-editor-dialog__footer-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.html-editor-dialog__footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.html-editor-dialog.el-dialog.is-fullscreen) {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #eff4fa 100%);
}

:deep(.html-editor-dialog .el-dialog) {
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
}

:deep(.html-editor-dialog .el-dialog__header) {
  flex-shrink: 0;
  margin: 0;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
}

:deep(.html-editor-dialog .el-dialog__body) {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 12px 20px;
  height: calc(100vh - 100px);
}

:deep(.html-editor-dialog .el-dialog__footer) {
  position: sticky;
  bottom: 0;
  z-index: 2;
  flex-shrink: 0;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  box-shadow: 0 -12px 30px rgba(15, 23, 42, 0.06);
  padding: 8px 20px 12px;
}

:deep(.html-editor-dialog__editor .cm-editor) {
  height: 100% !important;
  min-height: 400px;
  font-size: 14px;
  line-height: 1.6;
  font-family:
    "SFMono-Regular",
    "JetBrains Mono",
    "Fira Code",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
}

:deep(.html-editor-dialog__editor .cm-scroller) {
  height: 100% !important;
  min-height: 400px;
  overflow-y: auto !important;
}

:deep(.html-editor-dialog__editor .cm-content) {
  padding: 10px 0;
}

:deep(.html-editor-dialog__editor .cm-tooltip-autocomplete) {
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.html-editor-dialog__editor .cm-tooltip-autocomplete ul li) {
  padding: 4px 8px;
  font-size: 13px;
}

:deep(.html-editor-dialog__editor-shell .el-loading-mask) {
  background: rgba(248, 250, 252, 0.72);
}

@media (max-width: 768px) {
  .html-editor-trigger {
    justify-content: flex-end;
  }

  .html-editor-trigger__actions {
    flex-wrap: wrap;
  }

  .html-editor-dialog__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .html-editor-dialog__sidebar {
    display: none;
  }

  .html-editor-dialog__variable-list {
    grid-template-columns: 1fr;
    max-height: 180px;
  }

  .html-editor-dialog__footer-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Custom Tabs for the Sidebar */
:deep(.html-editor-dialog__tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .el-tabs__header {
    margin: 0;
    background: rgba(248, 250, 252, 0.9);
    border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  }
  
  .el-tabs__item {
    font-size: 12px;
    font-weight: 500;
    height: 38px;
    line-height: 38px;
  }
  
  .el-tabs__content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  
  .el-tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

/* Scrollable Panel inside Tabs */
.scrollable-panel {
  flex: 1;
  overflow-y: auto !important;
  max-height: calc(100vh - 220px) !important;
}

/* Magic Variables UI */
.html-editor-dialog__section-header {
  padding: 8px 10px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  margin-bottom: 12px;
  
  span {
    color: #166534;
    font-size: 10px;
    font-weight: 500;
  }
}

.html-editor-dialog__variable-section {
  .html-editor-dialog__variable-section-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
    
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #e2e8f0;
      color: #475569;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 9999px;
    }
  }
}

.compact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.html-editor-dialog__variable-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    background: #f0f7ff;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.05);
    
    .clickable-code {
      color: #2563eb;
    }
  }
}

.variable-token-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-tag {
  font-size: 8px;
  font-weight: 700;
  padding: 0 4px;
  height: 15px;
  line-height: 15px;
}

.clickable-code {
  font-size: 11px;
  font-weight: 600;
  color: #0f172a;
  background: transparent;
  padding: 0;
  border: none;
}

.variable-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

/* Widgets Config UI */
.widget-empty {
  padding: 30px 10px;
}

.widget-config-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-select-row {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  
  .widget-label {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
  }
}

.widget-form-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  
  .widget-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f1f5f9;
    padding: 8px 12px;
    border-bottom: 1px solid #e2e8f0;
    
    .widget-type-badge {
      font-size: 10px;
      font-weight: 700;
      color: #3b82f6;
      background: #eff6ff;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #bfdbfe;
    }
    
    .widget-id-text {
      font-size: 10px;
      color: #64748b;
      font-family: monospace;
    }
  }
  
  .widget-form-content {
    padding: 12px;
    background: #ffffff;
    
    :deep(.operate-form-item) {
      margin-bottom: 12px;
      
      .operate-form-item-title {
        font-size: 11px;
        color: #475569;
      }
    }
  }
}

/* Compact Docs UI */
.font-size-11 {
  font-size: 11px;
}

.doc-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  
  .doc-title {
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
  }
  
  .doc-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    .doc-bullet {
      color: #475569;
      
      code {
        background: #e2e8f0;
        color: #0f172a;
        padding: 2px 4px;
        border-radius: 4px;
        font-size: 10px;
      }
    }
    
    .doc-paragraph {
      color: #64748b;
      line-height: 1.6;
      
      code {
        background: #e2e8f0;
        color: #0f172a;
        padding: 1px 4px;
        border-radius: 4px;
        font-size: 10px;
      }
    }
  }
}
</style>
