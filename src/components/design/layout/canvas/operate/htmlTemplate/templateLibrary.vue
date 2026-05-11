<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> 模板库 </template>
    <template #content>
      <div class="html-template-library__trigger">
        <el-button size="small" type="primary" plain @click="openDialog">打开模板库</el-button>
      </div>
    </template>
  </operate-form-item>

  <el-dialog
    v-model="dialogVisible"
    fullscreen
    append-to-body
    class="html-template-library"
    title="选择 HTML 模板"
    :close-on-click-modal="false"
  >
    <div class="html-template-library__layout">
      <div class="html-template-library__toolbar">
        <el-input
          v-model="searchKeyword"
          clearable
          size="large"
          placeholder="搜索模板名称、标签、描述"
          class="html-template-library__search"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="html-template-library__stats">
          {{ filteredTemplates.length }} / {{ templateList.length }} 个模板
        </div>

        <el-button size="large" @click="dialogVisible = false">关闭</el-button>
      </div>

      <div v-loading="loading" class="html-template-library__grid">
        <template v-if="filteredTemplates.length">
          <div
            v-for="(template, index) in filteredTemplates"
            :key="template.id"
            class="html-template-library__card"
            :class="{
              'is-active': model?.htmlTemplateMeta?.id === template.id,
            }"
            @click="applyTemplate(template)"
          >
            <div class="html-template-library__preview">
              <div
                class="html-template-library__preview-inner"
                :class="previewPayloadMap[template.id]?.scopeClassName"
              >
                <div
                  class="html-template-library__preview-content"
                  v-html="previewPayloadMap[template.id]?.previewMarkup"
                ></div>
              </div>
            </div>
            <div class="html-template-library__card-body">
              <div class="html-template-library__card-title">{{ template.name }}</div>
              <div class="html-template-library__card-desc">{{ template.description }}</div>
              <div class="html-template-library__card-tags">
                <span v-for="tag in template.tags || []" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="html-template-library__empty">
          <div class="html-template-library__empty-title">没有找到匹配模板</div>
          <div class="html-template-library__empty-desc">
            试试其他关键词搜索。
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import icon from "@/components/design/assets/icon/project.svg?component";
import operateFormItem from "@/components/design/layout/canvas/operate/operateFormItem.vue";
import {
  getHtmlTemplateLibrary,
} from "@/components/design/layout/canvas/htmlTemplate/service.ts";
import {
  applyHtmlTemplateToTarget,
  createHtmlRenderPayload,
  ensureHtmlTemplateOptions,
} from "@/components/design/layout/canvas/htmlTemplate/runtime.ts";
import {
  type HtmlTemplateDefinition,
} from "@/components/design/layout/canvas/htmlTemplate/types";

const model = defineModel({
  default: {} as any,
});

const dialogVisible = ref(false);
const loading = ref(false);
const searchKeyword = ref("");
const templateList = ref<HtmlTemplateDefinition[]>([]);

const filteredTemplates = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return templateList.value;
  }

  return templateList.value.filter((item) => {
    const searchText = [
      item.name,
      item.description,
      ...(item.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(keyword);
  });
});

const previewPayloadMap = computed(() => {
  const payloadMap: Record<string, any> = {};

  filteredTemplates.value.forEach((template, index) => {
    const renderPayload = createHtmlRenderPayload({
      id: `template-preview-${template.id}-${index}`,
      htmlContent: template.htmlContent,
      htmlBindings: template.defaultBindings || {},
      htmlTemplateFields: template.bindingFields || [],
    });

    payloadMap[template.id] = {
      ...renderPayload,
      previewMarkup: [
        renderPayload.scopedCss ? `<style>${renderPayload.scopedCss}</style>` : "",
        renderPayload.sanitizedHtml || "",
      ]
        .filter(Boolean)
        .join(""),
    };
  });

  return payloadMap;
});

async function loadTemplateLibrary() {
  loading.value = true;
  try {
    templateList.value = await getHtmlTemplateLibrary();
  } finally {
    loading.value = false;
  }
}

async function openDialog() {
  ensureHtmlTemplateOptions(model.value);
  dialogVisible.value = true;
  await loadTemplateLibrary();
}

function applyTemplate(template: HtmlTemplateDefinition) {
  applyHtmlTemplateToTarget(model.value, template);
  dialogVisible.value = false;
}
</script>

<style scoped lang="less">
.html-template-library__trigger {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.html-template-library__layout {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.html-template-library__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.html-template-library__search {
  flex: 1;
  min-width: 280px;
}

.html-template-library__stats {
  font-size: 12px;
  color: #6b7280;
  flex-shrink: 0;
}

.html-template-library__grid {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  grid-auto-rows: 480px;
  gap: 18px;
  padding-right: 6px;
  padding-bottom: 8px;
  scrollbar-gutter: stable;
}

.html-template-library__card {
  height: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 0;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.html-template-library__card:hover,
.html-template-library__card.is-active {
  transform: translateY(-2px);
  border-color: #c7d2fe;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.12);
}

.html-template-library__preview {
  flex: 0 0 auto;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  padding: 14px;
}

.html-template-library__preview-inner {
  height: 220px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  background: #fff;
}

.html-template-library__preview-content {
  width: 100%;
  height: 100%;
}

.html-template-library__card-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 16px 18px;
  scrollbar-gutter: stable;
}

.html-template-library__card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.html-template-library__card-desc {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: #6b7280;
}

.html-template-library__card-tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.html-template-library__card-tags span {
  font-size: 11px;
  color: #475569;
  background: #f8fafc;
  border-radius: 999px;
  padding: 5px 9px;
}

.html-template-library__empty {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  min-height: 280px;
  border: 1px dashed #cbd5e1;
  border-radius: 24px;
  background: linear-gradient(180deg, #f8fafc, #ffffff);
}

.html-template-library__empty-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.html-template-library__empty-desc {
  font-size: 12px;
  color: #6b7280;
}

.html-template-library__grid::-webkit-scrollbar,
.html-template-library__card-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.html-template-library__grid::-webkit-scrollbar-thumb,
.html-template-library__card-body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.68);
  border-radius: 999px;
}

.html-template-library__grid::-webkit-scrollbar-track,
.html-template-library__card-body::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.9);
  border-radius: 999px;
}

@media (max-width: 900px) {
  .html-template-library__trigger,
  .html-template-library__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .html-template-library__search {
    max-width: none;
  }

  .html-template-library__grid {
    grid-auto-rows: 450px;
  }
}
</style>
