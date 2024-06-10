<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-06 20:06:23
 * @FilePath: /1s/src/modules/app/views/index/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-menu content-id="main-content" type="push">
      <ion-content
        class="ion-padding"
        style="--padding-top: calc(var(--ion-safe-area-top) + 20px)"
      >
        <index-side-menu></index-side-menu>
      </ion-content>
    </ion-menu>
    <ion-page id="main-content">
    
      <div class="index-tab" v-if="show">
        <van-tabs ref="tabRef" v-model:active="active" swipeable>
          <template #nav-left>
            <div class="nav-left">
                <ion-menu-toggle>
                   <div style="width:48px;height:100%"></div>
                </ion-menu-toggle>
            </div>
          </template>
          <template #nav-right>
            <div class="nav-right"></div>
          </template>
          <!-- <template #nav-bottom>
        <div class="nav-bottom"></div>
      </template> -->
          <van-tab
            v-for="tab in tabs"
            :title="tab.label"
            :name="tab.value"
            :dot="tab.dot"
          >
            <div class="tab-content">
              <div style="width: 100%; height: 100%; overflow: auto">
                <home-index v-if="tab.value == 'index'"></home-index>
                <div v-if="tab.value == 'recommend'">recommend</div>
                <div v-if="tab.value == 'market'">mine</div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <!-- <ion-header :translucent="false" class="ion-no-border">
          <ion-toolbar>
            <tabs></tabs>
            <ion-buttons slot="end">
              <index-header-dropdown></index-header-dropdown>
            </ion-buttons>
          </ion-toolbar>
          <ion-toolbar></ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <div style="height: 1000px"></div>
      </ion-content> -->
    </ion-page>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonMenu,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonMenuButton,
  IonButtons,
  IonAlert,
  IonActionSheet,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  alertController,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import indexSideMenu from "./indexSideMenu.vue";
import indexHeaderDropdown from "./indexHeaderDropdown.vue";
import { useLoginStatusStore } from "@/store/stores/login";
import homeIndex from './index/index.vue';

const loginStatusStore = useLoginStatusStore();

const show = ref(true);

const tabRef = ref();

onMounted(() => {
  setTimeout(() => {
    tabRef.value.resize();
    // show.value = true;
  }, 33);
});

const active = ref("index");
const tabs = ref([
  {
    label: "首页",
    value: "index",
    dot: false,
  },
  {
    label: "推荐",
    value: "recommend",
    dot: true,
  },
  {
    label: "商城",
    value: "market",
    dot: false,
  },
]);
</script>
<style lang="less">
@tab-width: 60px; // tab的宽度
@tab-count: 3; // tab的数量
@tab-height: 36px;
@tab-padding-bottom: 6px;
@safe-top:calc(var(--ion-safe-area-top));
@tab-total-height: calc(@tab-height + @tab-padding-bottom + @safe-top);



.index-tab {
  --van-tab-active-text-color: #fff;
  --van-tabs-bottom-bar-color: #fff;
  --van-tab-text-color: #fff;
  --van-tabs-nav-background: transparent;
  --van-tabs-line-height: @tab-total-height;
  --van-tabs-bottom-bar-width: 20px;
  width: 100vw;
  .van-tab {
    font-weight: bold;
    width: @tab-width;
    max-width: @tab-width;
  }

  .van-tabs__wrap {
    padding-top: @safe-top;
    padding-bottom: @tab-padding-bottom;
    background-color: #000;
  }

  .van-tab--active {
    // font-size:1.2em;
    .van-tab__text {
      transform: scale(1.2);
    }
  }

  .van-tabs__nav {
    position: relative;
    padding-left: calc((100vw - @tab-count * @tab-width) / 2);
    padding-right: calc((100vw - @tab-count * @tab-width) / 2);
  }

  .nav-bottom {
  }
  .nav-left {
    position: absolute;
    left: 0;
    height: 100%;
  }
  .nav-right {
    position: absolute;
    right: 0;
  }

  .tab-content {
    width: 100%;
    height: calc(100vh - @tab-total-height);
    background-color: transparent;
  }
}
</style>
