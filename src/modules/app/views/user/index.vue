<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:31:40
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-10 22:49:24
 * @FilePath: /1s/src/modules/app/views/user/index.vue
 * @Description: 移动端个人信息页面
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar collapse="fade">
        <ion-buttons slot="start" style="padding:10px 20px">
         账号 : {{ loginStore.userInfo?.account }}
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon size="small" slot="icon-only" :icon="timeOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon
              size="small"
              slot="icon-only"
              :icon="chatbubbleEllipsesOutline"
            ></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon size="small" slot="icon-only" :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
        <ion-avatar>
          <img
            size="small"
            alt="我的头像"
            src="/mobileDefaultAvatar.svg"
          />
        </ion-avatar>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { useLoginStatusStore } from "@/store/stores/login";
import {
  settingsOutline,
  createOutline,
  personCircle,
  search,
  chatbubbleEllipsesOutline,
  timeOutline,
} from "ionicons/icons";

const loginStore = useLoginStatusStore();

onMounted(() => {
  if (!loginStore.isLogin) {
    alert('暂未登录');
  }
});


</script>

<style scoped>
ion-button {
  --background: transparent;
}
ion-avatar{
  width:100px;
  height:100px
}
</style>
