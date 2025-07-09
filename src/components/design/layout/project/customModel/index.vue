<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1 relative">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full mx-auto p-4">
        <div
          v-for="item in list"
          class="flex flex-col items-center justify-start h-[240px]"
        >
          <s1-image
            @click="openDetail(item)"
            padding="5%"
            :src="item.thumbnail"
            class="w-[240px] !h-[180px] rounded-lg bg-[#f6f6f6] flex-shrink-0"
          >
          </s1-image>
          <div class="bar flex items-center justify-between w-full mt-2 px-2">
            <div class="text-ellipsis max-w-[80px]">
              {{ item.name || "未命名" }}
            </div>
            <div class="flex items-center gap-2">
              <div class="label-tag" v-if="item.isPublic">已共享</div>
            </div>
            <div class="timeago">{{ Utils.time.timeago(item.updateTime) }}</div>
            <div class="flex-1"></div>
            <a-dropdown trigger="click">
              <el-button link>
                <el-icon size="12">
                  <MoreFilled />
                </el-icon>
              </el-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="workspaceEdit(item)"> 复制到工作台 </a-menu-item>
                  <a-menu-item @click="edit(item)"> 编辑 </a-menu-item>
                  <a-menu-item @click="deleteItem(item)">
                    <span style="color: var(--el-color-danger)">删除</span>
                  </a-menu-item>
                  <a-menu-item @click="downloadThumbnail(item)"> 下载缩略图 </a-menu-item>
                  <a-menu-item @click="openShareCardModal(item)">
                    生成分享卡片
                  </a-menu-item>
                  <a-menu-item @click="editInWorkspace(item)">在工作台中编辑</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
      <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
        <el-icon class="animate-spin text-2xl"><Loading /></el-icon>
      </div>
      <s1-empty v-if="isEmpty">
        <template #description> 暂无模型 </template>
      </s1-empty>
    </div>
    
    <div class="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
      <div class="mx-auto flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 40, 60, 80]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <a-modal
    v-model:open="showFormModal"
    :centered="true"
    :destroyOnClose="true"
    width="540px"
    title="更新信息"
    okText="修改"
    cancelText="取消"
    @ok="ok"
    :confirmLoading="submitLoading"
  >
    <el-form style="padding: 24px 12px">
      <el-form-item label="名称">
        <el-input v-model="editForm.name" placeholder="名字"></el-input
      ></el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editForm.description" placeholder="描述"></el-input
      ></el-form-item>
      <el-form-item label="标签">
        <tagsInput v-model="editForm.keywords" :string="true"> </tagsInput>
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight, MoreFilled, Loading } from "@element-plus/icons-vue";
import { getStickerList } from "@/api";
import desimage from "@/components/image.vue";
import { currentModelController, viewDisplayController, enterEditMode } from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";
import { useLoadingOptions } from "@/components/loading/index.tsx";
import { currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import Utils from "@/common/utils";
import Api from "@/api";
import { s1Confirm } from "@/common/message";
import { message } from "ant-design-vue";
import { useCustomModelDetailModal } from "@/components/design/layout/project/customModel/customModelModal";
import { openShareCardModal } from "@/components/design/layout/shareCard/index.ts";
import { saveAs } from "file-saver";

const { open } = useCustomModelDetailModal();

function openDetail(modelInfo) {
  open(modelInfo);
}

const loadingOptions = useLoadingOptions({});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const list = ref([]);
const loading = ref(false);
const isEmpty = ref(false);

// 获取列表数据
async function getList() {
  loading.value = true;
  try {
    const res = await Api.getCustomModelList({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    });
    list.value = res.list;
    total.value = res.total;
    isEmpty.value = list.value.length === 0;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// 处理页码改变
function handleCurrentChange(val: number) {
  currentPage.value = val;
  getList();
}

// 处理每页条数改变
function handleSizeChange(val: number) {
  pageSize.value = val;
  currentPage.value = 1;
  getList();
}

// 重置
function reset() {
  currentPage.value = 1;
  getList();
}

onBeforeMount(() => {
  getList();
});

const showDetailModal = ref();

async function deleteItem(item) {
  await s1Confirm({
    okType: "danger",
    content: "确认删除该模型？",
  });

  await Api.deleteCustomModel(item.id);
  reset();
  await getList();
  message.success("删除成功");
}

const currentItem = ref({});

const showFormModal = ref(false);

const submitLoading = ref(false);
const editForm = ref({} as any);
// 编辑
function edit(item) {
  editForm.value = {
    id: item.id,
    description: item.description,
    name: item.name,
    keywords: item.keywords,
  };
  currentItem.value = item;
  showFormModal.value = true;
}

async function ok() {
  submitLoading.value = true;
  let res = await Api.updateCustomModel(editForm.value);
  submitLoading.value = false;

  let ind = list.value.indexOf(currentItem.value);
  list.value[ind] = res;
  message.success("修改成功");
}

/**
 * 工作台编辑
 */
function workspaceEdit(item) {
  let modelInfo = item.meta.modelInfo;
  currentModelController.value.useModelInfo(modelInfo);
}

function downloadThumbnail(item) {
  saveAs(item.thumbnail);
}

function editInWorkspace(item) {
  // 进入编辑模式，并将模型信息加载到工作台
  enterEditMode(item.id, item);
  let modelInfo = item.meta.modelInfo;
  currentModelController.value.useModelInfo(modelInfo);
}
</script>

<style scoped lang="less">
.bar {
  height: 36px;
  column-gap: 1rem;
  min-height: 36px;
}

.label-tag {
  background-color: #ccc;
  color: #fff;
  border-radius: 2px;
  padding: 1px 2px;
  font-size: 0.8rem;
  font-weight: bold;
  white-space: nowrap;
}

.timeago {
  font-size: 0.9rem;
  color: #999;
  font-weight: bold;
  white-space: nowrap;
}
</style>
