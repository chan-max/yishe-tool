<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-11-28 01:16:00
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-13 15:53:45
 * @FilePath: /1s/src/modules/app/views/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <!-- <floating-button></floating-button> -->
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <div class="app-footer">
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="tab1" href="/home/index">
            <icon-home-filled class="icon"></icon-home-filled>
            <ion-label class="label">首页</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab2" href="/home/market">
            <icon-market-filled class="icon"></icon-market-filled>
            <ion-label class="label">逛一逛</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab3" href="/home/workspace">
            <icon-workspace-filled class="icon"></icon-workspace-filled>
            <ion-label class="label">工作台</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab4" href="/home/talk">
            <icon-talk-filled class="icon"></icon-talk-filled>
            <ion-label class="label">消息</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tab5" href="/home/user">
            <icon-user-filled v-if="!loginStore.isLogin" class="icon"></icon-user-filled>
            <ion-avatar class="icon" v-else style="border: 1px solid rgba(105,0,255,1);">
              <img :src="loginStore.userInfo?.preview_avatar" >
            </ion-avatar>
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
} from "@ionic/vue";
import iconHomeFilled from "@/icon/mobile/footer/home-filled.svg?vueComponent";
import iconMarketFilled from "@/icon/mobile/footer/market-filled.svg?vueComponent";
import iconWorkspaceFilled from "@/icon/mobile/footer/workspace-filled.svg?vueComponent";
import iconTalkFilled from "@/icon/mobile/footer/talk-filled.svg?vueComponent";
import iconUserFilled from "@/icon/mobile/footer/user-filled.svg?vueComponent";
import floatingButton from '../components/floatingButton.vue'
import { useLoginStatusStore } from '@/store/stores/login';

const loginStore = useLoginStatusStore()

</script>

<style scoped lang="less">
.icon {
  width: 24px;
  height: 24px;
  margin: 4px;

}



.label {
  font-size: 9px;
}

.tab-selected {
  .icon {
    transform: scale(1.2);
  }
}

.app-footer {
  z-index: 10;
  display: block;
  width: 100%;
}
</style>
