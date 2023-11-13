<template>
  <transition>
    <Draggable
      v-if="show"
      @vue:mounted="mounted"
      class="designiy-dialog"
      v-slot="{ x, y }"
      :initial-value="{ x, y }"
      :prevent-default="true"
      :handle="handle"
      :style="{ zIndex }"
    >
      <div ref="handle" v-show="header" class="designiy-dialog-header">
        <div class="designiy-dialog-header-title">
          <slot name="title" v-if="$slots.title"></slot>
          <span v-else> {{ title }} </span>
        </div>
        <div @click="close" class="designiy-dialog-header-close">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </div>
      </div>
      <div class="designiy-dialog-content">
        <slot></slot>
      </div>
    </Draggable>
  </transition>
</template>
<script setup>
import { defineProps, ref, onMounted, computed } from "vue";
import { useDraggable } from "@vueuse/core";
import { UseDraggable as Draggable } from "@vueuse/components";
import { zIndexDialog } from "../store";

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
  position: {
    default(props) {
      return {
        top: "",
        bottom: "",
        left: "",
        right: "",
        ...props.position,
      };
    },
  },
});

const emits = defineEmits(["close"]);

function close() {
  emits("close");
}

const zIndex = ref();

function mounted() {
  zIndex.value = zIndexDialog.value;
  zIndexDialog.value += 1;
}
</script>
<style>
.designiy-dialog {
  z-index: 9;
  background: var(--1s-dialog-background);
  top: v-bind("props.position.top");
  left: v-bind("props.position.left");
  bottom: v-bind("props.position.bottom");
  right: v-bind("props.position.right");
  position: absolute;
}

.designiy-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: move;
}

.designiy-dialog-header-close {
  color: var(--1s-dialog-header-text-color);
  cursor: pointer;
  display: flex;
  padding: 5px;
  justify-content: center;
  align-items: center;
}

.designiy-dialog-header-title {
  color: var(--1s-dialog-header-text-color);
  font-size: 12px;
  font-weight: bold;
}

.designiy-dialog-content {
  width: 100%;
  height: 100%;
  text-align: left;
  overflow-y: auto;
}
</style>
