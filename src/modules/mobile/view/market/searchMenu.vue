<template>
  <div class="mobile-market-search-menu">
    <div class="flex justify-between items-center">
      <div class="title">搜索历史</div>

      <van-icon name="delete" color="#333" size="16" @click="deleteSearchRecord" />
    </div>
    <template v-if="localSearchRecords.length">
      <div class="flex flex-wrap" style="gap: 8px 12px">
        <van-tag
          v-for="item in localSearchRecords"
          size="medium"
          round
          class="search-tag"
          @click="selectTag(item.label)"
          type="primary"
          color="#f7f7f7"
          >{{ item.label }}</van-tag
        >
      </div>
    </template>
    <template v-else>
      <div style="color: #999" class="text-center">暂无记录</div>
    </template>

    <div class="flex justify-between items-center">
      <div class="title">热搜</div>
    </div>
    <div class="flex flex-wrap" style="gap: 8px 12px">
      <van-tag
        v-for="item in hotSearchOptions"
        size="medium"
        round
        class="search-tag"
        type="primary"
        color="#f7f7f7"
        @click="selectTag(item.label)"
        >{{ item.label }}

        <div
          v-if="item.suffix"
          :style="{ background: item.suffixColor }"
          style="
            color: #fff;
            font-weight: 900;
            font-size: 8px;
            height: 12px;
            line-height: 12px;
            padding: 2px 4px;
            border-radius: 4px;
            margin-left: 6px;
          "
        >
          {{ item.suffix }}
        </div>
      </van-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  localSearchRecords,
  hotSearchOptions,
  searchText,
  showSearchMenu,
} from "./index.tsx";
import { showConfirmDialog } from "vant";

const emits = defineEmits(["select"]);

async function deleteSearchRecord() {
  await showConfirmDialog({
    title: "提示",
    message: "确认要清空搜索历史吗",
    theme: "round-button",
    cancelButtonColor: "#ddd",
  });
  localSearchRecords.value = [];
}

function selectTag(tag) {
  emits("select", tag);
}
</script>

<style scoped lang="less">
.mobile-market-search-menu {
  padding: 0 5vw;
}

.title {
  font-size: 16px;
  padding: 24px 0;
}

.search-tag {
  color: #555;
  padding: 8px 12px;
}
</style>
