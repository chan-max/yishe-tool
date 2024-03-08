<template>
  <div class="design-view">
    <designiy></designiy>
  </div>
</template>
<script setup>
import designiy from "@/components/design/index.vue";
</script>
<style lang="less">
.design-view {
  height: 100%;
  width: 100%;
  display: flex;
  // margin: 2%;
  // border-radius: 2%;
  justify-content: center;
  align-items: center;
  user-select: none;
}
</style>
