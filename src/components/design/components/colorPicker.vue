<template>
  <div class="color-picker">
    <color-picker v-bind="attrs" useType="both">
      <template #extra> sdfdafsfa </template>
    </color-picker>
  </div>
</template>
<script setup>
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

import { useAttrs } from "vue";

let attrs = useAttrs();
</script>
<style lang="less">
.color-picker {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}
.vc-color-wrap {
  margin-right: 0px !important;
  height: 100% !important;
  width: 100% !important;
}
</style>
