<template>
  <div
    style="padding: 24px; width: 100%"
    class="paging-bottom flex flex-col items-center"
  >
    <div v-if="isEmpty">无</div>
    <div v-else-if="loading">加载中...</div>
    <div v-else-if="isLastPage">没有了~</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isEmpty: null,
  loading: null,
  isLastPage: null,
});
</script>

<style scoped lang="less">
.paging-bottom {
  color: #ccc;
  font-weight: bold;
}
</style>
