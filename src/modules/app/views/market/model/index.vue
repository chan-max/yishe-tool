<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 20:59:05
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-11 21:25:15
 * @FilePath: /1s/src/modules/app/views/market/model/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="padding: 10px">
    <waterfall :columns="2" :list="list" v-slot="{ item }">
      <ion-card class="item" @click="go(item)">
        <img alt="preview" :src="item.preview_img" style="width: 100%" />
        <ion-card-header>
          <ion-card-title> title </ion-card-title>
          <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <!-- {{ item }} -->
          123213123123
        </ion-card-content>
      </ion-card>
    </waterfall>
  </div>
  <ion-modal :is-open="isOpen">
    <modal-content></modal-content>
  </ion-modal>
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
  IonModal,
} from "@ionic/vue";
import { onBeforeMount, ref, reactive, onMounted, onActivated, onDeactivated } from "vue";
import { timeago } from "@/common/time";
import { getModelList } from "@/api";
import waterfall from "@/components/layout/waterfall/index.vue";
import { onBeforeRouteLeave } from "vue-router";
import { useIonRouter, createAnimation } from "@ionic/vue";
import modalContent from "./modalContent.vue";
import { isOpen, modalInfo } from "./index.ts";

const router = useIonRouter();

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

const customAnimation = (baseEl, opts) => {
  // 右滑动画
  return createAnimation()
    .addElement(baseEl)
    .duration(100)
    .fromTo("transform", "translateX(0px)", "translateX(-300px)")
    .fromTo("opacity", "1", "0.2");
  // 淡出动画
  return createAnimation().addElement(baseEl).duration(200).fromTo("opacity", "1", "0");
};

function go(item) {
  isOpen.value = true;
  modalInfo.value = item;
}

getList();

onActivated(() => {});

onDeactivated(() => {});
</script>

<style scoped>
ion-card {
  margin: 0;
}
</style>
