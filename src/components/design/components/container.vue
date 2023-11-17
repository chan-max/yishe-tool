<template>
  <div v-if="show" class="designiy-container">
    <div class="designiy-container-content">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted, onBeforeMount, computed, watch } from "vue";


const props = defineProps({
  show: {
    default: true,
  }, // 是否展示
  zIndex: {},
});

</script>
<style>
.designiy-container {
  z-index: 1;
  background: var(--1s-container-background);
  position: absolute;
}

.designiy-container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: move;
}

.designiy-container-header-close {
  color: var(--1s-container-header-text-color);
  cursor: pointer;
  display: flex;
  padding: 5px;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #eee;
  }
}

.designiy-container-header-title {
  color: var(--1s-container-header-text-color);
  font-size: 12px;
  font-weight: bold;
}

.designiy-container-content {
  width: 100%;
  height: 100%;
  text-align: left;
}

.container-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.2;
}
</style>
