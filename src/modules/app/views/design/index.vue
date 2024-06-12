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
        <div class="toolbar">
          <ion-button fill="clear" size="small" @click="showSelectModel = true">
            <van-badge>
              <ion-icon slot="icon-only" :icon="iconCloth"></ion-icon>
              <template #content>
                {{ currentOperatingBaseModelInfo ? "已选择" : "未选择" }}
              </template>
            </van-badge>
          </ion-button>

          <ion-button fill="clear" size="small" @click="showSticker = true">
            <ion-icon slot="icon-only" :icon="iconSticker"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small" @click="showWorkspace = true">
            <ion-icon slot="icon-only" :icon="iconPaper"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small" >
            <ion-icon slot="icon-only" :icon="iconText"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small">
            <ion-icon slot="icon-only" :icon="iconHistory"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small">
            <ion-icon slot="icon-only" :icon="iconSetting"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small">
            <ion-icon slot="icon-only" :icon="iconShare"></ion-icon>
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
    <select-model></select-model>
    <sticker></sticker>
    <workspace></workspace>
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
import { logOutOutline } from "ionicons/icons";
import selectModel from "./layout/selectModel/index.vue";
import sticker from "./layout/sticker/index.vue";
import workspace from './layout/workspace/index.vue';
import { showSelectModel, showSticker,showWorkspace } from "./store";
import { ModelController } from "@/components/design/core/controller";
import { meta } from "./meta";
import { useDesignStore, currentOperatingBaseModelInfo } from "@/components/design/store";
import { useIonRouter } from "@ionic/vue";
import iconCloth from "@/modules/app/assets/icon/cloth.svg?url";
import iconSticker from "@/modules/app/assets/icon/sticker.svg?url";
import iconText from "@/modules/app/assets/icon/text.svg?url";
import iconHistory from "@/modules/app/assets/icon/history.svg?url";
import iconPaper from "@/modules/app/assets/icon/paper.svg?url";
import iconSetting from "@/modules/app/assets/icon/setting.svg?url";
import iconShare from "@/modules/app/assets/icon/share.svg?url";


const designStore = useDesignStore();

const router = useIonRouter();

function quit() {
  router.push({
    name: "Workspace",
  });
}

const threeCanvasRef = ref();

onMounted(() => {
  const modelController = new ModelController();
  modelController.meta = meta;
  modelController.mode = "mb";
  modelController.render(threeCanvasRef.value);
});

onBeforeMount(async () => {});
</script>

<style scoped>
* {
  user-select: none;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-around;

  --van-badge-font-size: 10px;

  ion-button {
    --overflow: none;
  }
  ion-icon {
    font-size: 20px;
  }
}
</style>
