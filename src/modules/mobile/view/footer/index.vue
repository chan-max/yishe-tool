<template>
<div class="mobile-footer">
  <van-tabbar v-model="active" :border="false">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="search">搜索</van-tabbar-item>
    <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
    <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    <van-tabbar-item icon="setting-o">我的衣设</van-tabbar-item>
  </van-tabbar>
</div>
</template>

<script setup>
import { User, Lock, View, Hide } from "@element-plus/icons-vue";
import iconHome from "@/icon/mobile-home.svg?vueComponent";
import iconWorkspace from "@/icon/mobile-workspace.svg?vueComponent";
import iconShop from "@/icon/mobile-shop.svg?vueComponent";
import iconTool from "@/icon/mobile-tool.svg?vueComponent";
import iconMe from "@/icon/mobile-me.svg?vueComponent";
import { ref } from "vue";

const active = ref("");
</script>

<style lang="less">


</style>
