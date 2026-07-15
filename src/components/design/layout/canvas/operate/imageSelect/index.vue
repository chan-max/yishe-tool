<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <div class="image-selector-wrapper">
        <el-button
          size="small"
          @click="openImageDialog"
          class="image-select-button"
        >
          {{ model?.name || "请选择" }}
        </el-button>
        <el-button v-if="model" size="small" link type="danger" @click="remove">
          清除
        </el-button>
      </div>

      <!-- 图片选择抽屉 -->
      <el-drawer
        v-model="dialogVisible"
        title="选择图片"
        :size="1200"
        :modal="true"
        :with-header="true"
        :append-to-body="true"
        :wrapper-closable="true"
        direction="rtl"
        @open="handleDialogOpened"
        @close="handleDialogClosed"
      >
        <div class="image-drawer-content">
          <!-- 当前选中图片预览 -->
          <div v-if="model" class="image-current-selected">
            <div class="image-current-selected__label">当前选中</div>
            <div class="image-current-selected__card">
              <div class="image-current-selected__thumb">
                <s1-image :src="model.url" class="image-thumbnail-img"></s1-image>
              </div>
              <div class="image-current-selected__info">
                <div class="image-current-selected__name">{{ model.name || "未命名" }}</div>
                <div class="image-current-selected__id">ID: {{ model.id }}</div>
              </div>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="image-search-wrapper">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索图片名称"
              clearable
              @input="handleSearchInput"
              @clear="handleSearchClear"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button
              class="image-search-by-image-button"
              :loading="imageSearchLoading"
              @click="triggerImageSearch"
            >
              <el-icon><Picture /></el-icon>
            </el-button>
            <input
              ref="imageSearchInputRef"
              type="file"
              accept="image/*"
              class="image-search-file-input"
              @change="handleImageSearchFileChange"
            />
          </div>

          <!-- 图片列表 -->
          <div class="image-list-wrapper" v-loading="loading">
            <div
              v-if="!loading && displayList.length === 0"
              class="image-empty"
            >
              <s1-empty>
                <template #description>
                  <p>无相关图片，尝试使用关键字搜索</p>
                </template>
              </s1-empty>
            </div>

            <div v-else class="image-list-grid">
              <div
                v-for="item in displayList"
                :key="item.id"
                class="image-item"
                :class="{ 'image-item-selected': model?.id === item.id }"
                @click="selectImage(item)"
              >
                <div class="image-item-thumbnail">
                  <s1-image
                    :src="item.url"
                    class="image-thumbnail-img"
                  ></s1-image>
                </div>
                <div class="image-item-info">
                  <div class="image-item-name">{{ item.name || "未命名" }}</div>
                  <div v-if="item._source" class="image-item-source">
                    {{
                      item._source === "image-vector" ? "视觉匹配" : "相似匹配"
                    }}
                  </div>
                </div>
                <div class="image-item-check" v-if="model?.id === item.id">
                  <el-icon><Check /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="image-pagination-wrapper">
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
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import icon from "@/components/design/assets/icon/background-image.svg?component";
import { Search, Check, Picture } from "@element-plus/icons-vue";
import { useDebounceFn } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { getStickerList, searchStickerByImage } from "@/api";

interface ImageItem {
  id: string;
  name?: string;
  url: string;
  type?: string;
  _source?: string;
  _score?: number;
}

const model = defineModel<ImageItem | null>({ default: null });

const props = defineProps({
  label: {
    default: "选择图片",
  },
});

const dialogVisible = ref(false);
const list = ref<ImageItem[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const searchKeyword = ref("");
const imageSearchLoading = ref(false);
const imageSearchInputRef = ref<HTMLInputElement | null>(null);

// 计算显示的列表（当前页的数据）
const displayList = computed(() => {
  return list.value;
});

function openImageDialog() {
  dialogVisible.value = true;
}

function remove() {
  model.value = null;
}

function selectImage(item: ImageItem) {
  model.value = item;
  dialogVisible.value = false;
}

function handleDialogOpened() {
  if (list.value.length === 0) {
    fetchImageList();
  }
}

function handleDialogClosed() {
  // 弹窗关闭时的清理工作（如果需要）
}

async function fetchImageList(params = {}) {
  loading.value = true;

  try {
    const res = await getStickerList({
      ...params,
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      type: "image,texture",
    });

    list.value = res.list || [];
    total.value = res.total || 0;
  } catch (error) {
    console.error("获取图片列表失败:", error);
    list.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function triggerImageSearch() {
  imageSearchInputRef.value?.click();
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
}

async function handleImageSearchFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    ElMessage.warning("请选择图片文件");
    return;
  }

  imageSearchLoading.value = true;
  loading.value = true;
  try {
    const imageUrl = await readFileAsDataUrl(file);
    const result: any = await searchStickerByImage({
      imageUrl,
      mode: "hybrid",
      limit: pageSize.value,
    });
    list.value = result.results || [];
    total.value = result.total || list.value.length;
    currentPage.value = 1;
    searchKeyword.value = "";
  } catch (error) {
    console.error("以图搜图失败:", error);
    ElMessage.error("以图搜图失败，请稍后重试");
  } finally {
    imageSearchLoading.value = false;
    loading.value = false;
  }
}

// 分页大小变化
function handleSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  fetchImageList({
    match: searchKeyword.value,
  });
}

// 页码变化
function handleCurrentChange(page: number) {
  currentPage.value = page;
  fetchImageList({
    match: searchKeyword.value,
  });
}

// 搜索输入
const handleSearchInput = useDebounceFn(function (val: string) {
  searchKeyword.value = val;
  currentPage.value = 1;
  fetchImageList({
    match: val,
  });
}, 333);

// 清除搜索
function handleSearchClear() {
  searchKeyword.value = "";
  currentPage.value = 1;
  fetchImageList();
}
</script>

<style scoped>
.image-selector-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
}

.image-select-button {
  flex: 1 1 120px;
  min-width: 0;
  max-width: 240px;
  justify-content: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 4px;
}

.image-select-button :deep(.el-button__text),
.image-select-button :deep(span) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.image-search-wrapper {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.image-search-wrapper .el-input {
  flex: 1;
}

.image-search-by-image-button {
  width: 32px;
  padding: 0;
  flex: 0 0 32px;
}

.image-search-file-input {
  display: none;
}

.image-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
  min-height: 0;
}

.image-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.image-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding: 4px;
}

.image-item {
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
}

.image-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.image-item-selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.image-item-thumbnail {
  width: 100%;
  height: 120px;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-item-info {
  flex: 1;
  min-height: 30px;
}

.image-item-name {
  font-weight: 500;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  text-align: center;
  max-width: 100%;
}

.image-item-source {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
}

.image-item-check {
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
}

.image-pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
  width: 100%;
  background: #fff;
}

.image-current-selected {
  padding: 12px 16px;
  background: #f0f9ff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
  max-height: 120px;
  overflow: hidden;
}

.image-current-selected__label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.image-current-selected__card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-current-selected__thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e4e7ed;
}

.image-current-selected__thumb .image-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-current-selected__info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.image-current-selected__name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-current-selected__id {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
