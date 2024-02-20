<template>
  <div class="masonry"></div>
</template>
<script setup>

import { defineProps } from "vue";

const props = defineProps({
  list: {
  },
  columns:{
    default:2
  },
  columnGap: {
    default: 0,
  },
  rowGap: {
    default: 0,
  },
});
</script>
<style lang="less">

</style>
