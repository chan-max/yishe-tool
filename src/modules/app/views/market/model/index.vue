<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 20:59:05
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-13 11:11:57
 * @FilePath: /1s/src/modules/app/views/market/model/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="padding: 10px">
    <waterfall :columns="2" :list="list" v-slot="{ item }">
        <model-card :item="item"></model-card>
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
import modelCard from './modelCard.vue';
import { isOpen, } from "./index.ts";

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


getList();

onActivated(() => {});

onDeactivated(() => {});
</script>

<style scoped>
ion-card {
  margin: 0;
}
</style>
