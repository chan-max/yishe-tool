<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:33:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 09:22:19
 * @FilePath: /1s/src/modules/app/views/market/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button style="--color: var(--ion-text-color)"> 更多 </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon
              style="color: var(--ion-text-color)"
              slot="icon-only"
              :icon="filterOutline"
            ></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon
              style="color: var(--ion-text-color)"
              slot="icon-only"
              :icon="searchOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>逛一逛</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <van-tabs v-model:active="active">
          <template #nav-left> </template>
          <template #nav-right> </template>
          <template #nav-bottom> </template>
          <van-tab v-for="tab,index in tabs" :title="tab" :name="index">
            <!-- 这里可以放一些具体化的分类 -->
          </van-tab>
        </van-tabs>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="content" :fullscreen="true">
      <ion-list>
        <ion-item v-for="(item, index) in list">
          <div style="width: 100%; height: 10px">{{ item }}</div>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonButtons,
  IonButton,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  createGesture,
} from "@ionic/vue";
import { getModelList } from "@/api";
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import { timeago } from "@/common/time";
import { searchOutline, filterOutline } from "ionicons/icons";

const active = ref(2);

const content = ref();

const tabs = reactive([
  "推荐",
  "最新",
  "模型",
  "图片贴纸",
  "文字贴纸",
  "艺术字体",
  "更多",
  "其他",
]);

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

<style scoped>
ion-toolbar {
  --opacity: 0.95;
}

ion-button {
  --background: transparent;
}

::v-deep .van-tabs__nav {
  background-color: transparent;
}
</style>
