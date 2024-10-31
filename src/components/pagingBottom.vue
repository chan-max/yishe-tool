<template>
  <div
    style="padding: 12px; width: 100%"
    class="paging-bottom flex flex-col items-center"
  >
    <div class="w-ful h-full" v-if="isEmpty">
      <template v-if="$slots.empty">
        <slot name="empty"></slot>
      </template>
      <template v-else> 无 </template>
    </div>
    <div v-else-if="loading" class="w-ful h-full">
      <template v-if="$slots.loading">
        <slot name="loading"></slot>
      </template>
      <template v-else> 加载中... </template>
    </div>
    <div v-else-if="isLastPage" class="w-ful h-full">
      <template v-if="$slots.isLastPage">
        <slot name="isLastPage"></slot>
      </template>
      <template v-else> 没有了~ </template>
    </div>
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
  box-sizing: border-box;
}
</style>
