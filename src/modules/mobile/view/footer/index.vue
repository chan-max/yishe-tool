<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-01 14:36:17
 * @FilePath: /1s/src/modules/mobile/view/footer/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="mobile-footer">
    <van-tabbar v-model="active" :border="false" route >
      <van-tabbar-item to="/">
        <template #icon>
          <icon-home class="footer-icon"></icon-home>
        </template>
      </van-tabbar-item>
      <van-tabbar-item>
        <template #icon>
          <icon-tool class="footer-icon"></icon-tool>
        </template>
      </van-tabbar-item>
      <van-tabbar-item>
        <template #icon>
          <icon-workspace class="footer-icon"></icon-workspace>
        </template>
      </van-tabbar-item>
      <van-tabbar-item>
        <template #icon>
          <icon-shop class="footer-icon"></icon-shop>
        </template>
      </van-tabbar-item>
      <van-tabbar-item  to="/me">
        <template #icon>
          <icon-me  class="footer-icon"></icon-me>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { User, Lock, View, Hide } from "@element-plus/icons-vue";
import iconHome from "@/icon/mobile/footer/home-filled.svg?vueComponent";
import iconWorkspace from "@/icon/mobile-workspace.svg?vueComponent";
import iconShop from "@/icon/mobile-shop.svg?vueComponent";
import iconTool from "@/icon/mobile-tool.svg?vueComponent";
import iconMe from "@/icon/mobile-me.svg?vueComponent";
import { ref } from "vue";
import { useLoginStatusStore } from "@/store/stores/login";
import { router } from '../../router';

const loginStatusStore = useLoginStatusStore()

const active = ref("");
</script>

<style lang="less">


.footer-icon {
  width: 28px;
  height: 28px;
  opacity: .8;
}

.mobile-footer{

}

:root:root{
  --van-tabbar-height:60px;
}

</style>
