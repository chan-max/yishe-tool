<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <div class="font-selector-wrapper">
        <el-button
          size="small"
          @click="openFontDialog"
          class="font-select-button"
        >
          <span class="font-display-name" v-if="model">
            <span class="font-display-name__text">{{ model.name }}</span>
            <span class="font-display-name__family">{{ getFontFamilyId(model.id) }}</span>
          </span>
          <span class="font-display-name font-display-name--placeholder" v-else>请选择字体</span>
        </el-button>
        <el-tooltip v-if="model" content="查看字体详情" placement="top">
          <el-button
            size="small"
            text
            class="font-detail-text-button"
            @click="openFontDetail(model)"
          >
            详情
          </el-button>
        </el-tooltip>
        <!-- <el-button size="small" @click="openFontModal"> 字体库 </el-button> -->
        <el-button
          v-if="model"
          size="small"
          type="danger"
          @click="clearFont"
        >
          清除
        </el-button>
      </div>
      
      <!-- 字体选择抽屉 -->
      <el-drawer
        v-model="dialogVisible"
        title="选择字体"
        :size="1200"
        :modal="true"
        :with-header="true"
        :append-to-body="true"
        :wrapper-closable="true"
        direction="rtl"
        @open="handleDialogOpened"
        @close="handleDialogClosed"
      >
        <div class="font-drawer-content">
          <!-- 当前选中字体预览 -->
          <div v-if="model" class="font-current-selected">
            <div class="font-current-selected__label">当前选中</div>
            <div class="font-current-selected__card">
              <div class="font-current-selected__thumb" v-if="model.thumbnail">
                <desimage :src="model.thumbnail" class="font-thumbnail-img"></desimage>
              </div>
              <div class="font-current-selected__info">
                <div class="font-current-selected__name">{{ model.name }}</div>
                <div class="font-current-selected__desc" v-if="model.description">{{ model.description }}</div>
                <div class="font-current-selected__family">FontFamily: {{ getFontFamilyId(model.id) }}</div>
              </div>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="font-search-wrapper">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索字体名称或描述"
              clearable
              @input="handleSearchInput"
              @clear="handleSearchClear"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button
              type="primary"
              size="small"
              plain
              round
              @click="emitUpload"
              style="margin-left: 10px;"
            >
              快速上传
            </el-button>
          </div>

          <!-- 字体列表 -->
          <div ref="fontListWrapperRef" class="font-list-wrapper" v-loading="loading">
            <div v-if="!loading && displayList.length === 0" class="font-empty">
              <s1-empty>
                <template #description>
                  <p>无相关字体，尝试使用关键字或相关描述查找</p>
                </template>
              </s1-empty>
            </div>
            
            <div v-else class="font-list-grid">
              <div
                v-for="item in displayList"
                :key="item.id"
                :id="'font-item-' + item.id"
                class="font-item"
                :class="{ 
                  'font-item-selected': model?.id === item.id,
                  'font-item-loaded': isFontLoaded(item.id)
                }"
                @click="selectFont(item)"
              >
                <div class="font-item-thumbnail" v-if="item.thumbnail">
                  <desimage :src="item.thumbnail" class="font-thumbnail-img"></desimage>
                </div>
                <div class="font-item-info">
                  <div class="font-item-name">{{ item.name }}</div>
                  <div class="font-item-desc" v-if="item.description">{{ item.description }}</div>
                  <div class="font-item-family" @click.stop="copyFontFamily(item.id)">
                    <span class="font-family-label">FontFamily:</span>
                    <span class="font-family-value">{{ getFontFamilyId(item.id) }}</span>
                    <el-icon class="font-family-copy-icon"><DocumentCopy /></el-icon>
                  </div>
                </div>
                <div class="font-item-actions" @click.stop>
                  <el-button
                    size="small"
                    plain
                    @click="openFontDetail(item)"
                    class="font-detail-btn"
                  >
                    <el-icon><View /></el-icon>
                    <span>详情</span>
                  </el-button>
                  <el-button
                    v-if="!isFontLoaded(item.id)"
                    size="small"
                    type="primary"
                    plain
                    @click="loadFontToCanvas(item)"
                    class="font-load-btn"
                  >
                    <el-icon><Download /></el-icon>
                    <span>加载到画布</span>
                  </el-button>
                  <el-button
                    v-else
                    size="small"
                    type="success"
                    plain
                    disabled
                    class="font-loaded-btn"
                  >
                    <el-icon><Check /></el-icon>
                    <span>已加载</span>
                  </el-button>
                </div>
                <div class="font-item-check" v-if="model?.id === item.id">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="font-item-loaded-badge" v-if="isFontLoaded(item.id) && model?.id !== item.id">
                  <el-icon><Check /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="font-pagination-wrapper">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[12, 24, 48, 96]"
              :total="total"
              layout="total, sizes, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-drawer>

      <el-dialog
        v-model="detailVisible"
        :title="detailFont?.name || '字体详情'"
        width="560px"
        class="font-detail-dialog"
        :append-to-body="true"
      >
        <div v-if="detailFont" class="font-detail-content">
          <div class="font-detail-preview">
            <desimage
              v-if="detailFont.thumbnail"
              :src="detailFont.thumbnail"
              class="font-detail-thumbnail"
            ></desimage>
            <div v-else class="font-detail-preview-empty">
              暂无预览
            </div>
          </div>

          <div class="font-detail-main">
            <div class="font-detail-header">
              <div class="font-detail-title">{{ detailFont.name }}</div>
              <el-tag
                size="small"
                :type="isFontLoaded(detailFont.id) ? 'success' : 'info'"
              >
                {{ isFontLoaded(detailFont.id) ? '已加载' : '未加载' }}
              </el-tag>
            </div>

            <div class="font-detail-desc">
              {{ detailFont.description || '暂无描述' }}
            </div>

            <div class="font-detail-meta">
              <div class="font-detail-row">
                <span class="font-detail-label">FontFamily</span>
                <button
                  class="font-detail-value font-detail-copyable"
                  type="button"
                  @click="copyFontFamily(detailFont.id)"
                >
                  <span>{{ getFontFamilyId(detailFont.id) }}</span>
                  <el-icon><DocumentCopy /></el-icon>
                </button>
              </div>
              <div class="font-detail-row">
                <span class="font-detail-label">字体 ID</span>
                <span class="font-detail-value">{{ detailFont.id }}</span>
              </div>
              <div class="font-detail-row">
                <span class="font-detail-label">资源地址</span>
                <button
                  v-if="detailFont.url"
                  class="font-detail-value font-detail-copyable"
                  type="button"
                  @click="copyFontUrl(detailFont.url)"
                >
                  <span>{{ detailFont.url }}</span>
                  <el-icon><DocumentCopy /></el-icon>
                </button>
                <span v-else class="font-detail-value font-detail-empty-value">暂无资源地址</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="font-detail-footer">
            <el-button @click="detailVisible = false">关闭</el-button>
            <el-button
              v-if="detailFont"
              :disabled="!detailFont.url || isFontLoaded(detailFont.id)"
              @click="loadFontToCanvas(detailFont)"
            >
              {{ detailFont.url ? (isFontLoaded(detailFont.id) ? '已加载' : '加载到画布') : '无资源地址' }}
            </el-button>
            <el-button
              v-if="detailFont"
              type="primary"
              @click="applyFontFromDetail"
            >
              应用字体
            </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/font-family.svg?component";
