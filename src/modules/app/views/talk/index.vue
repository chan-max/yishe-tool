<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-28 07:54:44
 * @FilePath: /1s/src/modules/app/views/talk/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>消息</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment class="segment" slot="start" value="all">
          <ion-segment-button value="all">
            <ion-label>最新</ion-label>
          </ion-segment-button>
          <ion-segment-button value="favorites">
            <ion-label>我的群聊</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true"> </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { LocalNotifications } from "@capacitor/local-notifications";

console.log('发送通知')
LocalNotifications.schedule({
  notifications: [
    {
      title: "标题",
      body: "具体内容",
      id: 1,
    },
  ],
});

// if(window.Notification && Notification.permission !== "denied") {
//     Notification.requestPermission(function(status) {
//         var n = new Notification('通知标题', { body: '这里是通知内容！' });
//     });
// }
</script>

<style lang="less">
ion-segment {
  background-color: transparent;
  border-radius: 0;
}

ion-segment-button::part(indicator-background) {
  background-color: transparent;
  border-bottom: 2px solid #6900ff;
  box-shadow: none;
  border-radius: 0;
}
</style>
