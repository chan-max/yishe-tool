<template>
  <div class="designiy-sticker">
    <div class="menu">
      <div
        class="flex justify-between items-center"
        style="border-bottom: 1px solid #e6e6e6"
      >
        <div style="flex: 1"></div>
      </div>
      <div class="search">
        <el-input v-model="input1" placeholder="寻找更多贴纸～" style="font-size: 12px" />
      </div>
    </div>
    <div class="list" v-infinite-scroll="getList" :infinite-scroll-distance="150">
      <div class="item" v-for="item in list">
        <desiamge :src="'http://' + item.thumbnail" class="image"></desiamge>
        <el-popover placement="auto" trigger="click" width="auto">
          <template #reference>
            <div class="bar">
              <div class="title text-ellipsis">{{ item.name || "......" }}</div>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </template>
          <sticker-popover></sticker-popover>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold } from "@element-plus/icons-vue";
import { getStickerListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desiamge from "@/components/design/components/image.vue";
import stickerPopover from "./stickerPopover.vue";

const { list, getList } = usePaging((params) =>
  getStickerListApi({
    ...params,
    pageSize: 10,
  })
);
</script>
<style lang="less" scoped>
@gap: 8px;
@item-width: 120px;
@width: @item-width * 2 + @gap * 3;
.designiy-sticker {
  width: @width;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
  height: 60px;
  width: 250px;
  display: flex;
  align-items: center;
}

.search {
  width: 100%;
}

.list {
  width: 100%;
  flex: 1;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, @item-width);
  justify-items: center;
  column-gap: 0.5em;
  row-gap: 1em;
  padding-bottom: 1em;
  justify-content: center;
}

.image {
  width: @item-width;
  height: @item-width;
}

.title {
  width: 100%;
}
.item {
  width: @item-width;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5em;
}

.bar {
  width: 100%;
  font-size: 10px;
  color: #555;
  display: flex;
  justify-content: space-between;
  column-gap: 1em;
  &:hover {
    color: #000;
    cursor: pointer;
  }

  .el-icon {
    height: 14px;
    line-height: 14px;
  }
}
</style>
