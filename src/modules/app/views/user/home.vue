<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:31:40
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 10:04:12
 * @FilePath: /yishe/src/modules/app/views/user/home.vue
 * @Description: 移动端个人信息页面
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header collapse="fade" translucent="true">
      <ion-toolbar collapse="fade">
        <ion-buttons slot="start"> </ion-buttons>
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
    <ion-content :fullscreen="true">
      <user-bar></user-bar>
      <div>
        <van-tabs v-model:active="active" swipeable ref="tabRef" offset-top="48">
          <van-tab v-for="tab in tabs" :title="tab.label" :name="tab.value">
            <div style="height: 1000px">内容</div>
          </van-tab>
        </van-tabs>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import crAvatar from "@/modules/app/components/avatar.vue";
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
import iconSetting from "@/icon/mobile/setting.svg?component";
import iconScanSearch from "@/icon/mobile/scanSearch.svg?component";
import iconLightMode from "@/icon/mobile/lightMode.svg?component";
import iconDarkMode from "@/icon/mobile/darkMode.svg?component";
import { isDark, toggleDark } from "@/store/stores/app.ts";
const router = useIonRouter();
import userBar from './components/userBar.vue'

const tabRef = ref();

const active = ref();

const tabs = ref([
  {
    label: "上传",
    value: "",
  },
  {
    label: "作品",
    value: "",
  },
  {
    label: "已发布",
    value: "",
  },
  {
    label: "收藏",
    value: "",
  },
  {
    label: "点赞",
    value: "",
  },
]);

onMounted(() => {
  setTimeout(() => {
    tabRef.value.resize();
  }, 33);
});

// (baseEl, opts) => {
//     // 右滑动画
//     return createAnimation()
//       .addElement(baseEl)
//       .duration(100)
//       .fromTo("transform", "translateX(0px)", "translateX(-300px)")
//       .fromTo("opacity", "1", "0.2");
//   }

function goSetting() {
  router.push({ name: "UserSetting" });
}
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
