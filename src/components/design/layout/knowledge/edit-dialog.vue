<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑知识' : '新增知识'"
    fullscreen
    :close-on-click-modal="false"
    destroy-on-close
    class="knowledge-edit-dialog"
  >
    <div class="knowledge-edit-content">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <div class="knowledge-edit-layout">
          <!-- 左侧：主要内容编辑 -->
          <div class="knowledge-edit-main">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="简短描述这条知识"
                size="large"
                maxlength="255"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="知识内容" prop="content" class="content-editor-item">
              <el-input
                v-model="form.content"
                type="textarea"
                placeholder="知识内容（支持 Markdown）"
                class="content-editor"
              />
            </el-form-item>
          </div>

          <!-- 右侧：设置面板 -->
          <div class="knowledge-edit-sidebar">
            <div class="sidebar-section">
              <div class="sidebar-section-title">基本信息</div>
              <el-form-item label="分类" prop="category">
                <el-select v-model="form.category" placeholder="选择分类" style="width: 100%">
                  <el-option label="CSS技巧" value="css-trick" />
                  <el-option label="颜色值" value="color-value" />
                  <el-option label="代码配置" value="code-config" />
                  <el-option label="设计原则" value="design-principle" />
                  <el-option label="模板技巧" value="template-tip" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>

              <el-form-item label="可见性">
                <el-radio-group v-model="form.isPublic">
                  <el-radio :value="false">私有</el-radio>
                  <el-radio :value="true">公开</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-section-title">标签</div>
              <div class="tags-input-wrapper">
                <el-tag
                  v-for="tag in form.tags"
                  :key="tag"
                  closable
                  @close="removeTag(tag)"
                  class="mr-1 mb-1"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <el-input
                v-model="newTag"
                size="small"
                placeholder="输入标签后回车添加"
                @keyup.enter="addTag"
                @blur="addTag"
                class="mt-2"
              />
            </div>

            <div class="sidebar-section">
              <div class="sidebar-section-title">扩展数据 (JSON)</div>
              <el-input
                v-model="extrasJson"
                type="textarea"
                :rows="6"
                placeholder='{"key": "value"}'
              />
              <div v-if="extrasError" class="el-form-item__error">JSON 格式不正确</div>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" size="large">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit" size="large">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  createDesignKnowledge,
  updateDesignKnowledge,
} from "@/api";

const props = defineProps<{
  visible: boolean;
  editData?: any;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}>();

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const isEdit = computed(() => !!props.editData?.id);

const formRef = ref<FormInstance>();
const submitting = ref(false);
const newTag = ref("");
const extrasJson = ref("");
const extrasError = ref(false);

const form = ref({
  title: "",
  content: "",
  category: "other",
  tags: [] as string[],
  extras: {} as Record<string, any>,
  isPublic: false,
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
};

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        title: val.title || "",
        content: val.content || "",
        category: val.category || "other",
        tags: Array.isArray(val.tags) ? [...val.tags] : [],
        extras: val.extras || {},
        isPublic: val.isPublic ?? false,
      };
      extrasJson.value = val.extras ? JSON.stringify(val.extras, null, 2) : "";
    } else {
      form.value = {
        title: "",
        content: "",
        category: "other",
        tags: [],
        extras: {},
        isPublic: false,
      };
      extrasJson.value = "";
    }
    extrasError.value = false;
  },
  { immediate: true },
);

function addTag() {
  const tag = newTag.value.trim();
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag);
  }
  newTag.value = "";
}

function removeTag(tag: string) {
  form.value.tags = form.value.tags.filter((t) => t !== tag);
}

async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  // 解析 extras JSON
  let extras = {};
  if (extrasJson.value.trim()) {
    try {
      extras = JSON.parse(extrasJson.value);
      extrasError.value = false;
    } catch {
      extrasError.value = true;
      ElMessage.error("扩展数据格式错误，请输入有效的 JSON");
      return;
    }
  }

  submitting.value = true;
  try {
    const payload = {
      ...form.value,
      extras,
    };

    if (isEdit.value) {
      await updateDesignKnowledge({
        id: props.editData.id,
        ...payload,
      });
      ElMessage.success("更新成功");
    } else {
      await createDesignKnowledge(payload);
      ElMessage.success("创建成功");
    }

    visible.value = false;
    emit("success");
  } catch (error) {
    console.error("保存知识失败:", error);
    ElMessage.error("保存失败，请重试");
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.knowledge-edit-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.knowledge-edit-content {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.knowledge-edit-layout {
  display: flex;
  gap: 24px;
  height: 100%;
}

.knowledge-edit-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.knowledge-edit-sidebar {
  width: 320px;
  flex-shrink: 0;
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.sidebar-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.content-editor-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-editor-item :deep(.el-form-item__content) {
  flex: 1;
}

.content-editor {
  height: 100%;
}

.content-editor :deep(.el-textarea__inner) {
  height: 100% !important;
  min-height: 400px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.tags-input-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.mr-1 {
  margin-right: 4px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
