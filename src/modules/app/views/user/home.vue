<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:31:40
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-25 21:17:33
 * @FilePath: /1s/src/modules/app/views/user/home.vue
 * @Description: 移动端个人信息页面
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header collapse="fade" translucent="true">
      <ion-toolbar collapse="fade">
        <ion-buttons slot="start" style="padding: 10px 20px"> </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="isDark = !isDark">
            <icon-dark-mode
              v-if="isDark"
              style="width: 26px; height: 26px"
            ></icon-dark-mode>
            <icon-light-mode v-else style="width: 26px; height: 26px"></icon-light-mode>
          </ion-button>
          <ion-button router-link="/scan">
            <icon-scan-search style="width: 26px; height: 26px"></icon-scan-search>
          </ion-button>
          <ion-button @click="goSetting">
            <icon-setting style="width: 26px; height: 26px"></icon-setting>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="flex justify-between align-middle" style="padding: 10px 5px">
        <div class="flex flex-col justify-around">
          <div v-if="loginStore.isLogin" style="font-size: 26px; font-weight: bold">
            {{ loginStore.userInfo.name || '古三通' }}
          </div>
          <div v-else style="font-size: 26px; font-weight: bold">
                登录
          </div>
          <div style="opacity: 0.7">{{ loginStore.userInfo?.account }}</div>
        </div>
        <div class="flex items-center">
          <ion-avatar style="width: 66px; height: 66px">
            <img :src="avatar" />
          </ion-avatar>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted, computed } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonRouter,
  createAnimation,
} from "@ionic/vue";
import { useLoginStatusStore } from "@/store/stores/login";
import { settingsOutline } from "ionicons/icons";
import iconSetting from "@/icon/mobile/setting.svg?vueComponent";
import iconScanSearch from "@/icon/mobile/scanSearch.svg?vueComponent";
import iconLightMode from "@/icon/mobile/lightMode.svg?vueComponent";
import iconDarkMode from "@/icon/mobile/darkMode.svg?vueComponent";
import { isDark, toggleDark } from "@/store/stores/app.ts";
const router = useIonRouter();

const loginStore = useLoginStatusStore();

const avatar = computed(() => {
  return loginStore.userInfo?.preview_avatar || "/mobileDefaultAvatar.svg";
});

function goSetting() {
  router.push({ name: "UserSetting" }, (baseEl, opts) => {
    // 右滑动画
    return createAnimation()
      .addElement(baseEl)
      .duration(100)
      .fromTo("transform", "translateX(0px)", "translateX(-300px)")
      .fromTo("opacity", "1", "0.2");
  });
}

onMounted(() => {
  if (!loginStore.isLogin) {
    alert("暂未登录");
  }
});
</script>

<style scoped>
ion-button {
  --background: transparent;
}
ion-avatar {
  width: 100px;
  height: 100px;
}
</style>
