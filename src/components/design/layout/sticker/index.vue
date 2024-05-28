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
      <el-row :gutter="8" style="row-gap: 1em">
        <el-col :span="24 / column" v-for="item in list" align="center">
          <div class="item">
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
        </el-col>
      </el-row>
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

// 列表展示几列
const column = ref(2);

// const imgHeight = ref(3);
// const imgWidth = ref(3);
</script>
<style lang="less" scoped>
@item-width: 40px;
.designiy-sticker {
  width: 260px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1em;
}

.search {
  width: 100%;
}

.list {
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: 1em;
}

.item {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5em;
}

.image {
  width: 100%;
  height: 10em;
}

.title {
  width: 100%;
  text-align: left;
}

.bar {
  width: 100%;
  font-size: 1em;
  color: #555;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1em;
  &:hover {
    color: #000;
    cursor: pointer;
  }

  .el-icon {
    height: 1em;
    line-height: 1em;
  }
}
</style>
