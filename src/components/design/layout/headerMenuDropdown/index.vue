<template>
  <el-popover
    trigger="click"
    placement="bottom-start"
    v-model:visible="showHeaderMenuDropdown"
  >
    <template #reference>
      <div class="designiy-header-menu-dropdown">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </div>
    </template>
    <template #default>
      <div class="designiy-header-menu-dropdown-content">
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showHeaderMenuDropdown = ref(false);
</script>

<style lang="less">
.designiy-header-menu-dropdown {
  width: 30px;
  height: 30px;
  background: #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
