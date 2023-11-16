<template>
  <transition v-bind="animation">
    <Draggable
      v-if="show"
      @vue:mounted="mounted"
      class="designiy-container"
      v-slot="{ x, y }"
      :initial-value="{ x, y }"
      :prevent-default="true"
      :handle="handle"
      :style="{ zIndex: czIndex }"
    >
      <Teleport to="body">
        <div v-if="mask" class="container-mask" :style="{ zIndex: mzIndex }"></div>
      </Teleport>
      <div ref="handle" v-show="header" class="designiy-container-header">
        <div class="designiy-container-header-title">
          <slot name="title" v-if="$slots.title"></slot>
          <span v-else> {{ title }} </span>
        </div>
        <div @click="close" class="designiy-container-header-close">
          <el-icon><CloseBold /></el-icon>
        </div>
      </div>
      <div class="designiy-container-content">
        <slot></slot>
      </div>
    </Draggable>
  </transition>
</template>
<script setup>
import { defineProps, ref, onMounted, computed } from "vue";
import { useDraggable } from "@vueuse/core";
import { UseDraggable as Draggable } from "@vueuse/components";
import { zIndexContainer } from "../store";
import { CloseBold } from "@element-plus/icons-vue";

const handle = ref();
const { x, y, style } = useDraggable(handle, {
  initialValue: {},
});

const props = defineProps({
  draggable: false, //
  title: "", // 顶部标题
  show: {
    default: true,
  }, // 是否展示
  header: {
    default: true,
  },
  mask: {
    default: false,
  },
  animation: {},
});

const emits = defineEmits(["close"]);

function close() {
  emits("close");
}

// 当前弹窗的zindex
const czIndex = ref(0);

const mzIndex = ref(0);

function mounted() {
  mzIndex.value = (czIndex.value = zIndexContainer.value += 2) - 1;
}
</script>
<style>
.designiy-container {
  z-index: 9;
  background: var(--1s-container-background);
  position: absolute;
}

.designiy-container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: move;
}

.designiy-container-header-close {
  color: var(--1s-container-header-text-color);
  cursor: pointer;
  display: flex;
  padding: 5px;
  justify-content: center;
  align-items: center;
  &:hover{
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
  overflow-y: auto;
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
