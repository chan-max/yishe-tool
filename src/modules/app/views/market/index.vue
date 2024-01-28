<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:33:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-28 15:49:22
 * @FilePath: /1s/src/modules/app/views/market/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button>
            <ion-icon
              style="color: var(--ion-text-color)"
              slot="icon-only"
              :icon="filterOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
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
          <van-tab v-for="(tab, index) in tabs" :title="tab.title" :name="tab.name">
            <!-- 这里可以放一些具体化的分类 -->
          </van-tab>
        </van-tabs>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="content" :fullscreen="true">
      <keep-alive>
        <component :is="aliveComponent"></component>
      </keep-alive>
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
  IonIcon,
  IonButtons,
  IonButton
} from "@ionic/vue";
import { getModelList } from "@/api";
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import { timeago } from "@/common/time";
import { searchOutline, filterOutline } from "ionicons/icons";
import model from  './model/index.vue'
import recommend from  './recommend/index.vue'
import imageLayout from  './image/index.vue'
import { shallowReactive,computed } from "vue";

const active = ref('model');

const content = ref();

const aliveComponent = computed(() => {
  return tabs.find((tab) => tab.name == active.value).component
})

const tabs = shallowReactive([
  {
    name:'recommend',
    title:'推荐',
    component:recommend
  },
  {
    name:'latest',
    title:'最新',
    component:model
  },
  {
    name:'model',
    title:'模型',
    component:model
  },
  {
    name:'imageSticker',
    title:'图片贴纸',
    component:imageLayout
  },
  {
    name:'textSticker',
    title:'文字贴纸',
    component:model
  },
  {
    name:'font',
    title:'艺术字体',
    component:model
  },
  {
    name:'more',
    title:'更多',
    component:model
  },
  {
    name:'other',
    title:'其他',
    component:model
  },
]);


</script>

<style scoped>
/* ion-toolbar {
  --opacity: 0.95;
} */

ion-button {
  --background: transparent;
}

::v-deep .van-tabs__nav {
  background-color: transparent;
}
</style>
