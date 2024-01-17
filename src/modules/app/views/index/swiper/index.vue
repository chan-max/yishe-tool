<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-17 22:21:34
 * @FilePath: /1s/src/modules/app/views/index/swiper/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="height: 100%">
    <swiper
      style="height: 100%; width: 100%"
      direction="vertical"
      :modules="[Virtual]"
      :slides-per-view="1"
      virtual
      @reachEnd="reachEnd"
    >
      <swiper-slide
        style="height: 100%; width: 100%"
        v-for="(item, index) in list"
        :key="index"
        :virtualIndex="index"
      >
        <div class="swiper-item">
          <div class="viewer">
            <van-image
              style="width: 100%; height: 100%"
              fit="cover"
              :src="item.preview_img"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
          <div class="menu">
            {{ item }}
          </div>
        </div>
      </swiper-slide>
    </swiper>
    import { log } from "console";
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

/*
    该无限滑动使用轮播图模拟，由三个元素轮循模拟
    获取随机推荐列表
*/

const { list, page, getList } = usePaging(getModelList);

// 当前正在操作的模型
const cursor = ref(0);

// 滑动到最新
function reachEnd() {
  getList();
}
</script>
<style lang="less" scoped>
.swiper-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewer {
  flex: 1;
  height:calc(100% - 50px);
}

::v-deep {
  .viewer img {
    width: 100%;
    height: 100%;
  }
}

.menu {
  width: 100%;
  height: 50px;
}
</style>
