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
            <desimage padding="10%" :src="'https://' + item.thumbnail" class="image" @load="imgLoad($event,item)"></desimage>
            <el-popover placement="auto" trigger="click" width="auto">
              <template #reference>
                <div class="bar">
                  <div class="title text-ellipsis">{{ item.name || "......" }}</div>
                  <badge :type="item.type"></badge>
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
<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold } from "@element-plus/icons-vue";
import { getStickerListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";
import stickerPopover from "./stickerPopover.vue";
import {
  currentController,
  showImageUplaod,
  showDecalControl,
} from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";

import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";


/*
 徽章类型
*/
const badge = (props) => {
  return (
    <div style={{ textWrap: "nowrap" }}>
      {props.type == "image"
        ? "图片"
        : props.type == "text"
        ? "艺术字"
        : props.type == "qrcode"
        ? "二维码"
        : props.type == "barcode"
        ? "条形码"
        : props.type == "badge"
        ? "徽章"
        : props.type == "stamp"
        ? "印章"
        : "未知类型"}
    </div>
  );
};

function imgLoad(el,info){
  const img = el;
  initDraggableElement(img, async () => {
    const base64 = imgToBase64(img);
    currentController.value.stickToMousePosition({
      img: img,
      type: "image",
      local: false,
      src: img.src,
      base64: base64,
      id:info.id,
      info: info
    });
  });
}

const { list, getList } = usePaging((params) => {
  return getStickerListApi({
    ...params,
    pageSize: 10,
  });
});

// 列表展示几列
const column = ref(2);
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
  height: 10em!important;
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
