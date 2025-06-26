<template>
  <div class="container">
    <div class="menu">
      <div class="flex justify-between w-full ">
        <div style="flex: 1"></div>
        <el-button @click="refresh" link type="primary"> 刷新 </el-button>
      </div>
      <div class="search">
        <el-input v-model="stickerSearchQueryParams.searchText" placeholder="寻找贴纸">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
          <template #suffix>
            <el-icon>
              <Operation />
            </el-icon>
          </template>
        </el-input>
      </div>
      <tags @change="tagChange"></tags>
    </div>
    <RecycleScroller
      class="scroll-list"
      v-if="list.length"
      :items="list"
      @scroll-end="scrollEnd"
      :item-size="170"
      :itemSecondarySize="160"
      :gridItems="2"
      key-field="id"
      v-slot="{ item, index }"
    >
      <div class="item">
        <s1-image
          padding="10%"
          :src="item.url"
          class="image"
          :meta="item"
          :showSize="true"
          @load="imgLoad"
        >
        </s1-image>
        <sticker-popover :stickerInfo="item">
          <div class="bar">
            <div class="title text-ellipsis">{{ item.name || "......" }}</div>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </div>
        </sticker-popover>
      </div>
    </RecycleScroller>
    <s1-paging-bottom
      :loading="loading"
      :isEmpty="isEmpty"
      :isLastPage="isLastPage"
    ></s1-paging-bottom>
  </div>
</template>
<script setup lang="tsx">
import { ref, onBeforeMount, watch } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight } from "@element-plus/icons-vue";
import { getStickerList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/image.vue";
import stickerPopover from "./stickerPopover.vue";
import { currentModelController } from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";
import tags from "./tags.vue";
import { stickerQueryParams } from "./index.tsx";
import { loadingBottom } from "@/components/loading/index.tsx";
import Utils from "@/common/utils";
const stickerSearchQueryParams = ref({
  searchText: "",
});

// 列表展示几列
const column = ref(2);

function tagChange() {
  reset();
  getList();
}

function refresh() {
  reset();
  getList();
}

function imgLoad(el, meta) {
  const img = el;

  initDraggableElement(img, async () => {
    let info = img.meta;
    currentModelController.value.stickToMousePosition({
      img: img,
      type: "image",
      local: false,
      src: img.src,
      id: info.id,
      ...info,
    });
  });
}

function scrollEnd() {
  getList();
}

const {
  list,
  getList,
  loading,
  reset,
  firstLoading,
  subsequentLoading,
  isEmpty,
  isLastPage,
} = usePaging((params) => {
  return getStickerList({
    match: [stickerSearchQueryParams.value.searchText].filter(Boolean),
    ...params,

    pageSize: 20,
    ...stickerQueryParams.value,
  });
});

watch([() => stickerSearchQueryParams.value.searchText], () => {
  reset();
  getList();
});
</script>
<style lang="less" scoped>
@item-width: 40px;

.container {
  width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  row-gap: 10px;
}

.search {
  width: 100%;
}

.scroll-list {
  height: 100%;
  width: 100%;
  padding: 10px;
}

.item {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 0px;
  row-gap: 6px;
}

.image {
  width: 150px !important;
  height: 120px !important;
  background-color: #efefef;
  border-radius: 4px;
}

.title {
  width: 100%;
  text-align: left;
}

.list {
  width: 100%;
  flex: 1;
  padding: 1em;
  // 用于显示loading
  // min-height: 240px;
  // min-width: 100px;
}

.bar {
  width: 100%;
  font-size: 10px;
  color: #666;
  display: flex;
  padding: 0 7px;
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
<style>
.vue-recycle-scroller.direction-vertical:not(.page-mode) {
  overflow-y: overlay;
}
</style>
