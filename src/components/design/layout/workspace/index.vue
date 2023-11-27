<template>
  <div class="designiy-workspace">
    <div class="designiy-workspace-tab">
      <div
        :class="tab == Tab.MODEL && 'designiy-workspace-tab-item-active'"
        class="designiy-workspace-tab-item"
        @click="tab = Tab.MODEL"
      >
        模型信息
      </div>
      <div
        :class="tab == Tab.STICKER && 'designiy-workspace-tab-item-active'"
        class="designiy-workspace-tab-item"
        @click="tab = Tab.STICKER"
      >
        使用的贴纸
        <span class="designiy-operatesticker-badge"> {{currentController.decalControllers.length}} </span>
      </div>
      <div
        :class="tab == Tab.MORE && 'designiy-workspace-tab-item-active'"
        class="designiy-workspace-tab-item"
        @click="tab = Tab.MORE"
      >
        更多
      </div>
    </div>

    <div class="designiy-workspace-content">
      <operate-model v-if="tab == Tab.MODEL"></operate-model>
      <operate-sticker v-if="tab == Tab.STICKER"></operate-sticker>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { currentOperatingModelInfo,currentController } from "../../store";
import workspaceEmpty from "./empty.vue";
import operateModel from "./operateModel.vue";
import operateSticker from "./operateSticker.vue";

 enum Tab {
  MODEL,
  STICKER,
  MORE,
}

const tab = ref(Tab.MODEL);
</script>
<style lang="less">
.designiy-workspace {
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.designiy-workspace-tab {
  width: 100%;
  border-bottom: 1px solid #eee;
  padding: 15px 15px 0 15px;
  display: flex;
  column-gap: 10px;
}

.designiy-workspace-tab-item {
  font-size: 12px;
  cursor: pointer;
  color: #999;
  padding :5px;
}

.designiy-workspace-tab-item-active {
  color: #666;
  border-bottom: 2px solid #666;
}

.designiy-workspace-content {
  width: 100%;
  height: 100%;
}

.designiy-operatesticker-badge{
    padding: 2px 7px;
    background: #eee;
    // color: #aaa;
    border-radius: 5px;
}
</style>
