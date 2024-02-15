<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-11 09:10:15
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 23:26:44
 * @FilePath: /yishe/src/modules/app/views/talk/chat/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
          <cr-avatar
            :src="communicationInfo.avatar"
            style="width: 40px; height: 40px; margin: 8px"
          ></cr-avatar>
          <div>
            <div style="font-size: 20px;">{{ communicationInfo.title }}</div>
            <div style="font-size: 10px;"> 最近在线 3 分钟前 </div>
          </div>
        </ion-buttons>
        <ion-buttons slot="end"> </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="messageContent" class="ion-padding">
      <ion-infinite-scroll @ionInfinite="ionInfinite" position="top">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
      <div>
        <h1 v-for="i in list">
          {{ i }}
        </h1>
      </div>
    </ion-content>
    <ion-footer>
      <div style="background: red">6666</div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { usePaging } from "@/hooks/data/paging.ts";
import crAvatar from "@/modules/app/components/avatar.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { getCommunicationMessage } from "@/api";
// 当前聊天室的信息

const messageContent = ref();

const route = useRoute();

const communicationInfo = route.query;

// 聊天记录
const communicationId = communicationInfo.communicationId;

async function ionInfinite(e) {
  await getList();
  e.target.complete();
}

const { list, getList } = usePaging((params) => {
  return getCommunicationMessage({
    communicationId: communicationId,
    ...params,
  });
});
</script>
