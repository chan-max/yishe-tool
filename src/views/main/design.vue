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
    height: 800px;
    width: 1400px;
    position: fixed;
    left: calc(50% - 700px);
    top: 200px;
}
</style>
