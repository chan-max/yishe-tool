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
          <!-- 视频文件 -->
          <div v-if="isVideo(item.url)" class="w-[240px] !h-[180px] rounded-lg bg-[#f6f6f6] flex-shrink-0 relative">
            <video 
              class="w-full h-full object-contain"
              :src="item.url"
              controls
              controlsList="nodownload nofullscreen novolume"
            ></video>
            <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              视频
            </div>
          </div>
          <!-- 图片文件 -->
          <s1-img
            v-else
            padding="5%"
            :src="item.url"
            class="w-[240px] !h-[180px] rounded-lg bg-[#f6f6f6] flex-shrink-0"
          >
          </s1-img>
          <div class="bar flex items-center justify-between w-full mt-2 px-2">
            <div class="text-ellipsis max-w-[80px]">
              {{ item.name || "未命名" }}
            </div>
            <div class="flex-1"></div>
            <div class="timeago">{{ Utils.time.timeago(item.updateTime) }}</div>

            <a-dropdown trigger="click">
              <el-button link>
                <el-icon>
                  <MoreFilled />
                </el-icon>
              </el-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="deleteItem(item)">
                    <span style="color: var(--el-color-danger)">删除</span>
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
        <template #description> 暂无草稿 </template>
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
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { MoreFilled, Loading } from "@element-plus/icons-vue";
import { getDraftList, deleteDraft } from "@/api";
import Utils from "@/common/utils";
import { message } from "ant-design-vue";
import { s1Confirm } from "@/common/message";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const list = ref([]);
const loading = ref(false);
const isEmpty = ref(false);

// 判断是否为视频文件
function isVideo(url: string) {
  return url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mp4');
}

// 获取列表数据
async function getList() {
  loading.value = true;
  try {
    const res = await getDraftList({
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

async function deleteItem(item) {
  await s1Confirm({
    content: "确认删除该草稿吗？",
  });

  await deleteDraft({ids:[item.id]});
  reset();
  message.success("删除成功");
}
</script>

<style scoped lang="less">
.bar {
  height: 36px;
  column-gap: 1rem;
  min-height: 36px;
}

.timeago {
  font-size: 0.9rem;
  color: #999;
  font-weight: bold;
  white-space: nowrap;
}
</style> 