<template>
  <div class="container flex flex-col items-center">
    <!-- 预览画布卡片 -->
    <div
      ref="canvasContainerRef"
      v-if="!showMainCanvas"
      v-loading="renderingLoading"
      v-bind="loadingOptions"
      class="canvas-preview-card mini-png-background"
    >
      <canvass></canvass>
      <div class="canvas-preview-badge-overlay">
        <el-tooltip
          :hide-after="0"
          content="在中央工作区开启大画布全屏显示与高精度实时编辑"
          placement="bottom"
        >
          <button
            class="canvas-expand-pill-btn"
            @click="showMainCanvas = true"
          >
            <el-icon :size="11"><FullScreen /></el-icon>
            <span>大画布</span>
          </button>
        </el-tooltip>
      </div>
    </div>

    <!-- 顶部动作工具栏 -->
    <div class="canvas-actions-panel">
      <div class="canvas-actions-panel__row">
        <el-button
          class="canvas-action-button canvas-action-button--primary"
          type="primary"
          size="small"
          @click="handleUploadClick"
          :disabled="shouldUpdateCanvasSticker && !isUpdatingSticker"
        >
          <el-icon :size="12" class="mr-0.5"><Check /></el-icon>
          {{ currentEditingCustomStickerId ? '保存修改' : '保存作品' }}
        </el-button>

        <el-button
          v-if="shouldUpdateCanvasSticker && !isUpdatingSticker"
          class="canvas-action-button update-required"
          plain
          size="small"
          @click="genSticker"
          :loading="isUpdatingSticker"
        >
          更新贴纸
        </el-button>
        <el-button
          v-else
          class="canvas-action-button"
          plain
          size="small"
          @click="genSticker"
          :loading="isUpdatingSticker"
          :disabled="isUpdatingSticker"
        >
          {{ isUpdatingSticker ? '更新中...' : '已更新' }}
        </el-button>

        <el-button
          class="canvas-action-button"
          plain
          size="small"
          @click="exportPng"
          :disabled="shouldUpdateCanvasSticker && !isUpdatingSticker"
        >
          导出
        </el-button>

        <el-popconfirm
          title="确定清空画布所有图层？"
          confirm-button-text="清空"
          cancel-button-text="取消"
          @confirm="clearCanvasChildren"
        >
          <template #reference>
            <el-button
              class="canvas-action-button"
              plain
              size="small"
              type="danger"
            >
              清空
            </el-button>
          </template>
        </el-popconfirm>

        <a-dropdown arrow placement="bottom">
          <div class="canvas-actions-panel__dropdown-trigger">
            <el-button class="canvas-action-button canvas-action-button--more" plain size="small">
              •••
            </el-button>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="exportTrimmedPng">
                自动去除空白边框导出
              </a-menu-item>
              <a-menu-item @click="consoleStikcerOptions">
                在控制台打印贴纸信息
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- 图层选择条 -->
    <div class="canvas-layer-selector">
      <div class="canvas-layer-selector__label">
        <span>当前编辑图层</span>
        <span class="canvas-layer-count">({{ canvasStickerOptions.children?.length || 0 }})</span>
      </div>
      <div class="canvas-layer-selector__row">
        <el-select
          v-model="currentOperatingCanvasChildId"
          size="small"
          class="canvas-layer-select"
        >
          <template #label="{ label }">
            <div class="canvas-layer-selected-text">
              <span class="canvas-layer-dot" />
              <span>{{ canvasChildLabelMap[currentOperatingCanvasChild.type] }}</span>
            </div>
          </template>

          <template v-for="(item, index) in canvasStickerOptions.children" :key="item.id">
            <el-option
              class="canvas-child-select-option"
              :value="item.id"
              :label="canvasChildLabelMap[item.type]"
            >
              <div
                class="canvas-layer-option-item"
                @mouseenter="optionMouseenter(item)"
                @mouseleave="optionMouseleave(item)"
              >
                <span>{{ canvasChildLabelMap[item.type] }}</span>
                <div style="flex: 1"></div>
                <el-button
                  v-if="item.type !== 'canvas' && item.type !== 'html' && item.id !== 'this_is_html_id'"
                  link
                  type="danger"
                  size="small"
                  @click.stop="remove(item.id)"
                >
                  <el-icon size="12">
                    <CircleCloseFilled></CircleCloseFilled>
                  </el-icon>
                </el-button>
              </div>
            </el-option>
          </template>
        </el-select>

        <!-- 当前选中图层的快捷删除按钮 (画布与主代码画布不展示) -->
        <el-tooltip
          v-if="currentOperatingCanvasChild?.type !== 'canvas' && currentOperatingCanvasChild?.type !== 'html' && currentOperatingCanvasChild?.id !== 'this_is_html_id'"
          content="删除当前选中图层"
          placement="top"
          :hide-after="0"
        >
          <el-popconfirm
            :title="`确定删除当前【${canvasChildLabelMap[currentOperatingCanvasChild.type] || '图层'}】？`"
            confirm-button-text="删除"
            cancel-button-text="取消"
            @confirm="remove(currentOperatingCanvasChild.id)"
          >
            <template #reference>
              <button
                type="button"
                class="canvas-layer-delete-btn"
                title="删除当前图层"
              >
                <el-icon :size="13"><CircleCloseFilled /></el-icon>
              </button>
            </template>
          </el-popconfirm>
        </el-tooltip>
      </div>
    </div>

    <div class="operate">
      <operateLayout></operateLayout>
    </div>
  </div>

  <a-modal
    v-model:open="showUploadModal"
    :centered="true"
    :destroyOnClose="true"
    width="540px"
    :title="currentEditingCustomStickerId ? '更新自定义贴纸（保存将覆盖原作品）' : '保存自定义贴纸（新建作品）'"
    :okText="currentEditingCustomStickerId ? '确认更新' : '确认保存'"
    cancelText="取消"
    @ok="doUpload"
    :confirmLoading="submitLoading"
  >
    <el-form
      style="padding: 12px"
      label-width="100px"
      :inline-message="false"
      :show-message="false"
      label-position="left"
    >
      <el-form-item label="贴纸名称：">
        <el-input v-model="editForm.name" placeholder="贴纸名称"></el-input>
      </el-form-item>
      <el-form-item label="贴纸描述:">
        <el-input
          type="textarea"
          v-model="editForm.description"
          placeholder="贴纸描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="关键字:">
        <tagsInput
          v-model="editForm.keywords"
          :autocomplete-tags="stickerAutoplacementTags"
          :autocomplete-width="400"
          autocompletePlacement="bottom"
        ></tagsInput>
      </el-form-item>

      <el-form-item label="保存到:">
        <div class="folder-tree-wrapper">
          <el-tree
            :data="folderTree"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="handleFolderNodeClick"
          >
            <template #default="{ node, data }">
              <span
                class="folder-tree-item"
                :class="{ 'is-selected': editForm.folderId === data.id }"
                @click.stop="toggleFolderSelect(data.id)"
              >
                <span class="folder-tree-text">{{ node.label }}</span>
                <el-icon v-if="editForm.folderId === data.id" class="folder-check-icon">
                  <Check />
                </el-icon>
              </span>
            </template>
          </el-tree>
          <div class="folder-tree-hint">
            当前选择: {{ selectedFolderName || '根目录' }}
            <el-button v-if="editForm.folderId" link type="primary" size="small" @click="clearFolderSelect">
              取消选择
            </el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="自动去除白色边框:">
        <a-switch
          v-model:checked="editForm.autoTrim"
          checked-children="是"
          un-checked-children="否"
        />
      </el-form-item>

      <!-- <el-form-item label="是否共享:">
        <a-switch
          v-model:checked="editForm.isPublic"
          checked-children="公开"
          un-checked-children="私密"
        />
      </el-form-item> -->
    </el-form>
  </a-modal>

  <ChildViewHelperComponent></ChildViewHelperComponent>
