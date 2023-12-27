<template>
  <KeepAlive>
    <transition v-bind="animation">
      <Draggable
        v-if="show"
        class="designiy-dialog"
        v-slot="{ x, y }"
        :initial-value="{ x, y }"
        :prevent-default="true"
        :handle="handle"
        :style="{ zIndex: 1000 }"
      >
        <Teleport to="body">
          <div
            v-if="show && mask"
            class="dialog-mask"
            @click="$emit('close')"
            :style="{ zIndex: 999 }"
          ></div>
        </Teleport>
        <div ref="handle" v-show="header" class="designiy-dialog-header">
          <div class="designiy-dialog-header-title">
            <slot name="title" v-if="$slots.title"></slot>
            <span v-else> {{ title }} </span>
          </div>
          <div @click="close" class="designiy-dialog-header-close">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
        <div class="designiy-dialog-content">
          <slot></slot>
        </div>
      </Draggable>
    </transition>
  </KeepAlive>
</template>
<script setup>
import { defineProps, ref, onMounted, onBeforeMount, computed, watch } from "vue";
import { useDraggable } from "@vueuse/core";
import { UseDraggable as Draggable } from "@vueuse/components";
import { CloseBold } from "@element-plus/icons-vue";

const handle = ref();
const { x, y, style } = useDraggable(handle, {
  initialValue: {},
});

const props = defineProps({
  title: "", // 顶部标题
  show: {
    default: true,
  }, // 是否展示
  header: {
    default: true,
  },
  // 存在遮罩层时
  mask: {
    default: true,
  },
  animation: {},
});

const emits = defineEmits(["close"]);

function close() {
  emits("close");
}
</script>
<style lang="less">
.designiy-dialog {
  background: var(--1s-container-background);
  position: absolute;
  border-radius: 6px;
  *{
    pointer-events: auto!important;
  }
}

.designiy-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: move;
}

.designiy-dialog-header-close {
  color: var(--1s-container-header-text-color);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #eee;
  }
}

.designiy-dialog-header-title {
  color: var(--1s-container-header-text-color);
  font-size: 12px;
  font-weight: bold;
}

.designiy-dialog-content {
  width: 100%;
  height: 100%;
  text-align: left;
}

.dialog-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.2;
}
</style>