import { ref, watch, computed, nextTick } from "vue";
import desimage from "@/components/image.vue";
import { fetchFontFaceWithMessage } from "./index.ts";
import { showUpload, showFontModal, cacheFontFamily } from "@/components/design/store";
import { useDebounceFn } from "@vueuse/core";
import { Loading, Search, Check, DocumentCopy, Download, View } from "@element-plus/icons-vue";
import { getFontList } from "@/api";
import { message } from "ant-design-vue";

interface FontItem {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  hide?: boolean;
}

const model = defineModel<FontItem | null>({ default: null });
const props = defineProps({
  label: {
    default: "个性字体",
  },
});
const dialogVisible = ref(false);
const list = ref<FontItem[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const searchKeyword = ref('');
const detailVisible = ref(false);
const detailFont = ref<FontItem | null>(null);
const fontListWrapperRef = ref<HTMLElement | null>(null);

// 计算显示的列表（当前页的数据）
const displayList = computed(() => {
  return list.value.filter(item => !item.hide);
});

function emitUpload() {
  dialogVisible.value = false;
  showUpload.value = true;
}

function openFontModal() {
  try {
    console.log('Opening font modal...');
    showFontModal.value = true;
    console.log('showFontModal value:', showFontModal.value);
  } catch (error) {
    console.error('Error opening font modal:', error);
  }
}

function openFontDialog() {
  dialogVisible.value = true;
}

function clearFont() {
  model.value = null;
}

function selectFont(item: FontItem) {
  model.value = item;
  dialogVisible.value = false;
}

function openFontDetail(item?: FontItem | null) {
  if (!item) {
    return;
  }
  detailFont.value = item;
  detailVisible.value = true;
}

function applyFontFromDetail() {
  if (!detailFont.value) {
    return;
  }
  selectFont(detailFont.value);
  detailVisible.value = false;
}

function getFontFamilyId(fontId: string) {
  return `font_${fontId}`;
}

// 检查字体是否已加载（响应式）
function isFontLoaded(fontId: string): boolean {
  // 访问 cacheFontFamily.value 让 Vue 追踪依赖
  const cache = cacheFontFamily.value;
  return !!cache[fontId];
}

// 加载字体到画布（不应用）
async function loadFontToCanvas(item: FontItem) {
  if (isFontLoaded(item.id)) {
    message.info('字体已加载到画布');
    return;
  }
  
  try {
    await fetchFontFaceWithMessage({
      url: item.url || '',
      id: item.id,
      name: item.name
    });
    message.success(`字体 "${item.name}" 已加载到画布，可通过 FontFamily ID "${getFontFamilyId(item.id)}" 使用`);
  } catch (error) {
    message.error(`字体 "${item.name}" 加载失败`);
  }
}

// 复制 FontFamily ID
async function copyFontFamily(fontId: string) {
  const fontFamilyId = getFontFamilyId(fontId);
  await copyText(fontFamilyId, 'FontFamily ID 已复制到剪贴板');
}

async function copyFontUrl(url: string) {
  await copyText(url, '字体资源地址已复制到剪贴板');
}

async function copyText(value: string, successText: string) {
  try {
    await navigator.clipboard.writeText(value);
    message.success(successText);
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      message.success(successText);
    } catch (e) {
      message.error('复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
  }
}

async function handleDialogOpened() {
  if (list.value.length === 0) {
    await fetchFontList();
  }
  // 滚动到当前选中的字体
  if (model.value) {
    nextTick(() => {
      const el = document.getElementById('font-item-' + model.value!.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

function handleDialogClosed() {
  // 弹窗关闭时的清理工作（如果需要）
}

async function fetchFontList(params = {}) {
  loading.value = true;
  
  try {
    const res = await getFontList({
      ...params,
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    });
    
    list.value = res.list || [];
    total.value = res.total || 0;
    
  } catch (error) {
    console.error('获取字体列表失败:', error);
    list.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

// 分页大小变化
function handleSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  fetchFontList({
    match: searchKeyword.value,
  });
}

// 页码变化
function handleCurrentChange(page: number) {
  currentPage.value = page;
  fetchFontList({
    match: searchKeyword.value,
  });
}

// 搜索输入
const handleSearchInput = useDebounceFn(function (val: string) {
  searchKeyword.value = val;
  currentPage.value = 1;
  fetchFontList({
    match: val,
  });
}, 333);

// 清除搜索
function handleSearchClear() {
  searchKeyword.value = '';
  currentPage.value = 1;
  fetchFontList();
}

// 初始化时不加载，等弹窗打开时再加载
// onBeforeMount(() => {
//   fetchFontList();
// });

/**
 * */
const emits = defineEmits(["font-load"]);

watch(
  model,
  async () => {
    const info = model.value;
    if (!info || !info.url) {
      return;
    }
    const { url, id, name } = info;

    await fetchFontFaceWithMessage({
      url,
      id,
      name
    });

    emits("font-load");
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.font-selector-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.font-select-button {
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0 8px;
  width: 0;
}

.font-display-name {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.font-select-icon {
  flex-shrink: 0;
}

.font-detail-text-button {
  flex: 0 0 auto;
  min-width: auto;
  height: 24px;
  padding: 0 4px;
  border: 0;
  color: #606266;
  font-size: 12px;
  background: transparent;
}

.font-detail-text-button:hover,
.font-detail-text-button:focus {
  color: #409eff;
  background: #ecf5ff;
}

.font-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.font-current-selected {
  padding: 12px 16px;
  background: #f0f9ff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
  max-height: 120px;
  overflow: hidden;
}

.font-current-selected__label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.font-current-selected__card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.font-current-selected__thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e4e7ed;
}

.font-current-selected__thumb .font-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.font-current-selected__info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.font-current-selected__name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.font-current-selected__desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.font-current-selected__family {
  font-size: 11px;
  color: #b0b4bc;
  margin-top: 2px;
  font-family: monospace;
}

.font-search-wrapper {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 0;
  flex-shrink: 0;
  gap: 10px;
  flex-wrap: wrap;
}

.font-search-wrapper .el-input {
  flex: 1;
  min-width: min(320px, 100%);
}

.font-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
  min-height: 0;
}

.font-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.font-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding: 4px;
}

.font-item {
  position: relative;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 260px;
}

.font-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.font-item-selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.font-item-loaded {
  border-left: 3px solid #67c23a;
}

.font-item-thumbnail {
  width: 100%;
  height: 80px;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
}

.font-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.font-item-info {
  flex: 1;
  min-height: 40px;
  overflow: hidden;
}

.font-item-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.font-item-desc {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  margin-bottom: 6px;
}

.font-item-family {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
  font-size: 11px;
}

.font-item-family:hover {
  background: #e4e7ed;
}

.font-family-label {
  color: #606266;
  font-weight: 500;
}

.font-family-value {
  color: #409eff;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.font-family-copy-icon {
  color: #909399;
  font-size: 14px;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.font-item-family:hover .font-family-copy-icon {
  color: #409eff;
}

.font-item-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 2;
}

.font-item-actions {
  margin-top: 8px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.font-item-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.font-detail-btn {
  flex: 0 0 auto;
  font-size: 12px;
  padding: 6px 8px;
}

.font-load-btn,
.font-loaded-btn {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12px;
  padding: 6px 8px;
}

.font-load-btn .el-icon,
.font-loaded-btn .el-icon {
  margin-right: 4px;
}

.font-item-loaded-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  background: #67c23a;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.font-pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
  width: 100%;
  background: #fff;
}

.font-detail-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.font-detail-preview {
  width: 100%;
  height: 180px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.font-detail-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.font-detail-preview-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 13px;
}

.font-detail-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.font-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.font-detail-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.font-detail-desc {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.font-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f7f8fa;
}

.font-detail-row {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.font-detail-label {
  color: #909399;
  font-size: 12px;
}

.font-detail-value {
  min-width: 0;
  color: #303133;
  font-size: 12px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.font-detail-copyable {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 4px 6px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #409eff;
  cursor: pointer;
  text-align: left;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}

.font-detail-copyable:hover {
  background: #ecf5ff;
}

.font-detail-copyable span {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.font-detail-empty-value {
  color: #c0c4cc;
}

.font-detail-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.font-detail-footer :deep(.el-button + .el-button) {
  margin-left: 0;
}

@media (max-width: 1080px) {
  .font-search-wrapper .el-input {
    min-width: 100%;
  }
}

@media (max-width: 640px) {
  .font-detail-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
