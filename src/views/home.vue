<template>
      <div class="banner">
        <div class="banner-left">今日最佳</div>
        <div class="banner-right">
          <gltf-viewer :data="bannerModelUrl"></gltf-viewer>
        </div>
      </div>
  <div
    style="
      text-align: center;
      margin-top: 100px;
      font-weight: bold;
      font-size: 24px;
      color: #595959;
    "
  >
    每个人都是设计师
  </div>
  <div
    style="
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
      font-size: 40px;
      color: #444;
    "
  >
    开放式服装设计 & 交易平台
  </div>
</template>

<script setup>
import gltfViewer from "@/components/modal/gltfViewer.vue";
import {onMounted,ref} from 'vue'
import { getBannerModel } from "../api";
let bannerModelUrl = ref('')

onMounted(async () => {
  let data = await getBannerModel()
  bannerModelUrl.value = data
})


</script>

<style>
.banner {
  width: 100%;
  height: 800px;
  background: linear-gradient(-45deg, #1db1e2, #00c1de);
  background-size: 600% 600%;
  animation: bgFade 5s ease infinite;
  box-shadow: inset 0px 0px 300px 50px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  padding: 0 10%;
}

.banner-left {
  font-size: 60px;
  font-weight: bold;
  width:300px;
  color: rgba(255, 255, 255, 0.7);
}

.banner-right {
  height: 800px;
  width: 800px;
}

@keyframes bgFade {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
