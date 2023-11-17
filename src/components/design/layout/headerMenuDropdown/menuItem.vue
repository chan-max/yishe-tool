<template>
    <div class="designiy-dropdown-menu-item" @click.stop="itemClick">
      <div class="designiy-dropdown-menu-item-icon">
        <slot name="icon"></slot>
      </div>
      <div class="designiy-dropdown-menu-item-title">
        <slot name="title"></slot>
      </div>

      <div style="flex: 1"></div>
      <div class="designiy-dropdown-menu-item-suffix">
        <slot name="suffix"></slot>
      </div>
      <div class="designiy-dropdown-menu-item-arrow" v-if="$slots.children">
        <icon-right-arrow></icon-right-arrow>
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
import iconRightArrow from "@/icon/rightArrow.svg?vueComponent";
import { ref } from "vue";

const showChildren = ref(false);

function itemClick() {
  showChildren.value = !showChildren.value;
}
</script>
<style lang="less">
.designiy-dropdown-menu-item {
  position: relative;
  width: 200px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  column-gap: 5px;
}

.designiy-dropdown-menu-item-children {
  position: absolute;
  top: 0;
  left: calc(100% + 5px);
}

.designiy-dropdown-menu-item-icon {
  width: 12px;
  height: 12px;
  svg {
    width: 12px;
    height: 12px;
  }
}

.designiy-dropdown-menu-item-arrow {
  width: 12px;
  height: 12px;
  svg {
    width: 12px;
    height: 12px;
  }
}

</style>
