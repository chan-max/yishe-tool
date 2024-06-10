<template>
  <div style="padding: 20px">
    <div class="flex justify-between align-middle">
      <div class="flex flex-col items-center" style="row-gap: 1em">
        <cr-avatar :src="avatar" style="width: 66px; height: 66px"> </cr-avatar>
      </div>
      <div class="flex justify-center items-center" style="flex: 1;column-gap:2em;">
        <div class="user-item">
          <div>0</div>
          <div>关注</div>
        </div>
        <div class="user-item">
          <div>0</div>
          <div>粉丝</div>
        </div>
        <div class="user-item">
          <div>0</div>
          <div>积分</div>
        </div>
        <div class="user-item">
          <div>0</div>
          <div>作品</div>
        </div>
      </div>
    </div>

    <div style="padding: 10px">
      <div>{{ loginStore.userInfo?.account }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const loginStore = useLoginStatusStore();

const avatar = computed(() => {
  return loginStore.userInfo?.preview_avatar || "/mobileDefaultAvatar.svg";
});
</script>

<style scoped lang="less">
.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  font-size:.8em;

}
</style>
