<template>
  <div>
    <s1Table v-bind="gridOptions">
      <template #toolbar-left> </template>
      <template #toolbar-right>
        <el-button plain @click="refresh" :icon="RefreshRight"> </el-button>
      </template>

      <template #thumbnailDefault="{ row }">
        <s1-image :src="row.thumbnail" style="width: 100px; height: 100px"></s1-image>
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
      title="自定义模型信息"
      @ok="handleOk"
      centered
      @close="close"
      @confirm="close"
      width="720px"
      :destroyOnClose="true"
    >
      <div style="margin: 24px 0">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="64px">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="模型名称" prop="name" required>
                <el-input v-model="form.name"></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="关键字" prop="keywords">
                <s1-tagsInput
                  v-model="form.keywords"
                  :string="true"
                ></s1-tagsInput> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="description">
                <el-input v-model="form.description" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
    return Api.getCustomModelList({
      ...params,
    });
  },
  {
    isSinglePageMode: true,
    pageSize: 10,
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
    { type: "seq", width: 60 },
    {
      field: "thumbnail",
      title: "缩略图",
      width: 120,
      slots: {
        default: "thumbnailDefault",
      },
    },
    { field: "name", title: "资源名称", width: 160, showOverflow: true },
    { field: "keywords", title: "关键字", width: 240, showOverflow: true },
    { field: "description", title: "描述", minWidth: 240 },
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

const formRef = ref();

const form = ref({
  name: "",
} as any);

const modalType = ref();

const showModal = ref(false);

function close() {
  form.value = {};
}

async function handleOk() {
  await formRef.value.validate();
  if (modalType.value == "create") {
  } else if (modalType.value == "update") {
    await Api.updateCustomModel({
      ...form.value,
    });
    refresh();
    message.success("更新成功");
  }
  showModal.value = false;
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
    content: "确认删除吗?",
    okButtonProps: {
      danger: true,
    },
  });
  await Api.deleteCustomModel({
    id: row.id,
  });
  refresh();
  message.success("删除成功");
}
</script>

<style></style>
