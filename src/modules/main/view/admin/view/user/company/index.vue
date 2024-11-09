<template>
  <div>
    <s1Table v-bind="gridOptions">
      <template #toolbar-left>
        <el-button plain @click="handleCreate"> 添加公司 </el-button>
      </template>
      <template #toolbar-right>
        <el-button plain @click="refresh" :icon="RefreshRight"> </el-button>
      </template>

      <template #operationDefault="{ row }">
        <el-button link @click="handleUpdate(row)"> 修改 </el-button>
        <el-button link type="danger" @click="handleDelete(row)"> 删除 </el-button>
      </template>
    </s1Table>
    <s1Pagination
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
    >
    </s1Pagination>
    <a-modal
      v-model:open="showModal"
      title="公司信息"
      @ok="handleOk"
      centered
      @close="close"
    >
      <div style="margin: 24px 0">
        <el-form ref="formRef" :model="form" :rules="rules">
          <el-form-item label="公司名称" prop="name" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import Api from "@/api";
import { usePaging } from "@/hooks/data/paging";
import { message } from "ant-design-vue";
import { RefreshRight } from "@element-plus/icons-vue";
import { s1Confirm } from "@/common/message";
const {
  list,
  total,
  currentPage,
  pageSize,
  loading,
  refresh,
  reset,
  getList,
} = usePaging(
  (params) => {
    return Api.getCompanyList({
      ...params,
    });
  },
  {
    isSinglePageMode: true,
  }
);

const rules = ref({
  name: [
    {
      required: true,
      trigger: "change",
      message: "",
    },
  ],
});

const gridOptions = ref({
  columns: [
    { type: "seq", width: 70 },
    // { field: "id", title: "公司 ID", width: 240, showOverflow: true },
    { field: "name", title: "公司名称", width: 160, showOverflow: true },
    { field: "inviteCode", title: "邀请码", minWidth: 240 },
    { field: "createTime", title: "添加时间", width: 160 },
    {
      field: "operation",
      fixed: "right",
      width: "120",
      title: "操作",
      slots: {
        default: "operationDefault",
      },
    },
  ],
  data: list,
  loading: loading,
});

const form = ref({
  name: "",
} as any);

const modalType = ref();

const showModal = ref(false);

function close() {
  form.value = {};
}

async function handleOk() {
  if (modalType.value == "create") {
    await Api.createCompany({
      ...form.value,
    });
    reset();
    await getList();
    message.success("创建成功");
  } else if (modalType.value == "update") {
    await Api.updateCompany({
      ...form.value,
    });
    refresh();
    message.success("更新成功");
  }
  showModal.value = false;
}

async function handleCreate() {
  modalType.value = "create";
  showModal.value = true;
}

function handleUpdate(row) {
  modalType.value = "update";
  showModal.value = true;
  form.value = {
    ...row,
  };
}

async function handleDelete(row) {
  await s1Confirm({
    content: "确认删除该公司吗?",
    okButtonProps: {
      danger: true,
    },
  });
  await Api.deleteCompany({
    id: row.id,
  });
  refresh();
  message.success("删除成功");
}
</script>

<style></style>
