<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-03 18:43:45
 * @FilePath: /1s/src/modules/main/view/admin/view/user/userList/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <s1Table v-bind="gridOptions">
      <template #toolbar-left> </template>
      <template #toolbar-right>
        <el-button plain @click="refresh" :icon="RefreshRight"> </el-button>
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
import { RefreshRight } from "@element-plus/icons-vue";

const { list, total, currentPage, pageSize, loading, refresh } = usePaging(
  (params) => {
    return Api.getUserList({
      ...params,
    });
  },
  {
    pageSize: 10,
    isSinglePageMode: true,
  }
);

const gridOptions = ref({
  columns: [
    { type: "seq", width: 70 },
    { field: "id", title: "用户 ID", width: 120, showOverflow: true },
    { field: "account", title: "账号", width: 120 },
    {
      field: "name",
      title: "名字",
      minWidth: 70,
    },
    {
      field: "isAdmin",
      title: "管理员",
      width: 120,
      formatter(param) {
        return param.cellValue ? '是' : '否';
      },
    },
  ],
  data: list,
  loading: loading,
});
</script>

<style></style>
