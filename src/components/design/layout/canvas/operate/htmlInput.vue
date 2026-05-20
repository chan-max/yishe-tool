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
        <div class="html-editor-dialog__sidebar-header">
          <h3>魔术变量</h3>
        </div>
        <div class="html-editor-dialog__sidebar-content">
          <div class="html-editor-dialog__doc-section">
            <div class="html-editor-dialog__doc-title">支持范围</div>
            <div class="html-editor-dialog__doc-content">
              <div class="html-editor-dialog__doc-item">
                <strong>可写内容：</strong>普通 HTML 标签 + 内联 <code>&lt;style&gt;</code>。
              </div>
              <div class="html-editor-dialog__doc-item">
                <strong>样式处理：</strong><code>&lt;style&gt;</code> 里的选择器会自动限定到当前贴纸元素，不会直接污染整个画布。
              </div>
              <div class="html-editor-dialog__doc-item">
                <strong>安全过滤：</strong><code>&lt;script&gt;</code>、<code>iframe</code>、事件属性（如 <code>onclick</code>）以及危险链接会被清理。
              </div>
              <div class="html-editor-dialog__doc-item">
                <strong>布局限制：</strong><code>position: fixed</code> 会被改写为 <code>position: absolute</code>。
              </div>
              <div class="html-editor-dialog__doc-note">
                右侧下方“当前模板变量”列表，才是这一个元素当前真正可用的变量全集。
              </div>
            </div>
          </div>

          <div class="html-editor-dialog__doc-section">
            <div class="html-editor-dialog__doc-title">变量从哪里来</div>
            <div class="html-editor-dialog__doc-content">
              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">系统变量</div>
                <div class="html-editor-dialog__doc-type-desc">
                  固定支持 <code v-pre>{{canvas.width}}</code>、<code v-pre>{{canvas.heightCss}}</code>、
                  <code v-pre>{{element.id}}</code>、<code v-pre>{{element.zIndex}}</code>。
                </div>
              </div>

              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">模板库变量</div>
                <div class="html-editor-dialog__doc-type-desc">
                  从“模板库”选中的模板自带字段而来，保存后可在“模板绑定”里改内容、颜色、图片、字体等。
                </div>
              </div>

              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">手写 HTML 自动识别变量</div>
                <div class="html-editor-dialog__doc-type-desc">
                  直接在 HTML 中写变量并保存后，会自动识别一部分变量并生成“模板绑定”面板。
                </div>
              </div>

              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">旧写法提醒</div>
                <div class="html-editor-dialog__doc-type-syntax">
                  <code v-pre>{{title}}</code>
                </div>
                <div class="html-editor-dialog__doc-type-desc">
                  这类没有类型前缀的写法，不适合作为手写 HTML 的通用定义方式；请改成
                  <code v-pre>{{text.title}}</code> 这类带前缀写法。
                </div>
              </div>
            </div>
          </div>

          <div class="html-editor-dialog__doc-section">
            <div class="html-editor-dialog__doc-title">手写 HTML 时推荐写法</div>
            <div class="html-editor-dialog__doc-content">
              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">文本 / 多行文本</div>
                <div class="html-editor-dialog__doc-type-syntax">
                  <code v-pre>{{text.title}}</code>、<code v-pre>{{text.desc}}</code>
                </div>
                <div class="html-editor-dialog__doc-type-desc">用于标题、正文、说明文案；多行文本同样写成 <code v-pre>{{text.xxx}}</code>。</div>
              </div>

              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">颜色</div>
                <div class="html-editor-dialog__doc-type-syntax">
                  <code v-pre>{{color.primary}}</code>、<code v-pre>{{color.primary.css}}</code>
                </div>
                <div class="html-editor-dialog__doc-type-desc">可直接用于文字色、背景色、边框色；<code>.css</code> 也会输出颜色值。</div>
              </div>

              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">图片</div>
                <div class="html-editor-dialog__doc-type-syntax">
                  <code v-pre>{{image.logo.url}}</code>、<code v-pre>{{image.logo.src}}</code>、<code v-pre>{{image.logo.name}}</code>
                </div>
                <div class="html-editor-dialog__doc-type-desc">通常把 <code>.url</code> / <code>.src</code> 放到 <code>img src</code>，把 <code>.name</code> 放到 <code>alt</code>。</div>
              </div>

              <div class="html-editor-dialog__doc-type">
                <div class="html-editor-dialog__doc-type-name">字体</div>
                <div class="html-editor-dialog__doc-type-syntax">
                  <code v-pre>{{font.brand.family}}</code>、<code v-pre>{{font.brand.name}}</code>
                </div>
                <div class="html-editor-dialog__doc-type-desc">推荐在 CSS 的 <code>font-family</code> 中使用 <code>.family</code>。</div>
              </div>
            </div>
          </div>

          <div class="html-editor-dialog__doc-section">
            <div class="html-editor-dialog__doc-title">模板库变量如何继续使用</div>
            <div class="html-editor-dialog__doc-content">
              <div class="html-editor-dialog__doc-item">
                <strong>沿用现有 key：</strong>如果模板库里原本就是 <code v-pre>{{style.size}}</code>、
                <code v-pre>{{text.title}}</code> 这类 key，编辑 HTML 时继续原样使用即可。
              </div>
              <div class="html-editor-dialog__doc-item">
                <strong>修改入口：</strong>模板自带字段请到“模板绑定”里改值，不需要在 HTML 里重新定义字段结构。
              </div>
              <div class="html-editor-dialog__doc-item">
                <strong>新增变量建议：</strong>如果是手写 HTML 新增变量，优先使用
                <code>text</code>、<code>color</code>、<code>image</code>、<code>font</code>
                这几类前缀，保存后更容易自动生成绑定项。
              </div>
              <div class="html-editor-dialog__doc-note">
                像 <code v-pre>{{style.xxx}}</code> 这种模板自带变量可以正常渲染，但更适合由模板库预先定义，而不是作为手写 HTML 的通用新增写法。
              </div>
            </div>
          </div>

          <div class="html-editor-dialog__doc-section">
            <div class="html-editor-dialog__doc-title">常见示例</div>
            <div class="html-editor-dialog__doc-content">
              <div class="html-editor-dialog__doc-example">
                <div class="html-editor-dialog__doc-example-title">标题文字</div>
                <div class="html-editor-dialog__doc-example-code">
                  <code v-pre>&lt;h1&gt;{{text.title}}&lt;/h1&gt;</code>
                </div>
              </div>

              <div class="html-editor-dialog__doc-example">
                <div class="html-editor-dialog__doc-example-title">图片</div>
                <div class="html-editor-dialog__doc-example-code">
                  <code v-pre>&lt;img src="{{image.logo.url}}" alt="{{image.logo.name}}"&gt;</code>
                </div>
              </div>

              <div class="html-editor-dialog__doc-example">
                <div class="html-editor-dialog__doc-example-title">字体 + 样式块</div>
                <div class="html-editor-dialog__doc-example-code">
                  <code v-pre>&lt;style&gt;.title { font-family: {{font.brand.family}}, sans-serif; color: {{color.primary}}; }&lt;/style&gt;</code>
                </div>
              </div>
            </div>
          </div>

          <div class="html-editor-dialog__doc-section">
            <div class="html-editor-dialog__doc-title">当前模板变量</div>
            <div class="html-editor-dialog__variable-section">
              <div class="html-editor-dialog__variable-section-name">
                系统变量
                <span>· {{ systemMagicVariableItems.length }} 项</span>
              </div>
              <div class="html-editor-dialog__variable-list">
                <div
                  v-for="item in systemMagicVariableItems"
                  :key="item.token"
                  class="html-editor-dialog__variable-item"
                >
                  <code>{{ item.token }}</code>
                  <span>{{ item.description }}</span>
                </div>
              </div>
            </div>

            <div class="html-editor-dialog__variable-section">
              <div class="html-editor-dialog__variable-section-name">
                模板变量
                <span v-if="templateMagicVariableItems.length">
                  · {{ templateMagicVariableItems.length }} 项
                </span>
              </div>
              <div v-if="templateMagicVariableItems.length" class="html-editor-dialog__variable-list">
                <div
                  v-for="item in templateMagicVariableItems"
                  :key="item.token"
                  class="html-editor-dialog__variable-item"
                >
                  <code>{{ item.token }}</code>
                  <span>{{ item.description }}</span>
                </div>
              </div>
              <div v-else class="html-editor-dialog__variable-empty">
                当前没有模板变量。你可以直接写纯 HTML / CSS，或先从模板库选择带变量的模板。
              </div>
            </div>
          </div>
        </div>
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

