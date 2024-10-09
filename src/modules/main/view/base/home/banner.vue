<template>
  <div class="banner flex flex-col items-center">
    <div class="flex flex-col items-center" style="margin-top: 36vh">
      <div style="z-index: 3" class="title">
        开放式 <span class="animate-gradient-text"> 服装 DIY</span> 设计平台
      </div>
      <div style="z-index: 3" class="subtitle">
        功能丰富，使用简易的二维贴纸设计工具。高度定制和真实的3d模型辅助显示。各式各样的官方和社区模版，提供灵感来源
      </div>
      <div class="bar" style="z-index: 999">
        <el-button
          size="large"
          type="primary"
          round
          @click="$router.push({ name: 'Design' })"
          class="font-bold"
        >
          在线工具
        </el-button>
        <el-button
          size="large"
          type="primary"
          plain
          round
          @click="more"
          class="font-bold"
        >
          逛一逛
        </el-button>
      </div>
    </div>

    <img
      src="/wave.svg"
      style="width: 100%; position: absolute; opacity: 0.3; bottom: -300px"
    />

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
      style="
        height: 100vh;
        width: 100vw;
        position: absolute;
        top: 10vh;
        left: 0;
        z-index: 2;
      "
    >
      <template v-slot:dm="{ index, danmu }">
        <el-image
          style="width: 120px; height: 120px; object-fit: contain"
          :src="danmu.thumbnail"
          fit="contain"
        >
        </el-image>
      </template>
    </vue-danmaku>
  </div>
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
import s1Image from "@/components/image.vue";

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

function more() {
  document
    .getElementById("latest-makeup")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}
</script>

<style scoped lang="less">
.banner {
  width: 100vw;
  height: 100vh;
  // background-color: #161616;
  background-color: #f5f5f9;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2px);
  user-select: none;
  overflow: hidden;
}

.title {
  font-size: 64px;
  font-weight: bold;
  text-align: center;
}

.subtitle {
  font-size: 24px;
  text-align: center;
  color: #6e6e73;
  font-weight: 300;
}

.bar {
  padding: 20px;
}

.banner {
  position: relative;
}

.animate-gradient-text {
  background-image: linear-gradient(to right, #f00090, #861fed);
  background-size: 200%;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: animated-gradient 5s ease-in-out infinite;
}

/* Простенька Keyframe анімація */
@keyframes animated-gradient {
  0%,
  100% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}
</style>
