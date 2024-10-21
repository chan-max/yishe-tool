<template>
  <div class="banner flex flex-col items-center" ref="bannerRef">
    <div class="flex flex-col items-center" style="margin-top: 40vh">
      <div style="z-index: 3" class="title">
        开放式 <span class="animate-gradient-text"> 服装 DIY</span> 设计平台
      </div>
      <div style="z-index: 3" class="subtitle">
        功能丰富，使用简易的二维贴纸设计工具。高度定制和真实的3d模型辅助显示。各式各样的官方和社区模版，提供灵感来源
      </div>
      <div class="bar" style="z-index: 999">
        <el-button
          size="large"
          type="primary"
          round
          @click="goTool"
          class="font-bold"
          :loading="loading"
          :icon="EditPen"
        >
          {{ loading ? "正在进入" : " 在线工具" }}
        </el-button>
        <el-button
          size="large"
          plain
          round
          type="primary"
          @click="more"
          class="font-bold"
        >
          逛一逛
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { EditPen } from "@element-plus/icons-vue";

let router = useRouter();
function goTool() {
  loading.value = true;
  router.push({ name: "Design" });
}

const loading = ref(false);

function more() {
  document
    .getElementById("latest-makeup")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

const bannerRef = ref();
const bannerBgTimer = ref();
const bgUrls = ref([
  "/image/background/cloth.jpg",
  "/image/background/cloth2.jpg",
  "/image/background/cloth3.jpg",
  "/image/background/cloth4.jpg",
  "/image/background/cloth5.jpg",
  "/image/background/cloth6.jpg",
  "/image/background/cloth7.jpg",
  "/image/background/cloth8.jpg",
  "/image/background/cloth9.jpg",
]);
const loop = ref(0);

function setBg() {
  loop.value++;
  let index = loop.value % bgUrls.value.length;
  if (bannerRef.value) {
    bannerRef.value.style.backgroundImage = `url(${bgUrls.value[index]})`;
  }
}

onMounted(() => {
  setBg();
  bannerBgTimer.value = setInterval(setBg, 10000);
});
onBeforeUnmount(() => [clearInterval(bannerBgTimer.value)]);
</script>

<style scoped lang="less">
.banner {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f9;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2px);
  user-select: none;
  overflow: hidden;
  background-size: cover;
  transition: background 1s;
}

.title {
  font-size: 64px;
  font-weight: bold;
  text-align: center;
  color: #777;
}

.subtitle {
  font-size: 24px;
  text-align: center;
  color: #111;
  font-weight: 300;
}

.bar {
  padding: 20px;
}

.banner {
  position: relative;
}

.animate-gradient-text {
  background-image: linear-gradient(to right, #f00090, #861fed);
  background-size: 200%;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: animated-gradient 5s ease-in-out infinite;
}

/* Простенька Keyframe анімація */
@keyframes animated-gradient {
  0%,
  100% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}
</style>
