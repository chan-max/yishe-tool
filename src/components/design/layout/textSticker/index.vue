<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-tab">
      <div @click="tab = 'resource'" class="designiy-text-sticker-tab-item" :class=" (tab === 'resource') && 'designiy-text-sticker-tab-item-focus'">
          所有文字贴纸
      </div>
      <div @click="tab = 'custom'" class="designiy-text-sticker-tab-item" :class=" (tab === 'custom') && 'designiy-text-sticker-tab-item-focus'">
        自定义贴纸
      </div>
    </div>

    <div class="designiy-text-sticker-content">
      <custom v-if="tab === 'custom'"></custom>
      <resource v-if="tab === 'resource'"></resource>
    </div>
  </div>
</template>

<script setup lang="ts">
import custom from "./custom.vue";
import resource from "./resource.vue";
import { ref } from "vue";
import { EditPen, Picture } from "@element-plus/icons-vue";

const tab = ref("resource");
</script>

<style lang="less">
.designiy-text-sticker {
  display: flex;
  flex-direction: column;
  width: auto;
  width: 300px;
  height: 100%;
  justify-content: space-between;
}

.designiy-text-sticker-content {
  height: 100%;
  overflow: auto;
}

.designiy-text-sticker-tab {
  display:flex;
  justify-content:space-between;
  align-items:center;
  background-color:#fafafa;
  margin:10px;
  padding:5px;
  border-radius:20px;
}

.designiy-text-sticker-tab-item{
  width:50%;
  color:#777;
  padding:3px 5px;
  font-size:12px;
  border-radius:20px;
  text-align:center;
  cursor:pointer;
}

.designiy-text-sticker-tab-item-focus{
  background-color:#eee;
  color:#555;
}
</style>
