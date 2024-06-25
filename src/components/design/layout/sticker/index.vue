<template>
  <div class="designiy-sticker">
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
      <tags></tags>
    </div>
    <scrollbar id="sticker-list">
      <div class="list" v-infinite-scroll="getList"
        :infinite-scroll-distance="150">
        <el-row :gutter="8" style="row-gap: 1em">
          <el-col :span="24 / column" v-for="item in list" align="center">
            <div class="item">
              <desimage padding="10%" :src="item.thumbnail" class="image" @load="imgLoad($event, item)"></desimage>
              <el-popover placement="auto" trigger="click" width="auto">
                <template #reference>
                  <div class="bar">
                    <div class="title text-ellipsis">{{ item.name || "......" }}</div>
                    <badge :type="item.type"></badge>
                    <el-icon>
                      <ArrowRightBold />
                    </el-icon>
                  </div>
                </template>
                <sticker-popover :stickerInfo="item"></sticker-popover>
              </el-popover>
            </div>
          </el-col>
        </el-row>
        <div v-if="loading" v-loading="loading" v-bind="loadingOptions"  style="height:45px;"></div>
      </div>
    </scrollbar>
  </div>
</template>
<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation } from "@element-plus/icons-vue";
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
import tags from './tags.vue'
import { useLoadingOptions } from "@/components/loading/index.ts";
import scrollbar from '@/components/scrollbar/index.vue';


const loadingOptions = useLoadingOptions();



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

function imgLoad(el, info) {
  const img = el;
  initDraggableElement(img, async () => {
    const base64 = imgToBase64(img);
    currentController.value.stickToMousePosition({
      img: img,
      type: "image",
      local: false,
      src: img.src,
      base64: base64,
      id: info.id,
      info: info
    });
  });
}




const { list, getList,loading,firstLoading,subsequentLoading } = usePaging((params) => {
  return getStickerListApi({
    ...params,
    pageSize: 10,
  });
}, {
  forEach(item) {
    item.thumbnail = 'https://' + item.thumbnail
  }
});

// 列表展示几列
const column = ref(2);
</script>
<style lang="less" scoped>
@item-width: 40px;

.designiy-sticker {
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
  padding: 1em;
  row-gap: 1em;
}

.search {
  width: 100%;
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
  background-color: #efefef;
  border-radius: .2em;
  height: 12em !important;
}

.title {
  width: 100%;
  text-align: left;
}

.list{
  width: 100%;flex: 1;padding: 1em;

  // 用于显示loading
  min-height: 240px;
  min-width: 100px;
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
