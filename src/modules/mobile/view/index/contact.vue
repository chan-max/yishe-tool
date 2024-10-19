<template>
  <div
    style="padding: 12px; width: 100vw; box-sizing: border-box"
    class="flex flex-col items-center"
  >
    <h1 style="text-align: center" class="gradient-text">关注我们</h1>
    <div
      class="flex w-full"
      style="gap: 12px 12px; padding: 12px; flex-wrap: wrap; justify-content: center"
    >
      <template
        v-for="item in Object.values(configStore.json.homepageContratUsLinks || {})"
      >
        <div @click="redirect(item)" style="width: 48px; height: 48px">
          <s1-image class="logo" :src="item.icon"></s1-image>
        </div>
      </template>
    </div>

    <div style="padding: 24px">电话和微信 ： 18742539196</div>
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
  width: 44px;
  height: 44px;

  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
