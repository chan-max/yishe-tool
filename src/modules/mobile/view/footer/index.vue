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
import iconHome from "@/icon/mobile/footer/home.svg?vueComponent";
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
}

</style>
