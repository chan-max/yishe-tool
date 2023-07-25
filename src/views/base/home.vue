<template>
  <div class="banner">
    <div class="banner-desc">
      <div style="font-size: 40px; color: #fff;">开放式服装设计 & 交易平台</div>
      <div style="font-size: 16px; color: rgba(255, 255, 255, 0.5);line-height: 30px;">
        这是一个专门面向设计师和买家的全新线上平台，旨在创造一个安全、公正和透明的环境，让创新与商业交易可以无缝衔接
      </div>
      <div style="padding-top:30px;">
        <el-button type="primary" size="large">
          <span style="font-size: 18px; font-weight: bold"> 试一下 </span>
        </el-button>
      </div>
    </div>
    <div class="bannner-model">
      <gltf-viewer :data="bannerModelUrl"></gltf-viewer>
    </div>
  </div>

  <div style="height:5000px;width:200px;"></div>

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
.banner {
  background: linear-gradient(45deg, rgba(19,22,30,1) 50%, hsl(265,100%,30%) 100%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 2px -3px 95px 45px rgba(0, 0, 0, 0.05);
  padding: 150px;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
}

.banner-desc {
  text-align: left;
  height: 400px;
  width: 700px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 0 30px;
}

.bannner-model {
  height: 400px;
  width: 700px;
  background-color: #141719;
}
</style>
