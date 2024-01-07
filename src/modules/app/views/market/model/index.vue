<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 20:59:05
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 21:33:21
 * @FilePath: /1s/src/modules/app/views/market/modelList/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-list>
    <ion-item v-for="(item, index) in list">
      <ion-card>
        <img
          alt="Silhouette of mountains"
          src="https://ionicframework.com/docs/img/demos/card-media.png"
        />
        <ion-card-header>
          <ion-card-title>Card Title</ion-card-title>
          <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          Here's a small text description for the card content. Nothing more, nothing
          less.
        </ion-card-content>
      </ion-card>
    </ion-item>
  </ion-list>
  <ion-infinite-scroll @ionInfinite="ionInfinite">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script setup>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
} from "@ionic/vue";
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import { timeago } from "@/common/time";
import { getModelList } from "@/api";

const list = reactive([]);

const ionInfinite = async (ev) => {
  await getList();
  ev.target.complete();
};

// 已经请求的页数
var page = 1;
// 总页数
var pages = Infinity;

async function getList() {
  if (page > pages) {
    return;
  }

  var res = await getModelList({
    page: page++,
    pageSize: 20,
  });
  pages = res.pages;
  for (let i in res.list) {
    list.push(res.list[i]);
  }
}

getList();
</script>

<style></style>
