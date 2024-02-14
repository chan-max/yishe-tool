<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:06
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 00:07:55
 * @FilePath: /yishe/src/modules/app/views/talk/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" id="open-action-sheet">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
          <ion-action-sheet trigger="open-action-sheet" header="聊点什么" :buttons="actionSheetButtons"></ion-action-sheet>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="bell"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ isOnline ? "消息" : "断线" }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
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
        <ion-item-sliding :button="true" v-for="item in list">
          <ion-item :button="true" @click="toChat(item)">
            <avatar slot="start" style="width: 40px; height: 40px" :src="item.avatar">
            </avatar>
            <ion-label>
              <h2>{{ item.title }}</h2>
              <p>{{ item.label }}</p>
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
import { messageList, createMessageItem } from "./index";
import add from "@/icon/mobile/add.svg?url";
import bell from "@/icon/mobile/bell.svg?url";
import { isOnline } from "@/modules/app/helper/store";
import { useIonRouter } from "@ionic/vue";
import avatar from "@/modules/app/components/avatar.vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { getMyCommunicationList } from "@/api";

const router = useIonRouter();
// 去聊天页面
function toChat(message) {
  router.push({
    name: "Chat",
    query: message,
  });
}

const actionSheetButtons = [
  {
    text: "创建群聊",
  },
  {
    text: "加入群聊",
  },
  {
    text: "添加聊天",
  },
  {
    text: "返回",
    role: "cancel",
    data: {
      action: "cancel",
    },
  },
];

const { list } = usePaging(getMyCommunicationList, {
  initialList: messageList,
});

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
