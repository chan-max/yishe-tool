<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:43
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 16:38:46
 * @FilePath: /1s/src/modules/app/views/workspace/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button size="small" @click="quit">
            <ion-icon slot="end" :icon="logOutOutline"></ion-icon>
            退出
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div
        style="width: 100%; height: 100%"
        class="three-canvas"
        ref="threeCanvasRef"
      ></div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" @click="showSelectModel = true">
            <ion-icon slot="icon-only" :icon="iconCloth"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
    <select-model></select-model>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  loadingController,
} from "@ionic/vue";
import { ref, onBeforeMount, onMounted } from "vue";
import { doLogout } from "@/store/stores/loginAction";
import { playAudio } from "@/common/browser.ts";
import { logOutOutline } from "ionicons/icons";
import iconQuit from "@/modules/app/assets/icon/quit.svg?url";
import iconCloth from "@/modules/app/assets/icon/cloth.svg?url";
import selectModel from "./layout/selectModel/index.vue";
import { showSelectModel } from "./store";
import { ModelController } from "@/components/design/core/controller";
import { meta } from "./meta";
import { useIonRouter } from "@ionic/vue";

const router = useIonRouter();

function quit() {
  router.push({
    name:'Workspace'
  })
}

const threeCanvasRef = ref();

onMounted(() => {
  const modelController = new ModelController();
  modelController.meta = meta;
  modelController.mode = "mb";
  modelController.render(threeCanvasRef.value);
});

onBeforeMount(async () => {
});
</script>

<style>
*{
  user-select: none;
}
</style>
