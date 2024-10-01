<template>
  <div>
    <s1Table v-bind="gridOptions"></s1Table>
    <s1Pagination
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
    >
    </s1Pagination>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import Api from "@/api";
import { usePaging } from "@/hooks/data/paging";

const { list, total, currentPage, pageSize, loading } = usePaging((params) => {
  return Api.getUserList({
    ...params,
  });
}, {});

const gridOptions = ref({
  columns: [
    { type: "seq", width: 70 },
    { field: "id", title: "用户 ID", width: 120 },
    { field: "account", title: "账号", width: 120 },
    { field: "age", title: "Age", minWidth: 70 },
  ],
  data: list,
  loading: loading,
});
</script>

<style></style>
