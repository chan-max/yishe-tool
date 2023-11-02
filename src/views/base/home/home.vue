<template>
  <home-top></home-top>
  <home-news></home-news>
  <home-header></home-header>

  
  <div class="banner">
    <div class="banner-desc">
      <div style="font-size: 36px; color: #fff; font-weight: 600">
        开放式服装设计 & 交易平台
      </div>
      <div style="font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 24px;padding-top: 20px;">
        这是一个专门面向设计师和买家的全新线上平台，旨在创造一个安全、公正和透明的环境，让创新与商业交易可以无缝衔接
      </div>
      <div style="padding-top: 10px">
        <el-button
          size="large"
          class="banner-btn"
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

  <div style="height: 5000px; width: 200px"></div>
</template>

<script setup>
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";
import { TopRight } from "@element-plus/icons-vue";
import homeTop from './top.vue'
import homeNews from './news.vue'
import homeHeader from './header.vue'


let modelInfo = ref("");


onMounted(async () => {
  let data = await getBannerModel();
  modelInfo.value = data
});



</script>

<style>

.home-top{
  height: 40px;
}

.home-news{
  
}

.home-header{
  
}

.banner {
  background:#265bec;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 2px -3px 95px 45px rgba(255, 255, 255, 0.03);
  padding: 200px 60px;
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
}

.banner-btn {
  background-color: #fff !important;
  color: var(--el-color-primary) !important;
  &:hover {
    background-color: var(--el-color-primary) !important;
    color: #fff !important;
  }
}
</style>
