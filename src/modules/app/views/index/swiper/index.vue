<template>
  <div style="height: 100%">
    <swiper
      style="height: 100%"
      direction="vertical"
      :modules="[Virtual]"
      :slides-per-view="1"
      virtual
    >
      <swiper-slide
        style="height: 100%"
        v-for="(item, index) in list"
        :key="index"
        :virtualIndex="index"
        >
        <div class="swiper-item ">
            {{ item }}
        </div>
        </swiper-slide
      >
    </swiper>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { usePaging } from "../../../helper/paging.ts";
import { getModelList } from "@/api/index.ts";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "@ionic/vue/css/ionic-swiper.css";

const slides = Array.from({ length: 1000 }).map((el, index) => `Slide ${index + 1}`);

/*
    该无限滑动使用轮播图模拟，由三个元素轮循模拟
    获取随机推荐列表
*/

const { list, page, getList } = usePaging(getModelList);

const showSwipe = ref(false);

// 当前正在操作的模型
const cursor = ref(0);

function dragStart(params) {
  console.log("dragStart");
}

function dragEnd(params) {
  console.log("dragEnd");
}

function change(params) {
  console.log("change");
}

onMounted(() => {
  setTimeout(() => {
    showSwipe.value = true;
  }, 2000);
});
</script>
<style lang="less" scoped>
.swiper-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