</template>

<script setup lang="tsx">
import {
  CanvasController,
  canvasStickerOptions,
  addCanvasChild,
  removeCavnasChild,
  CanvasChildType,
  currentOperatingCanvasChildId,
  currentOperatingCanvasChild,
  currentEditingCustomStickerId,
  currentEditingCustomStickerFolderId,
  currentEditingCustomStickerName,
  showMainCanvas,
  canvasChildLabelMap,
  renderingLoading,
} from "./index.tsx";

import operateLayout from "./operateLayout/index.vue";
import {
  onMounted,
  ref,
  computed,
  watch,
  reactive,
  watchEffect,
  nextTick,
} from "vue";

import { CircleCloseFilled, FullScreen, Check } from "@element-plus/icons-vue";
import { useLoadingOptions } from "@/components/loading/index.tsx";
import addPopover from "./addPopover.vue";
import Api from "@/api";
import { message } from "ant-design-vue";
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import { stickerAutoplacementTags } from "@/components/design/components/tagsInput/index.ts";
import { executeAITool } from "@/ai/shared/execute-tool";
import { clearAgentDesignProvenance } from "@/ai/design-provenance";
import {
  currentFocusingStickerId,
  ChildViewHelperComponent,
} from "@/components/design/layout/canvas/components/childViewHelper/index";

