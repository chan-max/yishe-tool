<template>
  <div class="s1-table">
    <vxe-toolbar v-if="$slots['toolbar-left'] || $slots['toolbar-right']">
      <template #buttons>
        <slot name="toolbar-left"></slot>
      </template>
      <template #tools>
        <slot name="toolbar-right"></slot>
      </template>
    </vxe-toolbar>
    <vxe-grid
      v-bind="{
        ...baseGridOptions,
        ...$attrs,
      }"
    >
      <template v-for="(_, slot) in slots" #[slot]="bind">
        <slot :name="slot" v-bind="bind"></slot>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from "vue";
import { ref } from "vue";

const slots = useSlots();

const baseGridOptions = ref({
  border: "inner",
  headerCellClassName: "header-cell-class",
  cellClassName: "cell-class",
  rowClassName: "row-class",
  size: "mini",
  editConfig: {
    enable: true,
    trigger: "dblclick",
    mode: "row",
    showIcon: true,

    showStatus: true,
  },
  keepSource: true,
});
</script>

<style>
.s1-table {
  --vxe-ui-input-height-mini: 24px;
  border-radius: 12px;
  box-shadow: 0px 0px 13px 0px rgba(82, 63, 105, 0.05);
  padding: 24px;
  background-color: #fff;
}
</style>
