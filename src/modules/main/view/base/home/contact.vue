<template>
  <div class="flex flex-col items-center">
    <h1>关注我们</h1>
    <div class="flex" style="gap: 24px; flex-wrap: wrap; padding: 24px">
      <template v-for="item in configStore.json.homepageContratUsLinks">
        <div @click="redirect(item)">
          <s1-image class="logo" :src="item.icon"></s1-image>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/stores/config";
import Utils from "@/common/utils";

const configStore = useConfigStore();

function redirect(item) {
  if (Utils.isMobile) {
    if (!item.appHref) {
      return;
    }
    window.location.href = item.appHref;
  } else {
    if (!item.webHref) {
      return;
    }
    window.open(item.webHref, "_blank");
  }
}
</script>

<style scoped lang="less">
.logo {
  cursor: pointer;
  width: 64px;
  height: 64px;

  transition: all 0.2s;
  &:hover {
    transform: scale(1.2);
  }
}
</style>