const canvasContainerRef = ref();

const loadingOptions = useLoadingOptions({});

let canvasController = new CanvasController({
  max: 320,
});

const shouldUpdateCanvasSticker = computed(() => {
  return canvasController.shouldUpdateCanvasSticker.value;
});

const isUpdatingSticker = computed(() => {
  return renderingLoading.value || canvasController.loading.value;
});

let canvass = canvasController.getRender();

function checkAndUpdate() {
  if (shouldUpdateCanvasSticker.value) {
    message.warning("请先点击'更新贴纸'按钮更新画布内容");
    return false;
  }
  return true;
}

function exportPng() {
  if (!checkAndUpdate()) return;
  canvasController.downloadPng();
}

/* 导出去除多余空白的图片 */
function exportTrimmedPng() {
  if (!checkAndUpdate()) return;
  canvasController.downloadTrimmedPng();
}

function remove(id) {
  removeCavnasChild(id);
}

function clearCanvasChildren() {
  // 除了画布和 Master HTML 元素，其他全移除；并将 HTML 元素重置为初始状态
  const canvasChild =
    canvasStickerOptions.value.children.find(
      (child) => child.type === "canvas",
    ) || canvasStickerOptions.value.children[0];

  const htmlChild =
    canvasStickerOptions.value.children.find(
      (child) => child.id === "this_is_html_id",
    ) || {
      id: "this_is_html_id",
      type: "html",
      htmlContent: `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #fafafa; color: #666; font-family: sans-serif; font-size: 24px;">\n  主 HTML 模板\n</div>`,
      htmlBindings: {},
      htmlTemplateFields: [],
      htmlTemplateDefaultBindings: {},
      htmlTemplateMeta: null,
      transform: { rotate: 0, scaleX: 1, scaleY: 1 },
      filter: {
        blur: { value: 0, unit: "px" },
        brightness: { value: 100, unit: "%" },
        contrast: { value: 100, unit: "%" },
        grayscale: { value: 0, unit: "%" },
        hueRotate: { value: 0, unit: "deg" },
        invert: { value: 0, unit: "%" },
        opacity: { value: 100, unit: "%" },
        saturate: { value: 100, unit: "%" },
        sepia: { value: 0, unit: "%" },
      },
      zIndex: 0,
      undeletable: true,
    };

  // 重置 HTML 内容与绑定关系
  htmlChild.htmlContent = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #fafafa; color: #666; font-family: sans-serif; font-size: 24px;">\n  主 HTML 模板\n</div>`;
  htmlChild.htmlBindings = {};
  htmlChild.htmlTemplateFields = [];
  htmlChild.htmlTemplateDefaultBindings = {};
  htmlChild.htmlTemplateMeta = null;

  const count = canvasStickerOptions.value.children.filter(
    (child) => child.type !== "canvas" && child.id !== "this_is_html_id",
  ).length;

  canvasStickerOptions.value.children = [canvasChild, htmlChild];
  currentEditingCustomStickerId.value = null;
  currentEditingCustomStickerFolderId.value = null;
  clearAgentDesignProvenance(canvasStickerOptions.value);
  currentOperatingCanvasChildId.value = "this_is_html_id";
  message.success(`已清空画布，共删除 ${count} 个关联组件`);
}

/**
 * @method 在控制台打印当前贴纸配置信息
 */
function consoleStikcerOptions() {
  console.log(JSON.parse(JSON.stringify(canvasStickerOptions.value)));
}

/**
 * @method 处理保存逻辑
 */

const showUploadModal = ref(false);
const submitLoading = ref(false);

const editForm = ref({
  name: "",
  description: "",
  keywords: [],
  autoTrim: true, // 默认开启自动去除白色边框
  folderId: null as string | null, // 文件夹 ID
});

const folderTree = ref<any[]>([]);

const selectedFolderName = computed(() => {
  if (!editForm.value.folderId) return '';
  function findName(nodes: any[]): string | null {
    for (const n of nodes) {
      if (n.id === editForm.value.folderId) return n.name;
      const found = findName(n.children || []);
      if (found) return found;
    }
    return null;
  }
  return findName(folderTree.value) || '';
});

