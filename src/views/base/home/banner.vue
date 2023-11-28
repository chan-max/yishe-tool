<template>
  <div class="home-banner">
    <div class="home-banner-content">
        <div class="home-banner-desc">
      <div style="font-size: 46px; color: #fff; font-weight: 600">
        开放式服装设计&交易平台
      </div>
      <div style="font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 24px;padding: 20px 0;width:80%;">
        这是一个专门面向设计师和买家的全新线上平台，旨在创造一个安全、公正和透明的环境，让创新与商业交易可以无缝衔接
      </div>
      <div style="padding-top: 10px">
        <el-button
          size="large"
          type="primary"
          class="home-banner-btn"
          style="padding: 25px 30px;"
          @click="$router.push({ name: 'Design' })"
        >
          <span style="font-size: 18px;font-weight: bold;"> 试一下</span>
          <el-icon><TopRight /></el-icon> 
        </el-button>
      </div>
    </div>
    <div class="bannner-model">
      <gltf-viewer :model="modelInfo"></gltf-viewer>
    </div>
    </div>
  </div>
</template>
<script setup>
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";
import { TopRight } from "@element-plus/icons-vue";

let modelInfo = ref("");


onMounted(async () => {
  let data = await getBannerModel();
  modelInfo.value = data
});

</script>
<style lang="less">

.home-banner {
  background:#333;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 700px;
}

.home-banner-content{
    padding: 0 20px;
    display: flex;
    width: 1200px;
    justify-content: space-between;
    column-gap:20px;
}
 
.home-banner-desc {
  text-align: left;
  height: 400px;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}

.bannner-model {
  height: 400px;
  width: 50%;
}


</style>