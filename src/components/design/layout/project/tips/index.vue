<template>
  <div class="project-page flex flex-col min-h-full">
    <div class="flex-1 relative">
      <!-- 顶部操作栏 -->
      <div class="project-toolbar">
        <slot name="tabs"></slot>
        <div class="project-toolbar__controls">
          <el-input
            v-model="searchText"
            placeholder="搜索技巧标题或内容"
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
        <div class="project-toolbar__caption">{{ total }} 条</div>
        <el-button type="primary" @click="showFormModal = true">
          <el-icon><Plus /></el-icon>
          添加技巧
        </el-button>
      </div>

      <!-- 技巧列表 -->
      <div class="p-3 pt-0">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <div
            v-for="item in list"
            :key="item.id"
            class="project-card tip-card project-hover-lift"
          >
            <div class="flex justify-between items-start gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <el-tag v-if="item.category" size="small" class="rounded-full bg-primary/10 text-primary border-none">
                    {{ item.category }}
                  </el-tag>
                  <el-tag v-if="item.isPublic" size="small" type="success" class="rounded-full">
                    公开
                  </el-tag>
                </div>
                <div class="project-section-title tip-card__title">
                  {{ item.title }}
                </div>
                <div class="project-muted-text tip-card__snippet">
                  {{ item.content ? item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '') : '暂无内容' }}
                </div>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-1 mt-2">
                  <el-tag
                    v-for="tag in item.tags"
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
            
            <div class="project-placeholder-text tip-card__meta mt-3">
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
      <s1-empty v-if="isEmpty">
        <template #description>暂无设计技巧</template>
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
    width="700px"
    :title="isEdit ? '编辑技巧' : '添加技巧'"
    :okText="isEdit ? '保存' : '创建'"
    cancelText="取消"
    @ok="handleSubmit"
    :confirmLoading="submitLoading"
  >
    <el-form :model="form" label-width="80px" class="mt-4">
      <el-form-item label="标题" required>
        <el-input
          v-model="form.title"
          placeholder="请输入技巧标题"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="分类" required>
        <el-input
          v-model="form.category"
          placeholder="如：css-glass-effects、composition-patterns等"
          maxlength="64"
        />
      </el-form-item>
      <el-form-item label="标签">
        <el-input
          v-model="form.tags"
          placeholder="请输入标签，多个标签以英文逗号分隔"
        />
      </el-form-item>
      <el-form-item label="内容" required>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="12"
          placeholder="请输入技巧内容（支持 Markdown / CSS 属性示例）"
          style="font-family: monospace"
        />
      </el-form-item>
      <el-form-item label="公开">
        <el-switch v-model="form.isPublic" />
      </el-form-item>
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
  category: 'other',
  tags: '',
  content: '',
  isPublic: false
});

// 获取技巧列表
async function getList() {
  loading.value = true;
  try {
    const params: any = {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    };
    if (searchText.value.trim()) {
      params.keyword = searchText.value.trim();
    }
    const res = await Api.getDesignKnowledgePage(params);
    list.value = res.list || [];
    total.value = res.total || 0;
    isEmpty.value = list.value.length === 0;
  } catch (error) {
    console.error('获取设计技巧列表失败:', error);
    message.error('获取设计技巧列表失败');
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

// 编辑技巧
function editItem(item: any) {
  isEdit.value = true;
  form.value = {
    id: item.id,
    title: item.title,
    category: item.category || 'other',
    tags: Array.isArray(item.tags) ? item.tags.join(',') : '',
    content: item.content || '',
    isPublic: !!item.isPublic
  };
  showFormModal.value = true;
}

// 删除技巧
async function deleteItem(item: any) {
  try {
    await s1Confirm({
      content: `确认删除设计技巧"${item.title}"？`,
    });
    
    await Api.deleteDesignKnowledge(item.id);
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
    message.error('请输入技巧标题');
    return;
  }
  if (!form.value.category.trim()) {
    message.error('请输入分类');
    return;
  }
  if (!form.value.content.trim()) {
    message.error('请输入内容');
    return;
  }

  submitLoading.value = true;
  try {
    const tagArray = form.value.tags
      ? form.value.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: form.value.title,
      category: form.value.category,
      tags: tagArray,
      content: form.value.content,
      isPublic: form.value.isPublic,
      extras: {}
    };

    if (isEdit.value && form.value.id) {
      await Api.updateDesignKnowledge(form.value.id, payload);
      message.success('更新成功');
    } else {
      await Api.createDesignKnowledge(payload);
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
    category: 'other',
    tags: '',
    content: '',
    isPublic: false
  };
  isEdit.value = false;
}

onBeforeMount(() => {
  getList();
});
</script>

<style scoped lang="less">
.tip-card {
  min-height: 0;
  padding: 16px;
  background: var(--1s-surface-background);
  border: 1px solid var(--1s-border-color);
  border-radius: var(--1s-radius-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--1s-shadow-md);
    border-color: var(--1s-accent-color);
  }
}

.tip-card__title {
  color: var(--1s-text-color);
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

.tip-card__snippet {
  display: -webkit-box;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.5;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  color: var(--1s-text-color-secondary);
  white-space: pre-wrap;
  font-family: inherit;
}

.tip-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-top: 1px solid var(--1s-divider-color);
  padding-top: 12px;
  font-size: 11px;
  color: var(--1s-text-color-tertiary);
}
</style>
