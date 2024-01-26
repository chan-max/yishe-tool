<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-24 20:16:56
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-25 20:42:41
 * @FilePath: /1s/src/modules/app/views/user/setting/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="$router.back()"></ion-back-button>
        </ion-buttons>
        <ion-title>设置</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item :button="true" router-link="/home/user/updateUserInfo">
          <ion-avatar slot="start"> 
            <img
              alt="Silhouette of a person's head"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
            />
          </ion-avatar>
          <ion-label>编辑个人信息</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Mega Man X</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>The Legend of Zelda</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Pac-Man</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Super Mario World</ion-label>
        </ion-item>
        <ion-item>
          <ion-button
            @click="logout"
            style="width: 100%"
            color="danger"
            size="default"
            expand="block"
          >
            退出登录
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useIonRouter } from "@ionic/vue";
import { onMounted } from "vue";
import { IonButton, alertController } from "@ionic/vue";
import { doLogout } from "@/store/stores/loginAction";
const router = useIonRouter();

function back() {
  router.back();
}

async function logout() {
  const alert = await alertController.create({
    header: "提示",
    subHeader: "",
    message: "确认要退出登录吗",
    buttons: [
      {
        text: "取消",
        role: "cancel",
        handler: () => {
          console.log("Alert canceled");
        },
      },
      {
        text: "确认",
        role: "confirm",
        handler: () => {
          doLogout();
          router.push("/login");
        },
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped lang="less">
</style>
