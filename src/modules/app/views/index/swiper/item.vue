<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-18 19:22:11
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 23:40:48
 * @FilePath: /yishe/src/modules/app/views/index/swiper/item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="item">
    <Transition leave-active-class="animate__animated animate__fadeOut" :duration="200">
      <div class="image" v-if="showImage">
        <cr-image :src="availableModelInfo.t_model.preview_img"></cr-image>
      </div>
    </Transition>

    <div class="viewer" :class="isDark ? 'viewer-background-dark' : 'viewer-background'" v-if="showViewer">
      <drag-to-move v-if="showMovableTip"></drag-to-move>
      <gltf-viewer @beforeLoad="beforeLoad" @loaded="loaded" @dragStart="dragStart" ref="gltfViewerRef"
        :model="availableModelInfo.t_model.modelInfo">
      </gltf-viewer>
    </div>

    <div class="menu-top">
      <cr-avatar style="width: 36px; height: 36px;border:1.2px solid #fff;"
        :src="availableModelInfo.t_user.preview_avatar" class="avatar-border">
      </cr-avatar>
      <div>
        <div style="font-size: 14px; font-weight: bold; line-height: 20px">
          {{ availableModelInfo.t_user.name || "小芳" }}
        </div>
        <div style="font-size: 12px; font-weight: 300">
          发布于 {{ timeago(availableModelInfo.t_model.createdAt) }}
        </div>
      </div>

      <div style="flex: 1"></div>
      <div class="follow-button">
        <div v-if="availableModelInfo.relationship == RelationshipType.MYSELF">
          我自己
        </div>
        <div @click="execUnfollow" v-if="availableModelInfo.relationship == RelationshipType.FOLLOWING">
          关注中，取消关注
        </div>
        <div @click="execFollow" v-if="availableModelInfo.relationship == RelationshipType.FOLLOWED">
          我的粉丝，回关
        </div>
        <div @click="execUnfollow" v-if="availableModelInfo.relationship == RelationshipType.FRIEND">
          我的好友
        </div>
        <div @click="execFollow" v-if="availableModelInfo.relationship == RelationshipType.STRANGER">
          陌生人，点个关注
        </div>
      </div>
    </div>

    <div class="menu-right">
      <div style="flex:1"></div>
      <div class="menu-item">
        <heart class="icon" @click="availableModelInfo.liked = !availableModelInfo.liked"
          :style="{ color: availableModelInfo.liked ? '#ea3323' : '' }"></heart>
        <div class="text">{{ availableModelInfo.like_count }}</div>
      </div>
      <div class="menu-item">
        <icon-comment @click="showComment = true" class="icon"></icon-comment>
        <div class="text">{{ availableModelInfo.comment_count }}</div>
      </div>
      <div class="menu-item">
        <share @click="showShare = true" class="icon"></share>
        <div class="text"></div>
      </div>
      <div class="menu-item">
        <shopping-cart class="icon"></shopping-cart>
        <div class="text"></div>
      </div>
    </div>

    <div class="menu-bottom">
      <!-- <ion-button expand="block">
          购买
      </ion-button> -->
    </div>

    <div v-if="loading" class="progress">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </div>
  </div>
  
  <ion-modal class="modal-comment" :is-open="showComment" :initial-breakpoint="1" :breakpoints="[0, 1]"
    @didDismiss="showComment = false">
    <comment :available-model-info="availableModelInfo"></comment>
  </ion-modal>
  <ion-modal class="modal-share" :is-open="showShare" :initial-breakpoint="1" :breakpoints="[0, 1]"
    @didDismiss="showShare = false">
    <share-modal :available-model-info="availableModelInfo"></share-modal>
  </ion-modal>
</template>
<script setup>
import { defineProps, ref, onMounted, watch, onUnmounted } from "vue";
import { activeIndex, activeIndexChange, gltfViewerRef } from "./index.ts";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import heart from "@/icon/mobile/heart.svg?component";
import iconComment from "@/icon/mobile/comment.svg?component";
import share from "@/icon/mobile/share.svg?component";
import shoppingCart from "@/icon/mobile/shoppingCart.svg?component";
import { likeModel, likeAvailableModel } from "@/api";
import { timeago } from "@/common/time";
import dragToMove from "@/components/tips/dragToMove/index.vue";
import { showMovableTip } from "@/store/stores/app.ts";
import comment from './modelComment/index.vue'
import { impact } from '../../../helper/device.ts';
import { isDark } from "@/store/stores/app.ts";
import crImage from '@/modules/app/components/image.vue'
import crAvatar from '@/modules/app/components/avatar.vue'
import shareModal from './share/index.vue'
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { RelationshipType } from "@/types/user.ts";


const props = defineProps(["availableModelInfo", "index"]);



// 打开评论
const showComment = ref(false)

const showShare = ref(false)

// 点赞收藏模型
watch(
  () => props.availableModelInfo.liked,
  async () => {
    impact()
    await likeAvailableModel({
      availableModelId: props.availableModelInfo.id,
      liked: props.availableModelInfo.liked,
    });
    // 更新状态
    if (props.availableModelInfo.liked) {
      props.availableModelInfo.like_count++;
      props.availableModelInfo.liked = true;
    } else {
      props.availableModelInfo.like_count--;
      props.availableModelInfo.liked = false;
    }
  }
);

// 是否展示图片
const showImage = ref(true);

// 是否展示模型预览
const showViewer = ref(false);

const loading = ref(true);

function dragStart() {
  showMovableTip.value = false;
}

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

/* 模型完全加载完成 */
function loaded() {
  // 隐藏缩略图
  showImage.value = false;
  // 移除loading
  loading.value = false;
}


import { follow, unfollow } from '@/api'

/*
   关注
*/
async function execFollow() {
  let relationship = await follow({
    userId: props.availableModelInfo.t_user.id
  })
  props.availableModelInfo.relationship = relationship
}

/*
   取消关注
*/
async function execUnfollow() {
  let relationship = await unfollow({
    userId: props.availableModelInfo.t_user.id
  })
  props.availableModelInfo.relationship = relationship
}

</script>
<style>
/* 用于设置固定高度的评论弹层 */
ion-modal {
  --height: auto;
}
</style>
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
  display: flex;
  align-items: center;
  justify-content: center;
  // background: #333;
}

.viewer-background {
  background: radial-gradient(circle, rgba(233, 233, 233, 1) 50%, rgba(255, 255, 255, 1) 100%);
}

.viewer-background-dark {
  background: radial-gradient(circle, rgba(20, 20, 20, 1) 50%, rgba(0, 0, 0, 1) 100%);
}

.menu-bottom {
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 0;
  z-index: 2;
  align-items: center;
  padding: 4px;
}

.progress {
  position: absolute;
  bottom: 0;
  z-index: 13;
  width: 100%;
}

ion-progress-bar {
  --background: rgba(0, 0, 0, 0);
  --progress-background: rgba(105, 0, 255, 0.3);
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
  justify-content: space-between;
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
  font-weight: bold;
  text-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
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
  z-index: 3;
}

.avatar-border {
  border-radius: 50%;
  position: relative;
  background-clip: padding-box;
  /*important*/
}

.avatar-border::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
  margin: 1px;
  /* 为负值时可显示边框 */
  border-radius: inherit;
  /*important*/
  background: linear-gradient(to right, #6900ff, purple);
}

.follow-button {
  font-size: 14px;
  font-weight: bold;
  background: transparent;
  padding: 10px;
  border-radius: 6px;
}
</style>