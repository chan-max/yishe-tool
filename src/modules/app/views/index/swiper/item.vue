<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-18 19:22:11
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 22:48:42
 * @FilePath: /1s/src/modules/app/views/index/swiper/item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="item">
    <Transition leave-active-class="animate__animated animate__fadeOut" :duration="200">
      <div class="image" v-if="showImage">
        <van-image style="width: 100%; height: 100%" fit="cover" :src="modelInfo.preview_img">
          <template v-slot:loading>
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </template>
        </van-image>
      </div>
    </Transition>

    <div class="viewer" v-if="showViewer">
      <gltf-viewer ref="gltfViewerRef" :model="modelInfo.modelInfo" @beforeLoad="beforeLoad" @loaded="loaded"></gltf-viewer>
    </div>

    <div class="menu-right">
      <div class="menu-item">
        <heart class="icon" @click="isLike = !isLike" :style="{ color: isLike ? '#ea3323' : '' }"></heart>
        <div class="text">69</div>
      </div>
      <div class="menu-item">
        <comment @click="$emit('openComment')" class="icon"></comment>
        <div class="text">69</div>
      </div>
      <div class="menu-item">
        <share class="icon"></share>
        <div class="text">69</div>
      </div>
      <div class="menu-item">
        <shopping-cart class="icon"></shopping-cart>
        <div class="text">69</div>
      </div>
    </div>

    <div class="menu-bottom"></div>
    <div class="menu-top">
      <ion-avatar style="width: 32px; height: 32px;" class="avatar-border">
        <img :src="modelInfo.t_user.preview_avatar" style="width: 32px; height: 32px;" />
      </ion-avatar>
      <div>
        <div style="font-size: 12px; font-weight: bold; line-height: 20px">
          {{ modelInfo.t_user.name || "无名氏" }}
        </div>
        <div style="font-size: 12px; font-weight: 300">
          创建于 {{ timeago(modelInfo.createdAt) }}
        </div>
      </div>
      <div style="flex: 1"></div>
      <div style="font-size: 12px">查看更多细节</div>
    </div>

    <div v-if="loading" class="progress">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted, watch, onUnmounted } from "vue";
import { activeIndex, activeIndexChange, gltfViewerRef } from "./index.ts";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import heart from "@/icon/mobile/heart.svg?vueComponent";
import comment from "@/icon/mobile/comment.svg?vueComponent";
import share from "@/icon/mobile/share.svg?vueComponent";
import shoppingCart from "@/icon/mobile/shoppingCart.svg?vueComponent";
import { likeModel } from "@/api";
import { timeago } from "@/common/time";

const isLike = ref(false);

const props = defineProps(["modelInfo", "index"]);


// 点赞收藏模型
watch(isLike, async () => {
  await likeModel({
    modelId: props.modelInfo.id,
    isLike: isLike.value,
  });
});

// 是否展示图片
const showImage = ref(true);

// 是否展示模型预览
const showViewer = ref(false);

const loading = ref(true);

watch(
  activeIndex,
  () => {
    if (activeIndex.value != props.index) {
      return;
    }
    setTimeout(() => {
      showViewer.value = true;
    }, 1000);
  },
  { immediate: true }
);

function beforeLoad() {
  loading.value = true;
}

function loaded() {
  showImage.value = false;
  loading.value = false;
}
</script>
<style lang="less" scoped>
.item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}

::v-deep {
  .image img {
    width: 100%;
    height: 100%;
  }
}

.viewer {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  // background: #333;
}

.menu-bottom {
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 0;
  z-index: 2;
  align-items: center;
}

.progress {
  position: absolute;
  bottom: 0;
  z-index: 13;
  width: 100%;
}

ion-progress-bar {
  --background: rgba(0, 0, 0, 0);
  --progress-background: rgba(105, 0, 255, 0.5);
}

.menu-right {
  width: 60px;
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  justify-content: end;
  padding: 20px 0;
  z-index: 2;
}

.menu-item {
  color: #fff;
}

.icon {
  width: 30px;
  height: 30px;
  transition: all 0.3s;
  /* 为图标增加阴影效果 */
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.2));
  &:active {
    transform: scale(0.8);
  }
}

.text {
  font-size: 12px;
  text-shadow:  0px 1px 5px rgba(0, 0, 0, 0.5);
}

.menu-top {
  position: absolute;
  width: 100%;
  height: auto;
  top: 0;
  text-align: left;
  display: flex;
  align-items: center;
  column-gap: 12px;
  padding: 10px;
  z-index:2;
}


.avatar-border {
  border-radius: 50%;
  position: relative;
  background-clip: padding-box; /*important*/
}

.avatar-border::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
  margin: 1px; /* 为负值时可显示边框 */
  border-radius: inherit; /*important*/
  background: linear-gradient(to right, #6900ff, purple);
}
</style>
