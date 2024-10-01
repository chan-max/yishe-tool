<template>
  <div>
    <s1Table v-bind="gridOptions">
      <template #toolbar-left> </template>
      <template #toolbar-right>
        <el-button size="small" plain @click="refresh"> 刷新 </el-button>
      </template>
    </s1Table>
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

const { list, total, currentPage, pageSize, loading, refresh } = usePaging(
  (params) => {
    return Api.getFileList({
      ...params,
    });
  },
  {
    pageSize: 10,
  }
);

const gridOptions = ref({
  columns: [
    { type: "seq", width: 70 },
    { field: "id", title: "用户 ID", width: 120, 
    showOverflow: true },
    { field: "account", title: "账号", width: 120 },
    {
      field: "name",
      title: "名字",
      minWidth: 70,
      editRender: {
        name: "VxeInput",
        props: {
          size: "mini",
        },
      },
    },
  ],
  data: list,
  loading: loading,
});
</script>

<style></style>
