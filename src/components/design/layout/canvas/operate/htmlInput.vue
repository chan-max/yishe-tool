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
          <h3>模板变量速查</h3>
        </div>
        <div class="html-editor-dialog__sidebar-content scrollable-panel">
          <div class="html-editor-dialog__section-header">
            <span>提示：点击变量名可快速插入到编辑器光标处</span>
          </div>

          <!-- 当前模板已识别变量 -->
          <div class="html-editor-dialog__variable-section">
            <div class="html-editor-dialog__variable-section-name">
              当前模板变量
              <span class="badge" v-if="templateMagicVariableItems.length">
                {{ templateMagicVariableItems.length }}
              </span>
            </div>
            <div v-if="templateMagicVariableItems.length" class="html-editor-dialog__variable-list compact-list">
              <div
                v-for="field in templateMagicVariableItems"
                :key="field.key"
                class="html-editor-dialog__variable-row"
              >
                <div class="variable-row-left">
                  <div class="variable-header">
                    <el-tag size="small" :type="getBadgeType(field.type)" class="type-tag">{{ field.type.toUpperCase() }}</el-tag>
                    <span class="field-label">{{ field.label }}</span>
                  </div>
                  <div class="tokens-container">
                    <span
                      v-for="tokenItem in field.tokens"
                      :key="tokenItem.token"
                      class="clickable-token-tag"
                      @click="insertVariable(tokenItem.token)"
                      :title="tokenItem.description"
                    >
                      {{ tokenItem.token.replace(/^\{\{/, '').replace(/\}\}$/, '') }}
                    </span>
                  </div>
                </div>
                <div class="variable-row-right" v-if="getFieldBoundId(field)">
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    class="configure-btn"
                    @click.stop="configureComponent(getFieldBoundId(field))"
                  >
                    配置
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else class="html-editor-dialog__variable-empty">
              当前暂无已识别的模板变量。
            </div>
          </div>

          <!-- 内置系统变量 -->
          <div class="html-editor-dialog__variable-section" style="margin-top: 20px;">
            <div class="html-editor-dialog__variable-section-name">
              内置系统变量
            </div>
            <div class="html-editor-dialog__variable-list compact-list">
              <div
                v-for="group in systemGroupedVariables"
                :key="group.label"
                class="html-editor-dialog__variable-row"
              >
                <div class="variable-row-left">
                  <div class="variable-header">
                    <el-tag size="small" type="info" class="type-tag">{{ group.type.toUpperCase() }}</el-tag>
                    <span class="field-label">{{ group.label }}</span>
                  </div>
                  <div class="tokens-container">
                    <span
                      v-for="tokenItem in group.tokens"
                      :key="tokenItem.token"
                      class="clickable-token-tag"
                      @click="insertVariable(tokenItem.token)"
                      :title="tokenItem.description"
                    >
                      {{ tokenItem.token.replace(/^\{\{/, '').replace(/\}\}$/, '') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 语法与组件参考文档 -->
          <div class="html-editor-dialog__variable-section" style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <div class="html-editor-dialog__variable-section-name" style="color: #1e293b; font-weight: 700;">
              语法与组件参考文档
            </div>
            
            <div class="doc-container" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
              <!-- 1. 基础变量 -->
              <div class="doc-section">
                <div class="doc-title">1. 基础画布变量</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>文字排版</strong>: <code v-pre>{{text.fieldName}}</code></div>
                  <div class="doc-bullet">
                    <strong>颜色方案</strong>: <code v-pre>{{color.fieldName}}</code> 
                    <span style="color: #64748b; font-size: 10px;">(CSS别名: <code v-pre>{{color.fieldName.css}}</code>)</span>
                  </div>
                  <div class="doc-bullet"><strong>图片素材</strong>: <code v-pre>{{image.fieldName.url}}</code></div>
                  <div class="doc-bullet"><strong>字体族名</strong>: <code v-pre>{{font.fieldName.family}}</code></div>
                </div>
              </div>

              <!-- 2. 数据与可视化图表 -->
              <div class="doc-section">
                <div class="doc-title">2. 数据与可视化图表</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>ECharts 图表</strong>: <code v-pre>{{echart.chartName}}</code></div>
                  <div class="doc-bullet"><strong>Data UI 图表</strong>: <code v-pre>{{vueDataUi.chartName}}</code></div>
                  <div class="doc-bullet"><strong>Chart.js 图表</strong>: <code v-pre>{{chartjs.chartName}}</code></div>
                  <div class="doc-bullet"><strong>Frappe 极简图表</strong>: <code v-pre>{{frappeChart.chartName}}</code></div>
                  <div class="doc-bullet"><strong>Plotly 科学图表</strong>: <code v-pre>{{plotlyChart.chartName}}</code></div>
                  <div class="doc-bullet"><strong>Vega-Lite 规范</strong>: <code v-pre>{{vegaLite.chartName}}</code></div>
                  <div class="doc-bullet"><strong>xkcd 手绘图表</strong>: <code v-pre>{{chartXkcd.chartName}}</code></div>
                </div>
              </div>

              <!-- 3. 三维、图形与网络拓扑 -->
              <div class="doc-section">
                <div class="doc-title">3. 三维、几何与拓扑网络</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>Three.js 3D场景</strong>: <code v-pre>{{threejs.sceneName}}</code></div>
                  <div class="doc-bullet"><strong>D3 词云图</strong>: <code v-pre>{{wordCloud.cloudName}}</code> <span style="color:#94a3b8;font-size:10px;">(或d3Cloud)</span></div>
                  <div class="doc-bullet"><strong>Cytoscape 关系图</strong>: <code v-pre>{{cytoscape.graphName}}</code> <span style="color:#94a3b8;font-size:10px;">(或cytoscapeGraph)</span></div>
                  <div class="doc-bullet"><strong>Dagre 拓扑图</strong>: <code v-pre>{{dagreGraph.graphName}}</code></div>
                  <div class="doc-bullet"><strong>Rough 手绘图形</strong>: <code v-pre>{{roughShape.shapeName}}</code></div>
                  <div class="doc-bullet"><strong>D3 自定义绘图</strong>: <code v-pre>{{d3.chartName}}</code></div>
                  <div class="doc-bullet"><strong>程序画布 Canvas</strong>: <code v-pre>{{rawCanvas.canvasName}}</code></div>
                  <div class="doc-bullet"><strong>圆形 / 矩形</strong>: <code v-pre>{{child.shapeName}}</code> <span style="color:#94a3b8;font-size:10px;">(ellipse / rect)</span></div>
                </div>
              </div>

              <!-- 4. 排版、艺术字与编码 -->
              <div class="doc-section">
                <div class="doc-title">4. 排版、艺术字与编码</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>二维码 / 条形码</strong>: <code v-pre>{{qrcode.qrName}}</code> / <code v-pre>{{barcode.barName}}</code></div>
                  <div class="doc-bullet"><strong>Figlet 艺术字</strong>: <code v-pre>{{figlet.textName}}</code></div>
                  <div class="doc-bullet"><strong>OpenType 路径字</strong>: <code v-pre>{{child.fontPath}}</code> <span style="color:#94a3b8;font-size:10px;">(opentypeText)</span></div>
                  <div class="doc-bullet"><strong>Shiki 代码高亮</strong>: <code v-pre>{{child.codeName}}</code> <span style="color:#94a3b8;font-size:10px;">(codeBlock)</span></div>
                </div>
              </div>

              <!-- 5. 科学计算、公式与谱图 -->
              <div class="doc-section">
                <div class="doc-title">5. 科学、乐谱与文档结构</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>KaTeX 数学公式</strong>: <code v-pre>{{math.formulaName}}</code></div>
                  <div class="doc-bullet"><strong>Mermaid 流程图</strong>: <code v-pre>{{mermaid.graphName}}</code></div>
                  <div class="doc-bullet"><strong>Graphviz DOT网络</strong>: <code v-pre>{{graphviz.dotName}}</code></div>
                  <div class="doc-bullet"><strong>RDKit 2D分子式</strong>: <code v-pre>{{molecule.molName}}</code></div>
                  <div class="doc-bullet"><strong>3Dmol 3D分子结构</strong>: <code v-pre>{{threeMol.molName}}</code></div>
                  <div class="doc-bullet"><strong>ABC 简易乐谱</strong>: <code v-pre>{{abcNotation.scoreName}}</code></div>
                  <div class="doc-bullet"><strong>VexFlow 五线谱</strong>: <code v-pre>{{vexFlow.scoreName}}</code></div>
                  <div class="doc-bullet"><strong>Markmap 思维导图</strong>: <code v-pre>{{markmapChart.mapName}}</code></div>
                </div>
              </div>

              <!-- 6. 音效、特效与背景纹理 -->
              <div class="doc-section">
                <div class="doc-title">6. 音频、特效与背景纹理</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>Waveform 音频波形</strong>: <code v-pre>{{waveform.waveName}}</code></div>
                  <div class="doc-bullet"><strong>Simplex 噪声纹理</strong>: <code v-pre>{{simplexNoise.noiseName}}</code></div>
                  <div class="doc-bullet"><strong>Particles 粒子特效</strong>: <code v-pre>{{particlesEffect.partName}}</code></div>
                  <div class="doc-bullet"><strong>Confetti 撒花效果</strong>: <code v-pre>{{confetti.effectName}}</code></div>
                  <div class="doc-bullet"><strong>Trianglify 三角背景</strong>: <code v-pre>{{trianglify.patternName}}</code></div>
                  <div class="doc-bullet"><strong>Astronomy 星座图</strong>: <code v-pre>{{starChart.skyName}}</code></div>
                </div>
              </div>

              <!-- 7. 系统与结构 -->
              <div class="doc-section">
                <div class="doc-title">7. 系统控制与结构</div>
                <div class="doc-content">
                  <div class="doc-bullet"><strong>嵌套子 HTML 片段</strong>: <code v-pre>{{html.blockName}}</code></div>
                  <div class="doc-bullet"><strong>通用组件插槽</strong>: <code v-pre>{{child.slotName}}</code></div>
                  <div class="doc-bullet"><strong>CSS 作用域隔离</strong>: 手写 <code>&lt;style&gt;</code> 自动进行沙箱封装，只在当前贴纸内生效。</div>
                </div>
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
  inferHtmlTemplateFieldsFromContent,
} from "@/components/design/layout/canvas/htmlTemplate/runtime.ts";
import type { HtmlTemplateFieldDefinition } from "@/components/design/layout/canvas/htmlTemplate/types";

import {
  canvasStickerOptions,
  currentOperatingCanvasChildId,
  CanvasChildOperationComponentMap,
  canvasChildLabelMap,
  canvasChildDefaultOptionsMap,
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

// Removed tab-related state and computed properties since we use a simplified sidebar now

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

function getFieldBoundId(field: any) {
  if (field.type !== "child" && field.type !== "html") return null;
  const key = field.key;
  const bindings = props.templateTarget?.htmlBindings || {};
  
  let boundValue = bindings[key];
  if (!boundValue && key.startsWith("child.")) {
    boundValue = bindings[key.substring(6)];
  } else if (!boundValue && key.startsWith("html.")) {
    boundValue = bindings[key.substring(5)];
  }
  
  if (boundValue && typeof boundValue === "object" && boundValue.id) {
    return boundValue.id;
  }
  return null;
}

function configureComponent(id: string) {
  // 保存 HTML 内容并关闭弹窗
  handleSave();
  // 切换活动聚焦元素，主画布侧边栏将自动渲染该组件的配置菜单
  nextTick(() => {
    currentOperatingCanvasChildId.value = id;
  });
}

const draftSummary = computed(() => {
  const value = String(draftValue.value ?? "");
  return `${value.split(/\r?\n/).length} 行 · ${value.length} 字符`;
});

const systemGroupedVariables = [
  {
    label: "画布尺寸",
    type: "canvas",
    tokens: [
      { token: "{{canvas.width}}", description: "画布宽度数值" },
      { token: "{{canvas.height}}", description: "画布高度数值" },
      { token: "{{canvas.widthUnit}}", description: "画布宽度单位" },
      { token: "{{canvas.heightUnit}}", description: "画布高度单位" },
      { token: "{{canvas.widthCss}}", description: "画布宽度 CSS 值" },
      { token: "{{canvas.heightCss}}", description: "画布高度 CSS 值" },
    ]
  },
  {
    label: "当前元素",
    type: "element",
    tokens: [
      { token: "{{element.id}}", description: "当前元素 id" },
      { token: "{{element.zIndex}}", description: "当前元素层级" },
    ]
  }
];

const templateMagicVariableItems = computed(() => {
  const fields = inferHtmlTemplateFieldsFromContent(
    draftValue.value,
    props.templateTarget?.htmlTemplateFields || []
  );

  return fields.map((field) => {
    return {
      key: field.key,
      label: field.label || field.key,
      type: field.type,
      tokens: createMagicVariableItemsForField(field),
    };
  });
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
    case "child": {
      const hasPrefix = field.key.includes(".");
      return [
        {
          token: hasPrefix ? `{{${field.key}}}` : `{{child.${field.key}}}`,
          description: `${field.label}，嵌入组件插槽（如 ECharts、Sticker 等）`,
          type: field.type,
        },
      ];
    }
    case "html": {
      const hasPrefix = field.key.includes(".");
      return [
        {
          token: hasPrefix ? `{{${field.key}}}` : `{{html.${field.key}}}`,
          description: `${field.label}，递归嵌套的 HTML 代码片段`,
          type: field.type,
        },
      ];
    }
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
  const flatSystem = systemGroupedVariables.flatMap((g) => g.tokens);
  const flatTemplate = templateMagicVariableItems.value.flatMap((field) => field.tokens);
  
  const allVariables = [...flatSystem, ...flatTemplate];

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

function inferComponentTypeFromKey(key: string): string {
  let inferredType = "echart"; // default ECharts
  
  if (key.startsWith("threejs.") || key.startsWith("threeScene.")) {
    inferredType = "threeScene";
  } else if (key.startsWith("echart.")) {
    inferredType = "echart";
  } else if (key.startsWith("wordCloud.")) {
    inferredType = "wordCloud";
  } else if (key.startsWith("barcode.")) {
    inferredType = "barcode";
  } else if (key.startsWith("qrcode.")) {
    inferredType = "qrcode";
  } else if (key.startsWith("figlet.")) {
    inferredType = "figlet";
  } else if (key.startsWith("math.")) {
    inferredType = "math";
  } else if (key.startsWith("mermaid.")) {
    inferredType = "mermaid";
  } else if (key.startsWith("graphviz.")) {
    inferredType = "graphviz";
  } else if (key.startsWith("dagreGraph.")) {
    inferredType = "dagreGraph";
  } else if (key.startsWith("roughShape.")) {
    inferredType = "roughShape";
  } else if (key.startsWith("chartjs.")) {
    inferredType = "chartjs";
  } else if (key.startsWith("frappeChart.")) {
    inferredType = "frappeChart";
  } else if (key.startsWith("chartXkcd.")) {
    inferredType = "chartXkcd";
  } else if (key.startsWith("plotlyChart.")) {
    inferredType = "plotlyChart";
  } else if (key.startsWith("vegaLite.")) {
    inferredType = "vegaLite";
  } else if (key.startsWith("waveform.")) {
    inferredType = "waveform";
  } else if (key.startsWith("markmapChart.")) {
    inferredType = "markmapChart";
  } else if (key.startsWith("particlesEffect.")) {
    inferredType = "particlesEffect";
  } else if (key.startsWith("confetti.")) {
    inferredType = "confetti";
  } else if (key.startsWith("trianglify.")) {
    inferredType = "trianglify";
  } else if (key.startsWith("starChart.")) {
    inferredType = "starChart";
  } else if (key.startsWith("vexFlow.")) {
    inferredType = "vexFlow";
  } else if (key.startsWith("cytoscape.")) {
    inferredType = "cytoscape";
  } else if (key.startsWith("cytoscapeGraph.")) {
    inferredType = "cytoscapeGraph";
  } else if (key.startsWith("vueDataUi.")) {
    inferredType = "vueDataUi";
  } else if (key.startsWith("d3.")) {
    inferredType = "d3";
  } else if (key.startsWith("d3Cloud.")) {
    inferredType = "d3Cloud";
  } else if (key.startsWith("opentypeText.")) {
    inferredType = "opentypeText";
  } else if (key.startsWith("simplexNoise.")) {
    inferredType = "simplexNoise";
  } else if (key.startsWith("molecule.")) {
    inferredType = "molecule";
  } else if (key.startsWith("threeMol.")) {
    inferredType = "threeMol";
  } else if (key.startsWith("abcNotation.")) {
    inferredType = "abcNotation";
  } else if (key.startsWith("rawCanvas.")) {
    inferredType = "rawCanvas";
  }
  
  return inferredType;
}

function autoCreateAndBindNewFields(fields: HtmlTemplateFieldDefinition[]) {
  if (!props.templateTarget) return;
  if (!props.templateTarget.htmlBindings) {
    props.templateTarget.htmlBindings = {};
  }
  const bindings = props.templateTarget.htmlBindings;
  
  fields.forEach((field) => {
    if (field.type === "child") {
      const existingBinding = bindings[field.key];
      if (!existingBinding || !existingBinding.id) {
        const inferredType = inferComponentTypeFromKey(field.key);
        const newId = "_" + String(new Date().getTime()) + Math.random().toString(36).substring(2, 6);
        const defaultOptionsCreator = canvasChildDefaultOptionsMap[inferredType];
        const newOptions = {
          ...(defaultOptionsCreator ? defaultOptionsCreator.call(null) : {}),
          id: newId,
          type: inferredType,
          undeletable: true,
        };
        
        if (canvasStickerOptions.value && Array.isArray(canvasStickerOptions.value.children)) {
          canvasStickerOptions.value.children.push(newOptions);
        }
        bindings[field.key] = { id: newId };
      }
    } else if (field.type === "html") {
      const existingBinding = bindings[field.key];
      if (!existingBinding || !existingBinding.id) {
        const newId = "_" + String(new Date().getTime()) + Math.random().toString(36).substring(2, 6);
        const defaultOptionsCreator = canvasChildDefaultOptionsMap["html"];
        const newOptions = {
          ...(defaultOptionsCreator ? defaultOptionsCreator.call(null) : {}),
          id: newId,
          type: "html",
          undeletable: true,
        };
        
        if (canvasStickerOptions.value && Array.isArray(canvasStickerOptions.value.children)) {
          canvasStickerOptions.value.children.push(newOptions);
        }
        bindings[field.key] = { id: newId };
      }
    }
  });
  
  props.templateTarget.htmlBindings = { ...bindings };
}

function cleanUpUnusedBindings(fields: HtmlTemplateFieldDefinition[]) {
  if (!props.templateTarget) return;
  const bindings = props.templateTarget.htmlBindings || {};
  
  const activeKeys = new Set(fields.map(f => f.key));
  const activeBoundIds = new Set<string>();
  
  Object.keys(bindings).forEach(key => {
    if (activeKeys.has(key)) {
      if (bindings[key] && bindings[key].id) {
        activeBoundIds.add(bindings[key].id);
      }
    } else {
      delete bindings[key];
    }
  });
  
  if (canvasStickerOptions.value && Array.isArray(canvasStickerOptions.value.children)) {
    canvasStickerOptions.value.children = canvasStickerOptions.value.children.filter((c: any) => {
      if (c.undeletable && !activeBoundIds.has(c.id) && c.id !== props.templateTarget.id) {
        return false;
      }
      return true;
    });
  }
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
      
      // Auto create and bind components for new child variables
      autoCreateAndBindNewFields(inferredFields);
      // Clean up unused/removed child components
      cleanUpUnusedBindings(inferredFields);
      
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
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  gap: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05);
  }
  
  .variable-row-left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .variable-row-right {
    flex-shrink: 0;
  }
}

.variable-header {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.type-tag {
  font-size: 8px;
  font-weight: 700;
  padding: 0 4px;
  height: 15px;
  line-height: 15px;
}

.tokens-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.clickable-token-tag {
  display: inline-flex;
  align-items: center;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  color: #0f172a;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  word-break: break-all;
  
  &:hover {
    color: #2563eb;
    background: #eff6ff;
    border-color: #bfdbfe;
  }
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
