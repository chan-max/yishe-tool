<template>
  <div class="project-shell">
    <div class="project-shell__main">
      <component :is="activeComponent">
        <template #tabs>
          <nav class="project-shell__nav" aria-label="创作资源分类">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="project-shell__nav-item"
              :class="{ 'is-active': activeKey === tab.key }"
              @click="activeKey = tab.key"
            >
              {{ tab.label }}
            </button>
          </nav>
        </template>
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, markRaw } from "vue";
import tabSticker from "./sticker/index.vue";
import tabFont from "./font/index.vue";
import tabSentence from "./sentence/index.vue";
import tabDocument from "./document/index.vue";
import tabTips from "./tips/index.vue";
import { useLocalStorage } from "@vueuse/core";

enum UserOwnSourceType {
  CUSTOM_MODEL = "customModel",
  STICKER = "sticker",
  FONT = "font",
  COLLECT = "collect",
  LIKED = "liked",
  DRAFT = "draft",
  DOCUMENT = "document",
  TIPS = "tips",
}

const activeKey = useLocalStorage(
  "_1s_projectActiveTab",
  UserOwnSourceType.STICKER,
);

const tabs = ref([
  {
    label: "贴纸",
    key: "sticker",
    component: markRaw(tabSticker),
  },
  {
    label: "字体",
    key: UserOwnSourceType.FONT,
    component: markRaw(tabFont),
  },
  {
    label: "句子",
    key: "sentence",
    component: markRaw(tabSentence),
  },
  {
    label: "文档",
    key: UserOwnSourceType.DOCUMENT,
    component: markRaw(tabDocument),
  },
  {
    label: "技巧",
    key: UserOwnSourceType.TIPS,
    component: markRaw(tabTips),
  },
]);

if (!tabs.value.some((item) => item.key === activeKey.value)) {
  activeKey.value = UserOwnSourceType.STICKER;
}

const activeComponent = computed(() => {
  const currentTab =
    tabs.value.find((item) => item.key == activeKey.value) || tabs.value[0];
  return currentTab.component;
});
</script>

<style lang="less">
/* ==========================================================================
   Material Design 3 (MD3) - 创作资源模态弹窗与工作区样式
   ========================================================================== */

.full-modal--project-resources {
  .ant-modal {
    max-width: 100vw;
  }

  .ant-modal-content {
    overflow: hidden;
    background: var(--1s-surface-background);
    border-radius: var(--1s-radius-lg);
    box-shadow: var(--1s-shadow-lg);
  }

  .ant-modal-header {
    height: 50px;
    padding: 0 20px;
    background: var(--1s-surface-background);
    border-bottom: 1px solid var(--1s-divider-color);
    display: flex;
    align-items: center;
  }

  .ant-modal-title {
    color: var(--1s-text-color);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.2px;
  }

  .ant-modal-close {
    top: 8px;
    inset-inline-end: 12px;
    width: 34px;
    height: 34px;
    border-radius: var(--1s-radius-pill);
    background: transparent;
    color: var(--1s-text-color-secondary);
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .ant-modal-close:hover {
    background: var(--1s-hover-background);
    color: var(--1s-text-color);
  }

  .ant-modal-body {
    height: calc(100vh - 50px);
    max-height: calc(100vh - 50px);
    overflow: hidden;
    padding: 0;
    background: var(--1s-panel-background);
  }
}

.project-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--1s-panel-background);
  color: var(--1s-text-color);

  &__main {
    width: 100%;
    min-width: 0;
    flex: 1;
    overflow: auto;
    background: var(--1s-panel-background);
  }

  /* MD3 Pill Navigation 分类胶囊轨 */
  &__nav {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 3px;
    border-radius: var(--1s-radius-pill);
    background: var(--1s-surface-background);
    border: 1px solid var(--1s-border-color);
  }

  &__nav-item {
    height: 30px;
    padding: 0 16px;
    border: 0;
    border-radius: var(--1s-radius-pill);
    background: transparent;
    color: var(--1s-text-color-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);

    &:hover {
      background: var(--1s-hover-background);
      color: var(--1s-text-color);
    }

    &.is-active {
      background: var(--1s-accent-color);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
  }
}

body.designiy-dark,
.designiy.dark {
  .project-shell__nav-item.is-active {
    background: var(--1s-accent-color-soft);
    color: var(--1s-left-menu-item-text-active-color);
  }
}

/* 顶部操作与筛选栏 */
.project-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 8px 20px;
  background: var(--1s-surface-background);
  border-bottom: 1px solid var(--1s-divider-color);

  &__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }

  &__group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  &__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--1s-text-color-secondary);
  }

  &__caption {
    font-size: 12px;
    color: var(--1s-text-color-tertiary);
    font-weight: 500;
  }

  .el-button {
    height: 32px;
    padding: 0 14px;
    border-radius: var(--1s-radius-pill);
    border: 1px solid var(--1s-border-color);
    background: var(--1s-surface-background);
    color: var(--1s-text-color);
    font-size: 12px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--1s-hover-background);
      border-color: var(--1s-accent-color);
      color: var(--1s-accent-color);
    }
  }

  .el-select__wrapper {
    min-height: 32px;
    border-radius: var(--1s-radius-pill);
    background: var(--1s-control-surface-muted);
    box-shadow: 0 0 0 1px var(--1s-border-color) inset;
  }
}

/* MD3 资源卡片网格 */
.project-gallery-card {
  display: flex;
  flex-direction: column;
  background: var(--1s-surface-background);
  border: 1px solid var(--1s-border-color);
  border-radius: var(--1s-radius-lg);
  padding: 8px;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--1s-shadow-md);
    border-color: var(--1s-accent-color);
  }

  &__media {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: var(--1s-radius-md);
    background: var(--1s-panel-background);
    cursor: pointer;
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 4px 4px 4px;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    color: var(--1s-text-color);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }
}

/* MD3 胶囊小标签 (Chips & Tags) */
.project-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 8px;
  border-radius: var(--1s-radius-pill);
  background: var(--1s-control-surface-muted);
  color: var(--1s-text-color-secondary);
  font-size: 11px;
  font-weight: 500;

  &--accent {
    background: var(--1s-active-background);
    color: var(--1s-accent-color);
    font-weight: 600;
  }

  &--success {
    background: rgba(34, 197, 94, 0.14);
    color: #16a34a;
  }

  &--danger {
    background: rgba(239, 68, 68, 0.14);
    color: #dc2626;
  }
}

.project-timeago {
  font-size: 11px;
  color: var(--1s-text-color-tertiary);
  margin-left: auto;
}

.project-action-button {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--1s-radius-pill);
  color: var(--1s-text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--1s-hover-background);
    color: var(--1s-accent-color);
  }
}
</style>
