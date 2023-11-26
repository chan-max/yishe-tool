<template>
  <div class="designiy-workspace-operatemodel">
    {{currentOperatingModelInfo}}
  </div>
</template>
<script setup>
import { currentOperatingModelInfo } from "../../store";

</script>
<style lang="less">
.designiy-workspace-operatemodel {
  width: 100%;
  height: 100%;
  padding:20px;
}
</style>
