<template>
  <el-dialog
    v-model="dialogVisible"
    title="设计知识库"
    fullscreen
    :close-on-click-modal="false"
    destroy-on-close
    class="knowledge-dialog"
  >
    <div class="knowledge-dialog-content">
      <div class="knowledge-toolbar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索知识标题或内容"
          clearable
          size="default"
          style="width: 280px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterCategory"
          placeholder="全部分类"
          clearable
          size="default"
          style="width: 140px"
          @change="handleSearch"
        >
          <el-option label="全部" value="" />
          <el-option label="CSS技巧" value="css-trick" />
          <el-option label="颜色值" value="color-value" />
          <el-option label="代码配置" value="code-config" />
          <el-option label="设计原则" value="design-principle" />
          <el-option label="模板技巧" value="template-tip" />
          <el-option label="其他" value="other" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <div class="toolbar-spacer"></div>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
      </div>

      <div class="knowledge-content" v-loading="loading">
        <div v-if="list.length === 0 && !loading" class="empty-state">
          <el-icon :size="64" class="empty-icon"><Collection /></el-icon>
          <div class="empty-text">暂无知识条目</div>
          <div class="empty-hint">点击"新增"录入设计知识</div>
        </div>

        <div v-else class="knowledge-grid">
          <div
            v-for="item in list"
            :key="item.id"
            class="knowledge-card"
            @click="handleEdit(item)"
          >
            <div class="card-header">
              <span class="card-title">{{ item.title }}</span>
              <el-tag size="small" :type="getCategoryType(item.category)">
                {{ getCategoryLabel(item.category) }}
              </el-tag>
            </div>
            <div class="card-content">{{ truncateContent(item.content) }}</div>
            <div class="card-footer">
              <div class="card-tags">
                <el-tag
                  v-for="tag in (item.tags || []).slice(0, 3)"
                  :key="tag"
                  size="small"
                  type="info"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
                <el-tag
                  v-if="(item.tags || []).length > 3"
                  size="small"
                  type="info"
                  class="tag-item"
                >
                  +{{ item.tags.length - 3 }}
                </el-tag>
              </div>
              <div class="card-actions">
                <el-button link type="primary" size="small" @click.stop="handleEdit(item)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click.stop="handleDelete(item)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="knowledge-pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @current-change="loadList"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <edit-dialog
      v-model:visible="editDialogVisible"
      :edit-data="currentEditItem"
      @success="handleEditSuccess"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, Collection } from "@element-plus/icons-vue";
import {
  getDesignKnowledgePage,
  deleteDesignKnowledge,
} from "@/api";
import EditDialog from "./edit-dialog.vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const dialogVisible = ref(false);

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
    if (val) loadList();
  },
);

watch(dialogVisible, (val) => {
  emit("update:visible", val);
});

const loading = ref(false);
const list = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);
const searchKeyword = ref("");
const filterCategory = ref("");

const editDialogVisible = ref(false);
const currentEditItem = ref<any>(null);

const categoryMap: Record<string, { label: string; type: string }> = {
  "css-trick": { label: "CSS技巧", type: "" },
  "color-value": { label: "颜色值", type: "success" },
  "code-config": { label: "代码配置", type: "warning" },
  "design-principle": { label: "设计原则", type: "danger" },
  "template-tip": { label: "模板技巧", type: "info" },
  other: { label: "其他", type: "info" },
};

function getCategoryLabel(category: string) {
  return categoryMap[category]?.label || category;
}

function getCategoryType(category: string) {
  return (categoryMap[category]?.type as any) || "info";
}

function truncateContent(content: string) {
  if (!content) return "";
  return content.length > 150 ? content.slice(0, 150) + "..." : content;
}

async function loadList() {
  loading.value = true;
  try {
    const res = await getDesignKnowledgePage({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined,
      category: filterCategory.value || undefined,
    });
    list.value = res?.list || [];
    total.value = res?.total || 0;
  } catch (error) {
    console.error("加载知识列表失败:", error);
    ElMessage.error("加载知识列表失败");
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  currentPage.value = 1;
  loadList();
}

function resetSearch() {
  searchKeyword.value = "";
  filterCategory.value = "";
  currentPage.value = 1;
  loadList();
}

function handleSizeChange() {
  currentPage.value = 1;
  loadList();
}

function handleCreate() {
  currentEditItem.value = null;
  editDialogVisible.value = true;
}

function handleEdit(item: any) {
  currentEditItem.value = { ...item };
  editDialogVisible.value = true;
}

async function handleDelete(item: any) {
  try {
    await ElMessageBox.confirm(
      `确定要删除知识条目"${item.title}"吗？`,
      "确认删除",
      { type: "warning" },
    );
    await deleteDesignKnowledge({ ids: [item.id] });
    ElMessage.success("删除成功");
    loadList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
}

function handleEditSuccess() {
  loadList();
}
</script>

<style scoped>
.knowledge-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.knowledge-dialog-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.knowledge-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.toolbar-spacer {
  flex: 1;
}

.knowledge-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--el-text-color-secondary);
}

.empty-icon {
  margin-bottom: 16px;
  color: var(--el-text-color-placeholder);
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.knowledge-card {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--el-bg-color);
}

.knowledge-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
}

.card-content {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 11px;
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.knowledge-card:hover .card-actions {
  opacity: 1;
}

.knowledge-pagination {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
