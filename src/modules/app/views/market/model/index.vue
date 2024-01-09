<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 20:59:05
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-09 20:39:02
 * @FilePath: /1s/src/modules/app/views/market/model/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="padding:10px;">
    <waterfall :columns="2" :list="list" v-slot="{item}">
    <ion-card class="item">
      <img alt="preview" :src="item.preview_img" style="width:100%;" />
      <ion-card-header>
        <ion-card-title> title </ion-card-title>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        Here's a small text description for the card content. Nothing more, nothing less.
      </ion-card-content>
    </ion-card>
  </waterfall>
  </div>
  <ion-infinite-scroll @ionInfinite="ionInfinite">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script setup lang="ts">
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
import waterfall from "@/components/layout/waterfall/index.vue";


type DisplayMode = "single" | "double";

const list = ref([]);

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
  list.value = list.value.concat(res.list);
}

getList();
</script>

<style scoped>


ion-card {
  margin: 0;
}
</style>
