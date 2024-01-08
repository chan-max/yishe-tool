<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 20:59:05
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-08 21:56:48
 * @FilePath: /1s/src/modules/app/views/market/model/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="model-layout-double">
    <ion-card class="item" v-for="item,index in list">
      <img alt="preview" :src="item.preview_img" />
      <ion-card-header>
        <ion-card-title> {{ index }} </ion-card-title>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        Here's a small text description for the card content. Nothing more, nothing less.
      </ion-card-content>
    </ion-card>
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
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";


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
.model-layout-double {
  width:100%;
  padding:10px;
  display:flex;
  flex-wrap:wrap;
  row-gap:5px;
  column-gap:4px;
}

.item {
  width:calc(50% - 2px);
}

ion-card {
  margin: 0;
}
</style>
