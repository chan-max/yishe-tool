<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1 relative">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full mx-auto p-4"
      >
        <div
          v-for="item in list"
          class="flex flex-col items-center justify-start h-[240px]"
        >
          <s1-img
            padding="5%"
            :src="item.url"
            @click="itemClick(item)"
            class="w-[240px] !h-[180px] rounded-lg bg-[#f6f6f6] flex-shrink-0"
          >
            <s1-icon
              v-if="item.uploader?.isAdmin"
              name="official-badge"
              class="absolute right-[5%] top-[5%] opacity-80"
              :size="18"
            ></s1-icon>
          </s1-img>
          <div class="bar flex items-center justify-between w-full mt-2 px-2">
            <div class="text-ellipsis max-w-[80px]">
              {{ item.name || "未命名" }}
            </div>
            <div class="flex items-center gap-2">
              <div class="label-tag" v-if="item.isPublic">已共享</div>
              <div
                class="label-tag"
                v-if="item?.uploader?.account == loginStore.userInfo?.account"
              >
                我
              </div>
            </div>
            <div class="timeago">{{ Utils.time.timeago(item.updateTime) }}</div>
            <div class="flex-1"></div>

            <a-dropdown trigger="click">
              <el-button link>
                <el-icon>
                  <MoreFilled />
                </el-icon>
              </el-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="edit(item)"> 编辑 </a-menu-item>
                  <a-menu-item @click="useSticker(item)"> 在工作台使用 </a-menu-item>
                  <!-- <a-menu-item @click="editStickerInWorkspace(item)">
                                        在工作台中编辑
                                    </a-menu-item> -->
                  <a-menu-item @click="setOfficialTemplate(item)">
                    设置为样例模版
                  </a-menu-item>
                  <a-menu-item @click="deleteItem(item)">
                    <span style="color: var(--el-color-danger)">删除</span>
                  </a-menu-item>
                  <a-menu-item> 分享给好友 </a-menu-item>
                  <a-menu-item> 发布 </a-menu-item>
                  <a-menu-item v-if="item.type == 'image'" @click="download(item)">
                    下载源文件
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center"
      >
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
    <el-form
      label-width="72px"
      :inline-message="false"
      :show-message="false"
      label-position="left"
    >
      <el-form-item label="贴纸名称：">
        <el-input v-model="editForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="贴纸描述:">
        <el-input
          type="textarea"
          v-model="editForm.description"
          placeholder="描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="关键字:">
        <tagsInput
          v-model="editForm.keywords"
          :string="true"
          :autocomplete-tags="stickerAutoplacementTags"
          :autocomplete-width="400"
          autocompletePlacement="right"
        ></tagsInput>
      </el-form-item>
      <el-form-item label="模版分类:">
        <el-select v-model="editForm.group" clearable>
          <el-option
            v-for="item in officialStickerTemplateOptions"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否共享:">
        <a-switch
          v-model:checked="editForm.isPublic"
          checked-children="公开"
          un-checked-children="私密"
        />
      </el-form-item> -->
      <el-form-item label="是否为材质:">
        <el-switch
          v-model="editForm.isTexture"
        ></el-switch>
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import {
  Search,
  ArrowRightBold,
  Operation,
  ArrowRight,
  MoreFilled,
  Loading,
} from "@element-plus/icons-vue";
import { getStickerList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/image.vue";
import { MoreOutlined } from "@ant-design/icons-vue";
import { currentModelController, viewDisplayController } from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";
import { stickerAutoplacementTags } from "@/components/design/components/tagsInput/index.ts";
import { useLoadingOptions } from "@/components/loading/index.tsx";

import { loadingBottom } from "@/components/loading/index.tsx";
import { currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import Utils from "@/common/utils";
import { canvasStickerOptions } from "@/components/design/layout/canvas/index.tsx";
import { message, Modal } from "ant-design-vue";
import { s1Confirm } from "@/common/message";
import Api from "@/api";
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import { useStickerDetailModal } from "./stickerModal.ts";
import { useLoginStatusStore } from "@/store/stores/login";
import { officialStickerTemplateOptions } from "../../canvas/officialTemplateModal";

const loginStore = useLoginStatusStore();

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
    const res = await getStickerList({
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

function useSticker(item) {
  canvasStickerOptions.value = item.meta.data;
  message.success("引用成功");
}

async function deleteItem(item) {
  await s1Confirm({
    content: "确认删除该贴纸吗？",
  });

  await Api.deleteSticker({ids:[item.id]});
  reset();
  message.success("删除成功");
}

function download(item) {
  Api.downloadCOSFile(item.url);
}

const currentItem = ref({});

const showFormModal = ref(false);

const submitLoading = ref(false);
const editForm = ref({} as any);
// 编辑
function edit(item) {
  editForm.value = {
    ...item
  };
  showFormModal.value = true;
  currentItem.value = item;
}

async function ok() {
  submitLoading.value = true;
  let res = await Api.updateSticker(editForm.value);
  message.success("修改成功");
  submitLoading.value = false;
  let ind = list.value.indexOf(currentItem.value);

  // 这里可以保存关联的信息
  list.value[ind] = {
    ...currentItem.value,
    ...res,
  };
}

const { open } = useStickerDetailModal();

function itemClick(item) {
  currentItem.value = item;
  open(item);
}

/**
 * @method 设置为官方模版
 */

function setOfficialTemplate(item) {}

/**
 * @method 在工作台中编辑
 */
function editStickerInWorkspace(item) {}
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
