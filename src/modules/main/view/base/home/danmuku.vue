<template>
  <h1>丰富的设计资源</h1>
  <vue-danmaku
    ref="danmukuRef"
    :debounce="33"
    useSlot
    v-model:danmus="danmus"
    loop
    :speeds="44"
    :top="48"
    :right="48"
    isSuspend
    style="height: 100vh; width: 100vw"
  >
    <template v-slot:dm="{ index, danmu }">
      <el-image
        style="width: 120px; height: 120px; object-fit: contain"
        :src="danmu.thumbnail?.url"
        fit="contain"
      >
      </el-image>
    </template>
  </vue-danmaku>
</template>

<script setup lang="ts">
import vueDanmaku from "vue3-danmaku";
import { usePaging } from "@/hooks/data/paging.ts";
import Api from "@/api";
import Utils from "@/common/utils";
import _ from "lodash";
import { useResizeObserver } from "@vueuse/core";
import { useWindowSize, useDebounceFn } from "@vueuse/core";
import { ref, computed, watch } from "vue";

const danmus = computed(() => {
  return _.shuffle([...CustomModelList.value, ...StickerList.value]);
});

const { list: CustomModelList } = usePaging((params) => {
  return Api.getCustomModelList({
    ...params,
    pageSize: 20,
    myUploads: false,
    random: true,
  });
});

const { list: StickerList } = usePaging((params) => {
  return Api.getStickerList({
    ...params,
    pageSize: 20,
    myUploads: false,
    random: true,
  });
}, {});

const danmukuRef = ref();

const { width, height } = useWindowSize();

// 监听窗口尺寸变化
watch(
  [width, height],
  useDebounceFn(() => {
    danmukuRef.value.resize();
  })
);
</script>

<style></style>