function toggleFolderSelect(id: string) {
  editForm.value.folderId = editForm.value.folderId === id ? null : id;
}

function handleFolderNodeClick(data: any) {
  // el-tree 的 node-click 由展开/折叠箭头触发，不改变选中状态
  // 选中状态由 toggleFolderSelect 控制
}

function clearFolderSelect() {
  editForm.value.folderId = null;
}

async function loadFolderTree() {
  if (folderTree.value.length > 0) return; // 已加载过则不重复加载
  try {
    const res = await Api.getStickerFolderTree({ folderCategory: "customsticker" });
    folderTree.value = res || [];
  } catch (e) {
    console.error("获取文件夹树失败:", e);
  }
}

function handleUploadClick() {
  if (shouldUpdateCanvasSticker.value) {
    message.warning("请先点击'更新贴纸'按钮更新画布内容");
    return;
  }
  loadFolderTree();
  if (currentEditingCustomStickerId.value) {
    editForm.value.name = currentEditingCustomStickerName.value || editForm.value.name;
    editForm.value.folderId = currentEditingCustomStickerFolderId.value || null;
  }
  showUploadModal.value = true;
}

async function doUpload() {
  if (shouldUpdateCanvasSticker.value) {
    message.warning("请先点击'更新贴纸'按钮更新画布内容");
    return;
  }
  submitLoading.value = true;

  try {
    // 先更新画布确保内容是最新的
    await canvasController.activeUpdateRenderingCanvas();

    // 等待画布更新完成
    while (canvasController.loading.value || renderingLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // 检查画布尺寸是否合法
    const canvasWidth = canvasController.canvasEl.width;
    const canvasHeight = canvasController.canvasEl.height;

    if (canvasWidth <= 0 || canvasHeight <= 0) {
      throw new Error("无效的画布尺寸");
    }

    // 针对超大尺寸进行安全提示 (例如超过 16384 像素)
    if (canvasWidth > 16384 || canvasHeight > 16384) {
      console.warn("当前画布尺寸极大，可能会导致处理时间过长或内存不足。");
    }

    const result = await executeAITool("canvas.updateAndSaveSticker", {
      name: editForm.value.name,
      description: editForm.value.description,
      keywords: editForm.value.keywords.join(","),
      autoTrim: editForm.value.autoTrim,
      folderId: editForm.value.folderId || null,
    });

    if (!result?.success) {
      throw new Error(result?.message || "保存失败");
    }

    message.success(result.message || "保存成功");

    submitLoading.value = false;
    showUploadModal.value = false;
  } catch (e) {
    console.error("保存失败:", e);
    submitLoading.value = false;
    message.error("保存失败: " + (e.message || e));
  }
}

/**
 * @method 子元素鼠标覆盖事件
 */

function optionMouseenter(item) {
  currentFocusingStickerId.value = item.id;
}

function optionMouseleave(item) {
  if (item.id == currentFocusingStickerId.value) {
    currentFocusingStickerId.value = null;
  }
}

/**
 * 获取贴纸的主题色
 */
async function getCanvasStickerColor() {
  let colors = await canvasController.getPalette();
}

/**
 * @methods 手动生成贴纸
 */
function genSticker() {
  canvasController.activeUpdateRenderingCanvas();
}
</script>

<style lang="less" scoped>
:deep(.el-form-item) {
  margin-bottom: 8px;

  .el-form-item__label {
    line-height: 1;
  }

  .el-form-item__content {
    line-height: 1;
  }
}

.folder-tree-wrapper {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--1s-border-color, #e8e8e8);
  border-radius: 6px;
  padding: 4px 6px;
  background: var(--1s-surface-background, #fafafa);

  :deep(.el-tree) {
    background: transparent;
    font-size: 12px;
  }

  :deep(.el-tree-node__content) {
    height: 26px;
    border-radius: 3px;
    padding: 0;
  }

  :deep(.el-tree-node__content:hover) {
    background: transparent;
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background: transparent !important;
  }

  :deep(.el-tree-node__expand-icon) {
    font-size: 12px;
    color: #999;
  }

  :deep(.el-tree-node__expand-icon.is-leaf) {
    width: 12px;
  }
}

.folder-tree-item {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: var(--1s-text-color);
  transition: all 0.15s;

  &:hover {
    background-color: var(--1s-hover-background);
  }

  &.is-selected {
    background-color: var(--1s-accent-color);
    color: #fff;

    &:hover {
      background-color: var(--1s-accent-color);
      filter: brightness(0.9);
    }

    .folder-check-icon {
      color: #fff;
    }
  }
}

.folder-tree-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-check-icon {
  font-size: 14px;
  color: var(--1s-accent-color);
  flex-shrink: 0;
  margin-left: 4px;
}

.folder-tree-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--1s-border-color, #e8e8e8);
  font-size: 12px;
  color: var(--1s-text-color-secondary, #999);
}

.container {
  width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: var(--1s-panel-background, #fafafa);
}

.canvas-preview-card {
  width: calc(100% - 16px);
  max-width: 320px;
  height: min(280px, calc(100vw - 48px));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 8px 4px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--1s-border-color, #e4e4e7);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.canvas-preview-badge-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 10;
}

.canvas-expand-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(var(--1s-blur-sm));
  color: var(--1s-text-color);
  border: 1px solid var(--1s-border-color);
  box-shadow: var(--1s-shadow-sm);
  cursor: pointer;
  transition:
    background-color var(--1s-transition-base),
    box-shadow var(--1s-transition-base),
    transform var(--1s-transition-base),
    backdrop-filter var(--1s-transition-base);

  &:hover {
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: var(--1s-shadow-md);
    backdrop-filter: blur(var(--1s-blur-md));
  }

  &:active {
    transform: translateY(0);
  }
}

.dark .canvas-expand-pill-btn {
  background: rgba(24, 24, 27, 0.85);
  color: #f4f4f5;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);

  &:hover {
    background: #27272a;
  }
}

.canvas-actions-panel {
  width: 100%;
  padding: 4px 8px;
  box-sizing: border-box;
}

.canvas-actions-panel__row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
}

.canvas-action-button {
  margin-left: 0 !important;
  height: 24px !important;
  padding: 0 8px !important;
  font-size: 11px !important;
  border-radius: 4px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  white-space: nowrap;
  flex: 1 1 auto;
}

.canvas-actions-panel__dropdown-trigger {
  display: inline-flex;
  flex: 0 0 auto;
}

.canvas-action-button--more {
  flex: 0 0 auto !important;
  min-width: 24px !important;
  padding: 0 6px !important;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.canvas-action-button--primary {
  font-weight: 600;
  background: var(--1s-accent-color) !important;
  border-color: var(--1s-accent-color) !important;
  color: #ffffff !important;
}

body.designiy-dark .canvas-action-button--primary {
  background: var(--1s-accent-color) !important;
  border-color: var(--1s-accent-color) !important;
  color: #111318 !important;
}

.canvas-layer-selector {
  width: 100%;
  padding: 4px 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-sizing: border-box;

  .canvas-layer-selector__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    font-weight: 600;
    color: var(--1s-text-color-secondary, #71717a);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0 2px;
  }

  .canvas-layer-count {
    font-size: 10px;
    font-weight: 400;
    color: var(--1s-text-color-tertiary, #a1a1aa);
  }

  .canvas-layer-selector__row {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
  }

  .canvas-layer-select {
    flex: 1;
    min-width: 0;

    :deep(.el-select__wrapper) {
      height: 26px !important;
      min-height: 26px !important;
      padding: 0 8px !important;
      font-size: 11px !important;
      border-radius: 4px !important;
      background: var(--1s-elevated-background, #f4f4f5);
      border: 1px solid var(--1s-border-color, #e4e4e7);
      box-shadow: none !important;
    }
  }

  .canvas-layer-delete-btn {
    height: 26px;
    width: 26px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: var(--1s-elevated-background, #f4f4f5);
    border: 1px solid var(--1s-border-color, #e4e4e7);
    color: #ef4444;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.4);
      transform: scale(1.05);
    }
  }

  .canvas-layer-selected-text {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
  }

  .canvas-layer-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--1s-accent-color);
    flex-shrink: 0;
  }

  .canvas-layer-option-item {
    display: flex;
    align-items: center;
    font-size: 11px;
    height: 100%;
    width: 100%;
  }
}

.operate {
  flex: 1;
  width: 100%;
  overflow: auto;
}

// 需要更新贴纸时的样式
:deep(.update-required) {
  color: #f59e0b !important;
  border-color: #f59e0b !important;
  font-weight: 600 !important;
}
</style>
