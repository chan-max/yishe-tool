<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-11-28 01:16:00
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 09:29:19
 * @FilePath: /1s/src/modules/app/views/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <!-- <floating-button></floating-button> -->
    <ion-tabs>
      <ion-router-outlet> </ion-router-outlet>
      <div class="app-footer">
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="tab1" href="/home/index">
            <ion-icon class="icon" :src="iconHomeFilled"></ion-icon>
            <ion-label class="label">首页</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab2" href="/home/market">
            <ion-icon class="icon" :src="iconMarketFilled"></ion-icon>
            <ion-label class="label">逛一逛</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab3" href="/home/workspace">
            <ion-icon class="icon" :src="iconWorkspaceFilled"></ion-icon>
            <ion-label class="label">工作台</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab4" href="/home/talk">
            <ion-badge color="danger">44</ion-badge>
            <ion-icon class="icon" :src="iconTalkFilled"></ion-icon>
            <ion-label class="label">消息</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab5" href="/home/user">
            <avatar
              v-if="loginStore.isLogin && loginStore.userInfo.preview_avatar"
              class="avatar"
              :src="loginStore.userInfo?.preview_avatar"
              style="border: 1px solid rgba(105, 0, 255, 1)"
            >
            </avatar>
            <ion-icon v-else class="icon" :src="iconUserFilled"></ion-icon>
            <ion-label class="label">我的衣设</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </div>
    </ion-tabs>
  </ion-page>
</template>
<script setup>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  useIonRouter
} from "@ionic/vue";
import iconHomeFilled from "@/icon/mobile/footer/home-filled.svg?url";
import iconMarketFilled from "@/icon/mobile/footer/market-filled.svg?url";
import iconWorkspaceFilled from "@/icon/mobile/footer/workspace-filled.svg?url";
import iconTalkFilled from "@/icon/mobile/footer/talk-filled.svg?url";
import iconUserFilled from "@/icon/mobile/footer/user-filled.svg?url";
import avatar from "@/modules/app/components/avatar.vue";
import {isDark} from '@/store/stores/app'
import { useLoginStatusStore } from "@/store/stores/login";
import { onBeforeMount } from "vue";


const router = useIonRouter();
const loginStore = useLoginStatusStore();
</script>

<style scoped lang="less">

ion-tab-bar{
  background-color: rgba(255,255,255,.7);
}
ion-tab-button{
  background-color: transparent;
}
.avatar {
  width: 24px;
  height: 24px;
  margin: 4px;
}

.label {
  font-size: 9px;
}

.icon {
  width: 24px;
  height: 24px;
}

.tab-selected {
  .icon,
  .avatar {
    transform: scale(1.2);
  }
}

.app-footer {
  z-index: 10;
  display: block;
  width: 100%;
}
</style>
