<template>
  <div class="designiy-text-sticker">
    <resource></resource>
  </div>
</template>

<script setup lang="ts">
import custom from "./custom.vue";
import resource from "./resource.vue";
import { ref } from "vue";
import { EditPen, Picture } from "@element-plus/icons-vue";


</script>

<style lang="less">
.designiy-text-sticker {
  display: flex;
  flex-direction: column;
  width: auto;
  width: 300px;
  height: 100%;
  justify-content: space-between;
}

.designiy-text-sticker-content {
  height: 100%;
  overflow: auto;
}

</style>
