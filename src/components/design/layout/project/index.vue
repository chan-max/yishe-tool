<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-12 21:30:29
 * @FilePath: /1s/src/components/design/layout/project/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: calc(100vh - 8 0px); margin: 12px" class="flex">
    <div style="width: 120px">
      <el-tabs v-model="activeKey" tab-position="left" style="height: 400px">
        <el-tab-pane v-for="(tab, i) in tabs" :label="tab.label" :name="tab.key"></el-tab-pane>
      </el-tabs>
    </div>

      <div style="height: calc(100vh - 80px);width:100%;overflow: auto;">
        <component :is="activeComponent"></component>
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
import tabDraft from './draft/index.vue'
import { useLocalStorage } from "@vueuse/core";

const searchText = ref("");

enum UserOwnSourceType {
  CUSTOM_MODEL = "customModel",
  STICKER = "sticker",
  FONT = "font",
  COLLECT = "collect",
  LIKED = "liked",
  DRAFT = "draft"
}

const activeKey = useLocalStorage('_1s_projectActiveTab', UserOwnSourceType.STICKER);

const activeComponent = computed(() => {
  return toRaw(tabs.value.find((item) => item.key == activeKey.value).component);
});

const tabs = ref([
  {
    label: "草稿",
    key: UserOwnSourceType.DRAFT,
    component: tabDraft,
  },
  {
    label: "基础模型",
    key: "baseModel",
    component: tabBaseModel,
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
  {
    label: "设计模型",
    key: "customModel",
    component: tabCustomModel,
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