const draftSummary = computed(() => {
  const value = String(draftValue.value ?? "");
  return `${value.split(/\r?\n/).length} 行 · ${value.length} 字符`;
});

const systemMagicVariableItems = [
  { token: "{{canvas.width}}", description: "画布宽度数值" },
  { token: "{{canvas.height}}", description: "画布高度数值" },
  { token: "{{canvas.widthUnit}}", description: "画布宽度单位" },
  { token: "{{canvas.heightUnit}}", description: "画布高度单位" },
  { token: "{{canvas.widthCss}}", description: "画布宽度 CSS 值" },
  { token: "{{canvas.heightCss}}", description: "画布高度 CSS 值" },
  { token: "{{element.id}}", description: "当前元素 id" },
  { token: "{{element.zIndex}}", description: "当前元素层级" },
];

const templateMagicVariableItems = computed(() => {
  const fields = Array.isArray(props.templateTarget?.htmlTemplateFields)
    ? (props.templateTarget?.htmlTemplateFields as HtmlTemplateFieldDefinition[])
    : [];

  return fields.flatMap((field) => createMagicVariableItemsForField(field));
});

function createMagicVariableItemsForField(field: HtmlTemplateFieldDefinition) {
  switch (field.type) {
    case "color":
      return [
        {
          token: `{{${field.key}}}`,
          description: `${field.label}，直接输出颜色值`,
        },
        {
          token: `{{${field.key}.css}}`,
          description: `${field.label}，颜色 CSS 别名`,
        },
      ];
    case "image":
      return [
        {
          token: `{{${field.key}.url}}`,
          description: `${field.label}，图片地址`,
        },
        {
          token: `{{${field.key}.src}}`,
          description: `${field.label}，图片地址别名`,
        },
        {
          token: `{{${field.key}.name}}`,
          description: `${field.label}，图片名称`,
        },
      ];
    case "font":
      return [
        {
          token: `{{${field.key}.family}}`,
          description: `${field.label}，渲染后的字体 family`,
        },
        {
          token: `{{${field.key}.name}}`,
          description: `${field.label}，字体名称`,
        },
      ];
    case "textarea":
    case "text":
    default:
      return [
        {
          token: `{{${field.key}}}`,
          description: `${field.label}，文本变量`,
        },
      ];
  }
}

/** Build autocomplete completions from magic variable lists */
function buildCompletions(cx: CompletionContext) {
  const allVariables = [
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
  width: 320px;
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
</style>
