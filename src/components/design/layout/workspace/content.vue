<template>
  <div class="designiy-workspace-content">
    {{ currentOperatingModelInfo }}
  </div>
</template>
<script setup>
import { currentOperatingModelInfo } from "../../store";

</script>
<style lang="less">
.designiy-workspace-content {
  width: 100%;
  height: 100%;
}
</style>
