<template>
  <div class="designiy-dropdown-menu-item" @click.stop="itemClick">
    <div class="designiy-dropdown-menu-item-content">
      <div class="designiy-dropdown-menu-item-icon">
        <slot name="icon"></slot>
      </div>
      <div class="designiy-dropdown-menu-item-icon">
        <slot name="title"></slot>
      </div>
      <div style="flex: 1"></div>
      <div class="designiy-dropdown-menu-item-arrow" v-if="$slots.children">
        <el-icon size="10"><ArrowRightBold /></el-icon>
      </div>
    </div>

    <div
      v-if="$slots.children && showChildren"
      class="designiy-dropdown-menu-item-children"
    >
      <slot name="children"> </slot>
    </div>
  </div>
</template>
<script setup>
import { ArrowRightBold } from "@element-plus/icons-vue";
import { ref } from "vue";

const showChildren = ref(false);

function itemClick() {
  showChildren.value = !showChildren.value;
}
</script>
<style lang="less">
.designiy-dropdown-menu-item {
    position: relative;
}

.designiy-dropdown-menu-item-content {
  width: 100%;
  height: 40px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
}

.designiy-dropdown-menu-item-children {
  position: absolute;
  top: 0;
  left: calc(100% + 5px);
}

.designiy-dropdown-menu-item-content:hover {
  background-color: #f6f6f6;
}
</style>
