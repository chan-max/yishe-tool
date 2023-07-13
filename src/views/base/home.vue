<template>
  <div style="text-align: center; font-weight: bold; font-size: 72px; color: #333;font-family: Fira Sans,sans-serif;margin-top:120px;letter-spacing: -.03em;">
    开放式服装设计&交易平台
  </div>
  <div style="text-align: center; font-size: 20px; color: #595959;padding:20px 50px 50px 20px;max-width:1200px;">
    "创新设计，无限可能 - 您的一站式服装设计和交易平台。从服装设计概念的构思，到设计整合，最后的交易销售，我们的平台提供完整的解决方案。让我们一起打破传统，通过在线平台实现设计的创新，交易的便利，让时尚更加触手可及。"
  </div>
  <el-button type="primary" size="large" color="#333" @click="$router.push({name:'Design'})">开始创作</el-button>
    <div class="bannner-model">
      <gltf-viewer :data="bannerModelUrl"></gltf-viewer>
    </div>
</template>

<script setup>
import gltfViewer from "@/components/modal/gltfViewer.vue";
import { onMounted, ref } from "vue";
import { getBannerModel } from "../../api";
let bannerModelUrl = ref("");

onMounted(async () => {
  let data = await getBannerModel();
  bannerModelUrl.value = data.data;
});
</script>

<style>


.bannner-model {
  height: 600px;
  width: 1000px;
  margin-top: 50px;
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
