<template>
  <div class="mobile-homebg">
    <div class="header w-full flex">
      <img src="/yishe2.png" style="height: 24px" />
    </div>

    <div class="banner">
      <div class="gradient-text title">
        一个免费的服装设计工具 , 为您打造独一无二的设计
      </div>
    </div>
    <!-- <s1GltfViewer :model="modelInfo"></s1GltfViewer> -->
  </div>

  <div
    v-animateonscroll="{
      enterClass: 'animate__animated animate__fadeIn',
    }"
  >
    <contactUs></contactUs>
  </div>

  <div class="mobile-icp">
    ICP备案号：<a :href="configStore.json.icp.link" target="_blank">
      {{ configStore.json.icp.text }}
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import contactUs from "./contact.vue";
import { useConfigStore } from "@/store/stores/config";

let configStore = useConfigStore();

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
  background-image: url(/image/background/cloth11.jpg);
  background-size: cover;
  height: 100vh;
  width: 100%;
}

.header {
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
  border-bottom: 6px solid rgba(255, 255, 255, 0.6);
}

.banner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30vh 4vw 10vh 4vw;
}

.title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
}

.mobile-icp {
  padding: 12px;
  font-weight: bold;
  color: #777;
  a {
    color: #333 !important;
  }
}
</style>

<style lang="less">
.gradient-text {
  background-image: linear-gradient(to right, #f00090, #861fed);
  background-clip: text;
  color: transparent;
}
</style>
