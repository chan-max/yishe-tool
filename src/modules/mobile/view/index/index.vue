<template>
  <div class="mobile-homebg w-full h-full">
    <!-- <div class="header">
      <img src="/logo.svg" style="height: 24px; width: 24px" />
      <img src="/yishe.png" style="height: 24px; width: 24px; filter: " />
    </div> -->

    <!-- <div class="banner">
      <s1GltfViewer :model="modelInfo"></s1GltfViewer>
    </div> -->

    <contactUs></contactUs>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import contactUs from "./contact.vue";

import Api from "@/api";

const modelInfo = ref();

onBeforeMount(async () => {
  let res = await Api.getCustomModelList({
    currentPage: 1,
    pageSize: 1,
    random: true,
  });
  let item = res.list[0];
  modelInfo.value = item.meta.modelInfo;
});
</script>

<style lang="less" scoped>
.mobile-homebg {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  align-items: center;
  padding: 24px;
}

.banner {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
