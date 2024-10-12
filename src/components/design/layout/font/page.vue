<template>
  <div class="flex">
    <div
      style="width: 360px; height: 540px; padding: 1rem; row-gap: 1rem; overflow: auto"
      class="flex flex-col"
    >
      <div class="label">{{ activeFont.name }} 预览</div>
      <div
        :style="{ fontSize: previewFontSize + 'px', fontFamily: `font_${activeFont.id}` }"
        class="flex items-center justify-center"
        style="
          width: 100%;
          height: 240px;
          background: rgba(115, 0, 255, 0.05);
          overflow: hidden;
        "
      >
        <div ref="previewTextareaRef" contenteditable style="max-width: 300px">
          未选择字体
        </div>
      </div>
      <div class="label">文字预览大小</div>
      <a-slider id="test" v-model:value="previewFontSize" :max="100" :min="10" />
      <div class="label">描述</div>
      <div>{{ activeFont.description }}</div>
      <div class="label">标签</div>
      <div class="flex flex-wrap" style="gap: 1rem 0.5rem">
        <template v-for="t in activeFont.keywords?.split(',')">
          <a-tag color="default" v-if="t">{{ t }}</a-tag>
        </template>
      </div>
    </div>
    <div style="width: 720px">
      <div style="padding: 1rem" class="flex items-center justify-between">
        <div>共 {{ total }} 条</div>
        <div style="flex: 1"></div>
        <el-button size="small" link :icon="TopRight" @click="goUpload">
          去上传
        </el-button>
        <el-button size="small" link :icon="TopRight" @click="goMine">
          查看我的上传
        </el-button>
      </div>
      <s1-scrollbar height="540px">
        <div
          v-infinite-scroll="getList"
          :infinite-scroll-distance="150"
          style="padding: 1rem"
        >
          <div v-for="item in list" class="item" @click="select(item)">
            <div class="item-title flex items-center justify-between">
              <span style="font-size: 1.5rem; color: #666"> {{ item.name }}</span>
              <span style="font-size: 1.2rem; color: #999"> {{ item.createTime }} </span>
              <div style="flex: 1"></div>
            </div>
            <s1-image
              :src="item.thumbnail?.url"
              fit="contain"
              style="width: auto; height: 48px"
            ></s1-image>
          </div>

          <s1-loadingBottom v-if="loading"></s1-loadingBottom>
        </div>
      </s1-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getFontListApi } from "@/api";
import {
  operatingTextStickerOptions,
  showFontModal,
  showUpload,
  viewDisplayController,
} from "../../store";
import { usePaging } from "@/hooks/data/paging";
import Utils from "@/common/utils";
import { Paperclip, TopRight } from "@element-plus/icons-vue";

import { fetchFontFaceWithMessage } from "@/components/design/layout/canvas/operate/fontFamily/index.ts";

// 字体列表
const { list, getList, reset, loading, total } = usePaging((params) => {
  return getFontListApi({
    ...params,
    pageSize: 30,
  });
});

const activeFont = ref({} as any);

const previewFontSize = ref(36);

const previewTextareaRef = ref();

async function select(item) {
  activeFont.value = item;
  await fetchFontFaceWithMessage(item);
  previewTextareaRef.value.innerHTML = item.name;
}

function goUpload() {
  showFontModal.value = false;
  showUpload.value = true;
}

function goMine() {
  showFontModal.value = false;
  viewDisplayController.value.showProject = true;
}
</script>

<style lang="less" scoped>
.item {
  cursor: pointer;
  padding: 2rem;
  border-bottom: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  &:hover {
    background-color: #eee;
  }
}

.item-title {
  column-gap: 2rem;
}

.label {
  font-size: 1.2rem;
}
</style>
