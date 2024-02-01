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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
  background-color: #fff;
  z-index: 1;
}

.tabs-item {
  color: #555555;
  font-weight: 400;
  padding: 10px 20px;
  transition: all 0.2s;
  border-radius: 15px;
  text-wrap: nowrap;
}
.tabs-item:hover {
  background-color: #ddd;
  cursor: pointer;
}

.tabs-item-active {
  background-color: #ddd;
  cursor: pointer;
}
</style>
