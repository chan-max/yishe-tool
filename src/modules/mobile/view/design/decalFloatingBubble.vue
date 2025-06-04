<template>
  <van-floating-bubble
    class="decal-floating-bubble"
    v-if="currentOperatingDecalController"
    axis="xy"
    magnetic="x"
  >
    <s1-img :src="currentOperatingDecalController.state.info.thumbnail"></s1-img>
  </van-floating-bubble>
</template>

<script setup lang="ts">
import {
  currentModelController,
  currentOperatingDecalController,
} from "@/components/design/store";
</script>

<style lang="less">
.decal-floating-bubble {
  width: 64px;
  height: 64px;
  background-color: transparent;
  border: 4px solid #ddd;
}
</style>
