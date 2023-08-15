<template>
  <transition
    enter-active-class="animate__animated animate__bounceIn"
    leave-active-class="animate__animated animate__bounceOut"
    duration="80"
  >
    <div
      v-if="show"
      ref="el"
      class="designiy-dialog"
      :style="style"
      style="position: fixed;"
    >
      <div class="designiy-dialog-header">
        <div class="designiy-dialog-header-title">{{ title }}</div>
        <div @click="close" class="designiy-dialog-header-close">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </div>
      </div>
      <div class="designiy-dialog-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { defineProps, ref } from "vue";
import { useDraggable } from "@vueuse/core";
const el = ref();
const { x, y, style } = useDraggable(el, {
  initialValue: {},
});

const props = defineProps({
  title:'',
  show:'',
  position:{
    default(props){
      return {
        top:'',
        bottom:'',
        left:'',
        right:'',
        ...props.position
      }
    }
  }
});


const emits = defineEmits(["close"]);

function close() {
  emits("close");
}
</script>
<style>
.designiy-dialog {
  z-index: 9;
  /* 默认宽高 */
  background: #353535;
  border-radius: 2px;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);

  top:v-bind("props.position.top");
  left:v-bind("props.position.left");
  bottom:v-bind("props.position.bottom");
  right:v-bind("props.position.right");
}

.designiy-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.25) 100%
  );
  cursor: all-scroll;
  padding: 5px 10px;
  border-bottom: 2px solid #222;
}

.designiy-dialog-header-close {
  color: #c7c7c7;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.designiy-dialog-header-title {
  color: #c7c7c7;
  font-size: 12px;
  font-weight: bold;
}

.designiy-dialog-content {
  min-width: 400px;
  min-height: 200px;
}
</style>
