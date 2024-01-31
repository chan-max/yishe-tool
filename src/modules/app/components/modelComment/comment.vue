<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-14 11:33:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-20 00:24:09
 * @FilePath: /1s/src/modules/app/components/modelComment/comment.vue
 * @Description:
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div class="comment">
      <ion-header>
        <ion-toolbar>
          <ion-title> 评论（99+） </ion-title>
          <ion-buttons slot="end">
            <ion-button @click="toggleSort"> {{ sortType == CommentSortType.HOTEST ? '按热度排序' : '按时间排序' }} </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list class="ion-padding">
          <comment-item v-for="(item, index) in list"
          :commentInfo="item"
          >
          </comment-item>
        </ion-list>
        <ion-infinite-scroll @ionInfinite="ionInfinite">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
      <ion-footer>
        <div class="footer ion-padding">
          <ion-avatar>
            <img class="avatar" :src="avatar">
          </ion-avatar>
          <ion-input v-model="comment" placeholder="快来评论吧"></ion-input>
          <ion-button @click="addComment" size="small" style="height:40px;">
            评论
            <ion-icon slot="end" :icon="chatbubbleEllipsesOutline"></ion-icon>
          </ion-button>
        </div>
      </ion-footer>
    </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue';
import { modelInfo,sortType,toggleSort } from "./index";
import { addModelComment,CommentSortType } from "@/api/api/comment";
import { chatbubbleEllipsesOutline } from "ionicons/icons";
import { useLoginStatusStore } from "@/store/stores/login";
import { usePaging } from "@/hooks/data/paging";
import { getModelComment } from "@/api/api/comment";
import commentItem from './commentItem.vue'


const loginStore = useLoginStatusStore();

const avatar = computed(() => {
  return loginStore.userInfo?.preview_avatar || '/mobileDefaultAvatar.svg'
})

const comment = ref();

const { page, pages, list, getList } = usePaging(() => {
  return getModelComment({
    modelId:modelInfo.value.id,
    sortType:sortType.value
  })
});

const ionInfinite = async (ev) => {
  await getList({
    modelId:  modelInfo.value.id,
  });
  ev.target.complete();
};

async function addComment() {
  if (!comment.value) {
    return;
  }
  try {
    await addModelComment({
      modelId:   modelInfo.value.id,
      content: comment.value,
      userId: loginStore.userInfo?.id,
      parentId: null,
    });
  } catch (e) {
    alert("评论失败");
  }
}

</script>

<style lang="less" scoped>
.comment {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

ion-modal {
  --height: auto;
}

ion-toolbar {
  --background: transparent;
}

ion-list {
  --background: transparent;
}

.list-ios {
  background-color: transparent;
}


ion-avatar{
  flex-shrink: 0;
  height: 30px;
  width: 30px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  column-gap: 20px;
}

.dark {
  .footer {
    border-top: 1px solid #222;
  }
}
</style>
@/hooks/data/paging