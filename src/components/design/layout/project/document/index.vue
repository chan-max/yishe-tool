<template>
  <div class="project-page flex flex-col min-h-full">
    <div class="flex-1 relative">
      <!-- 顶部操作栏 -->
      <div class="project-toolbar">
        <slot name="tabs"></slot>
        <div class="project-toolbar__controls">
          <el-input
            v-model="searchText"
            placeholder="搜索文档标题或内容"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button @click="handleSearch" type="primary" :loading="loading">搜索</el-button>
        </div>
        <div class="project-toolbar__caption">{{ total }} 篇</div>
        <el-button type="primary" @click="showFormModal = true">
          <el-icon><Plus /></el-icon>
          添加文档
        </el-button>
      </div>

      <!-- 文档列表 -->
      <div class="p-3 pt-0">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <div
            v-for="item in list"
            :key="item.id"
            class="project-card document-card project-hover-lift"
          >
            <div class="flex justify-between items-start gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="project-placeholder-text text-[11px]">
                    ID: {{ item.id.substring(0, 8) }}...
                  </span>
                  <el-tag v-if="item.category" size="small" type="info" class="rounded-full">
                    {{ item.category }}
                  </el-tag>
                  <el-tag v-if="item.status && item.status !== 'published'" size="small" type="warning" class="rounded-full">
                    {{ item.status }}
                  </el-tag>
                </div>
                <div class="project-section-title document-card__title">
                  {{ item.title }}
                </div>
                <div v-if="item.summary" class="project-muted-text document-card__summary">
                  {{ item.summary }}
                </div>
                <div v-else class="project-muted-text document-card__summary">
                  {{ item.content ? item.content.substring(0, 100) + '...' : '暂无内容' }}
                </div>
                <div v-if="item.tags" class="flex flex-wrap gap-1 mt-2">
                  <el-tag
                    v-for="tag in String(item.tags).split(',').filter(Boolean)"
                    :key="tag"
                    size="small"
                    effect="plain"
                    class="border-none bg-black/5 dark:bg-white/5 text-[10px]"
                  >
                    #{{ tag }}
                  </el-tag>
                </div>
              </div>
              <a-dropdown trigger="click">
                <el-button link class="project-action-button">
                  <el-icon size="14">
                    <MoreFilled />
                  </el-icon>
                </el-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="editItem(item)">编辑</a-menu-item>
                    <a-menu-item @click="deleteItem(item)">
                      <span style="color: var(--el-color-danger)">删除</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            
            <div class="project-placeholder-text document-card__meta mt-3">
              <span>创建: {{ Utils.time.timeago(item.createTime) }}</span>
              <span>更新: {{ Utils.time.timeago(item.updateTime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="project-loading-overlay absolute inset-0 flex items-center justify-center">
        <div class="project-loading-overlay__spinner">
          <el-icon class="animate-spin text-lg"><Loading /></el-icon>
        </div>
      </div>

      <!-- 空状态 -->
      <s1-empty v-slot v-if="isEmpty">
        <template #description>暂无文档</template>
      </s1-empty>
    </div>
    
    <!-- 分页 -->
    <div class="project-footer">
      <div class="mx-auto flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 40, 60, 80]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <!-- 创建/编辑模态框 -->
  <a-modal
    v-model:open="showFormModal"
    :centered="true"
    :destroyOnClose="true"
    width="650px"
    :title="isEdit ? '编辑文档' : '添加文档'"
    :okText="isEdit ? '保存' : '创建'"
    cancelText="取消"
    @ok="handleSubmit"
    :confirmLoading="submitLoading"
  >
    <el-form :model="form" label-width="80px" class="mt-4">
      <el-form-item label="标题" required>
        <el-input
          v-model="form.title"
          placeholder="请输入文档标题"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-input
          v-model="form.category"
          placeholder="如：宣传推介、设计灵感、品牌故事等"
          maxlength="80"
        />
      </el-form-item>
      <el-form-item label="标签">
        <el-input
          v-model="form.tags"
          placeholder="请输入标签，以英文逗号分隔"
        />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="2"
          placeholder="请输入文档简要说明（可选）"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="内容" required>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="6"
          placeholder="请输入文档完整内容"
        />
      </el-form-item>
      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="类型">
          <el-select v-model="form.contentType" placeholder="请选择">
            <el-option label="纯文本" value="plain" />
            <el-option label="Markdown" value="markdown" />
            <el-option label="LaTeX" value="latex" />
            <el-option label="HTML" value="html" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="草稿" value="draft" />
            <el-option label="发布" value="published" />
            <el-option label="归档" value="archived" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </a-modal>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { MoreFilled, Loading, Plus, Search } from "@element-plus/icons-vue";
import Utils from "@/common/utils";
import Api from "@/api";
import { s1Confirm } from "@/common/message";
import { message } from "ant-design-vue";

// 数据状态
const list = ref([]);
const loading = ref(false);
const isEmpty = ref(false);

// 搜索相关
const searchText = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

// 表单相关
const showFormModal = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const form = ref({
  id: null,
  title: '',
  category: '',
  tags: '',
  summary: '',
  content: '',
  contentType: 'plain',
  status: 'published'
});

// 获取文档列表
async function getList() {
  loading.value = true;
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };
    if (searchText.value.trim()) {
      params.keyword = searchText.value.trim();
    }
    const res = await Api.getTextDocumentList(params);
    list.value = res.list || [];
    total.value = res.total || 0;
    isEmpty.value = list.value.length === 0;
  } catch (error) {
    console.error('获取文档列表失败:', error);
    message.error('获取文档列表失败');
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  currentPage.value = 1;
  getList();
}

function handleCurrentChange(val: number) {
  currentPage.value = val;
  getList();
}

function handleSizeChange(val: number) {
  pageSize.value = val;
  currentPage.value = 1;
  getList();
}

// 编辑文档
function editItem(item: any) {
  isEdit.value = true;
  form.value = {
    id: item.id,
    title: item.title,
    category: item.category || '',
    tags: item.tags || '',
    summary: item.summary || '',
    content: item.content || '',
    contentType: item.contentType || 'plain',
    status: item.status || 'published'
  };
  showFormModal.value = true;
}

// 删除文档
async function deleteItem(item: any) {
  try {
    await s1Confirm({
      content: `确认删除文档《${item.title}》？`,
    });
    
    await Api.deleteTextDocument(item.id);
    message.success('删除成功');
    await getList();
  } catch (error) {
    if (error) {
      message.error('删除失败');
    }
  }
}

// 提交表单
async function handleSubmit() {
  if (!form.value.title.trim()) {
    message.error('请输入文档标题');
    return;
  }
  if (!form.value.content.trim()) {
    message.error('请输入文档内容');
    return;
  }

  submitLoading.value = true;
  try {
    const payload = {
      title: form.value.title,
      category: form.value.category || null,
      tags: form.value.tags || null,
      summary: form.value.summary || null,
      content: form.value.content,
      contentType: form.value.contentType,
      status: form.value.status
    };

    if (isEdit.value && form.value.id) {
      await Api.updateTextDocument(form.value.id, payload);
      message.success('更新成功');
    } else {
      await Api.createTextDocument(payload);
      message.success('创建成功');
    }
    
    showFormModal.value = false;
    resetForm();
    await getList();
  } catch (error) {
    message.error(isEdit.value ? '更新失败' : '创建失败');
  } finally {
    submitLoading.value = false;
  }
}

// 重置表单
function resetForm() {
  form.value = {
    id: null,
    title: '',
    category: '',
    tags: '',
    summary: '',
    content: '',
    contentType: 'plain',
    status: 'published'
  };
  isEdit.value = false;
}

onBeforeMount(() => {
  getList();
});
</script>

<style scoped lang="less">
.document-card {
  min-height: 0;
  padding: 12px;
}

.document-card__title {
  color: var(--project-text-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 6px;
  margin-bottom: 6px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.document-card__summary {
  display: -webkit-box;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.5;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: var(--project-text-secondary);
}

.document-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-top: 1px dashed var(--1s-border-color-light);
  padding-top: 8px;
  font-size: 11px;
}
</style>
