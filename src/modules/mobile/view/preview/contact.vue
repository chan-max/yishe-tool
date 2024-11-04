<template>
  <div
    class="flex w-full items-center justify-center flex-wrap flex-col"
    style="
      gap: 12px 12px;
      padding: 12px;
      box-sizing: border-box;
      width: 100vw;
      flex-wrap: wrap;
    "
  >
    <!-- <div>通过以下方式联系我们 :-)</div> -->
    <div class="flex" style="column-gap: 6px">
      <template
        v-for="item in Object.values(configStore.json.homepageContratUsLinks || {})"
      >
        <div @click="redirect(item)" class="logo-item" style="width: 24px; height: 24px">
          <s1-image :src="item.icon"></s1-image>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/stores/config";
import Utils from "@/common/utils";
import { showToast } from "vant";

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

function copyPhone() {
  navigator.clipboard.writeText("18742539196");
  showToast("联系方式已复制");
}
</script>

<style scoped lang="less">
.logo-item {
  opacity: 0.7;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
