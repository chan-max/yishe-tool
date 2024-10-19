<template>
  <div class="mobile-homebg">
    <div class="header w-full flex justify-between">
      <img src="/yishe2.png" style="height: 36px" />

      <van-button
        v-if="!loginStore.isLogin"
        color="linear-gradient(to right, #f00090, #6900ff)"
        round
        @click="login"
      >
        <van-swipe
          vertical
          style="height: 40px; line-height: 40px"
          :autoplay="6000"
          :touchable="false"
          :show-indicators="false"
        >
          <van-swipe-item>快速登录</van-swipe-item>
          <van-swipe-item>免费设计</van-swipe-item>
          <van-swipe-item>一键定制</van-swipe-item>
        </van-swipe>
      </van-button>
    </div>

    <div
      class="banner flex flex-col"
      style="row-gap: 2vh"
      v-animateonscroll="{
        enterClass: 'animate__animated animate__fadeIn',
      }"
    >
      <div class="gradient-text title">一个免费的服装设计工具 , 打造独一无二的设计</div>
      <van-button
        style="background: transparent"
        color="#fff"
        size="large"
        plain
        round
        @click="goModelPreview"
        >随便逛逛</van-button
      >
      <van-button
        style="background: transparent"
        color="#fff"
        size="large"
        plain
        round
        @click="goAbout"
        >了解更多</van-button
      >
      <van-button
        style="background: transparent"
        color="#fff"
        size="large"
        plain
        round
        @click="goContact"
        >联系我们</van-button
      >
    </div>
    <!-- <s1GltfViewer :model="modelInfo"></s1GltfViewer> -->
  </div>

  <div ref="aboutRef">
    <about></about>
  </div>

  <hr style="border: 1px solid #eee" class="w-full" />

  <div
    v-animateonscroll.once="{
      enterClass: 'animate__animated animate__zoomIn',
    }"
    ref="modelPreviewRef"
  >
    <modelPreview></modelPreview>
  </div>

  <div
    v-animateonscroll.once="{
      enterClass: 'animate__animated animate__zoomIn',
    }"
  >
    <productPreview></productPreview>
  </div>

  <div
    v-animateonscroll.once="{
      enterClass: 'animate__animated animate__zoomIn',
    }"
  >
    <stickerPreview></stickerPreview>
  </div>

  <div
    ref="contactRef"
    class="animate__slow"
    v-animateonscroll="{
      enterClass: 'animate__animated animate__fadeIn ',
    }"
  >
    <contactUs></contactUs>
  </div>

  <div style="padding: 24px">
    <van-button
      color="linear-gradient(to right, #f00090, #6900ff)"
      round
      icon="share-o"
      icon-position="right"
      @click="startShare"
    >
      分享该页面
    </van-button>
  </div>

  <div class="mobile-icp">
    ICP备案号：<a :href="configStore.json?.icp?.link" target="_blank">
      {{ configStore.json?.icp?.text }}
    </a>
  </div>

  <van-back-top />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import contactUs from "./contact.vue";
import { useConfigStore } from "@/store/stores/config";
import stickerPreview from "./stickerPreview.vue";
import modelPreview from "./modelPreview.vue";
import productPreview from "./productPreview.vue";
import about from "./about.vue";
import { useShare } from "@vueuse/core";

import { useLoginStatusStore } from "@/store/stores/login";
import Api from "@/api";
let configStore = useConfigStore();
let loginStore = useLoginStatusStore();

/**
 * @bug 对模型列表如果不使用once 会出现bug
 */

const aboutRef = ref();
function goAbout() {
  aboutRef.value.scrollIntoView({ behavior: "smooth" });
}

const modelPreviewRef = ref();
function goModelPreview() {
  modelPreviewRef.value.scrollIntoView({ behavior: "smooth" });
}

const contactRef = ref();
function goContact() {
  contactRef.value.scrollIntoView({ behavior: "smooth" });
}

// 分享

const { share, isSupported } = useShare();

function startShare() {
  if (!isSupported.value) {
    return;
  }

  share({
    title: "衣设",
    text: "欢迎使用衣设，一个免费的服装设计工具 !",
    url: "1s.design",
  });
}

let router = useRouter();

// 快速创建
function login() {
  router.push({
    name: "Login",
  });
}
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
  overflow-x: hidden;
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
