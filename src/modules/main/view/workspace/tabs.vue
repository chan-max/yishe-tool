<template>
  <div class="tabs">
    <div
      v-for="item in WorkspaceTabOptions"
      :class="{ 'tabs-item-active': activeWorkspaceTab == item.key }"
      class="tabs-item"
      @click="activeWorkspaceTab = item.key"
    >
      {{ item.label }}
    </div>
    <div style="flex: 1"></div>
  </div>
</template>
<script setup>
import { WorkspaceTabOptions, activeWorkspaceTab } from "./index.ts";
</script>

<style scoped>
.tabs {
  padding:0 20px;
  max-width: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
  background-color: #fff;
  z-index: 1;
}

.tabs-item {
  color: #777;
  font-weight: 400;
  padding: 8px 16px;
  transition: all 0.2s;
  border-radius: 12px;
  text-wrap: nowrap;
  font-size: 14px;
}
.tabs-item:hover {
  background-color: #aaa;
  cursor: pointer;
}

.tabs-item-active {
  background-color: #aaa;
  cursor: pointer;
  color:#fff;
}
</style>
