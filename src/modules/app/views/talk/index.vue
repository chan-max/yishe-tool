<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 09:21:20
 * @FilePath: /1s/src/modules/app/views/talk/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="bell"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>消息</ion-title>

      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar style="padding-left: 12px">
        <ion-segment slot="start" value="latest">
          <ion-segment-button value="latest">
            <ion-label>最新</ion-label>
          </ion-segment-button>
          <ion-segment-button value="my">
            <ion-label>我的群聊</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list lines="none">
        <ion-list-header>
          <ion-label>消息</ion-label>
        </ion-list-header>
        <ion-item-sliding :button="true" v-for="message in messageList">
          <ion-item :button="true">
            <ion-avatar slot="start">
              <img :src="message.avatar" />
            </ion-avatar>
            <ion-label>
              <h2>{{ message.title }}</h2>
              <p>{{ message.label }}</p>
            </ion-label>
          </ion-item>
          <ion-item-options slot="end">
            <ion-item-option color="danger" expandable="true">
              <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { chevronForward, listCircle, star, trash } from "ionicons/icons";
import { messageList } from "./index";
import add from '@/icon/mobile/add.svg?url'
import bell from '@/icon/mobile/bell.svg?url'

// 刷新列表
function refresh(event) {
  setTimeout(() => {
    // Any calls to load data go here
    event.target.complete();
  }, 2000);
}

</script>
<style lang="less" scoped>
ion-button {
  --background: transparent;
}
</style>
