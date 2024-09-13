<template>
  <div class="container">
    <div class="menu">
      <div class="search">
        <el-input v-model="input" placeholder="寻找贴纸">
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
    <RecycleScroller class="scroll-list" v-if="list.length" :items="list" @scroll-end="scrollEnd" :item-size="140"
      :itemSecondarySize="130" :gridItems="2" item-class="scroll-list-item" key-field="id" v-slot="{ item, index }">
      <div class="item">
        <desimage padding="10%" :src="item.thumbnail" class="image" @load="imgLoad($event, item)"></desimage>
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
    <loadingBottom v-if="loading"></loadingBottom>
  </div>
</template>
<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight } from "@element-plus/icons-vue";
import { getStickerList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/image.vue";
import stickerPopover from "./stickerPopover.vue";
import {
  currentModelController,
  showImageUplaod,
} from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";
import tags from "./tags.vue";
import { useLoadingOptions } from "@/components/loading/index.tsx";
import scrollbar from "@/components/scrollbar/index.vue";
import { stickerQueryParams } from "./index.tsx";
import { loadingBottom } from "@/components/loading/index.tsx";
import Utils from '@/common/utils'

const input = ref()

// 列表展示几列
const column = ref(2);

const loadingOptions = useLoadingOptions({});

function tagChange() {
  reset();
  getList();
}


function imgLoad(el, info) {
  const img = el;
  initDraggableElement(img, async () => {
    const base64 = imgToBase64(img);
    currentModelController.value.stickToMousePosition({
      img: img,
      type: "image",
      local: false,
      src: img.src,
      base64: base64,
      id: info.id,
      info: info,
    });
  });
}

function scrollEnd() {
  getList()
}

const { list, getList, loading, reset, firstLoading, subsequentLoading } = usePaging(
  (params) => {
    return getStickerList({
      ...params,
      pageSize: 20,
      ...stickerQueryParams.value,
    });
  },
);

</script>
<style lang="less" scoped>
@item-width: 40px;

.container {
  width: 280px;
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
  width: 120px !important;
  height: 100px !important;
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
  font-size: 1rem;
  color: #666;
  display: flex;
  padding: 0 .5rem;
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

