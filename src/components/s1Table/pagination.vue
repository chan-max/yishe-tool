<template>
  <div class="s1-pagination">
    <div style="flex: 1"></div>
    <el-pagination
      size="small"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5, 10, 15, 30, 50]"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @update:current-page="currentPageChange"
      @update:page-size="pageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  total: {
    default: 0,
  },
});

const currentPage = defineModel("currentPage");

const pageSize = defineModel("pageSize");

function currentPageChange(e) {
  currentPage.value = e;
}

function pageSizeChange(e) {
  pageSize.value = e;
}
</script>

<style scoped lang="less">
.s1-pagination {
  display: flex;
  align-items: center;

  padding: 24px;
}
</style>
