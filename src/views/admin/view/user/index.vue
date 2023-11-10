<template>
  <div class="admin-user">
    <el-table :data="list" style="width: 100%">
      <el-table-column
        header-align="center"
        align="center"
        prop=""
        label="用户头像"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="id"
        label="用户id"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="userName"
        label="用户名"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="account"
        label="账号"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="password"
        label="密码"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="email"
        label="邮箱"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="phonenumber"
        label="手机号"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="createdAt"
        label="注册时间"
        width="180"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="updatedAt"
        label="最近更新时间"
        width="180"
      />
      <el-table-column header-align="center" align="center" prop="address" label="地址" />
    </el-table>
    <el-pagination v-model:page-size="pageSize" layout="prev, pager, next" :total="total" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUserList } from "@/api";

const list = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(1);
const totalPages = ref(10);

onMounted(async () => {
  initTable()
});

async function initTable() {
  var data:any = await getUserList();
  total.value = data.total;
  list.value = data.list;
  currentPage.value = data.currentPage;
  pageSize.value = data.pageSize;
  totalPages.value = data.totalPages;
}


</script>

<style></style>
