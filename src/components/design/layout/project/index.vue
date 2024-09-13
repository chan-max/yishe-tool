<template>
  <div style="height: 600px; margin: 12px" class="flex">
    <div style="width: 120px">
      <el-tabs v-model="activeKey" tab-position="left" style="height: 400px">
        <el-tab-pane v-for="(tab, i) in tabs" :label="tab.label" :name="tab.key"></el-tab-pane>
      </el-tabs>
    </div>
    <div style="flex-shrink: 0">
      <div style="height: calc(600px - 12px); min-width:1020px;overflow: auto;">
        <component :is="activeComponent"></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, toRaw } from "vue";

import { SearchOutlined } from "@ant-design/icons-vue";

import tabBaseModel from './baseModel/index.vue'
import tabSticker from "./sticker/index.vue";
import tabFont from "./font/index.vue";
import tabCustomModel from './customModel/index.vue'
import { useLocalStorage } from "@vueuse/core";

const searchText = ref("");

enum UserOwnSourceType {
  CUSTOM_MODEL = "customModel",
  STICKER = "sticker",
  FONT = "font",
  COLLECT = "collect",
  LIKED = "liked",
}

const activeKey = useLocalStorage('_1s_projectActiveTab', UserOwnSourceType.STICKER);

const activeComponent = computed(() => {
  return toRaw(tabs.value.find((item) => item.key == activeKey.value).component);
});

const tabs = ref([
  {
    label: "基础模型",
    key: "baseModel",
    component: tabBaseModel,
  },
  {
    label: "设计模型",
    key: "customModel",
    component: tabCustomModel,
  },
  {
    label: "贴纸",
    key: "sticker",
    component: tabSticker,
  },
  {
    label: "字体",
    key: UserOwnSourceType.FONT,
    component: tabFont,
  },
]);

</script>
<style lang="less" scoped>
.item {
  background: red;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  background-color: #f5f5f5;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  }
}

:deep(.el-tabs__item) {
  font-weight: 400;
  --el-text-color-primary: #888;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 900;
}
</style>
