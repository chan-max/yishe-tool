<template>
  <div class="color-picker">
    <color-picker v-bind="attrs" useType="both" />
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
  width: 24px;
  height: 24px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  border:1px solid #ddd;
}
.vc-color-wrap {
  margin-right: 0px !important;
  height: 100% !important;
  width: 100% !important;
}
</style>
