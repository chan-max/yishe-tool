<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 23:14:31
 * @FilePath: /yishe/src/modules/main/App.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <a-config-provider :theme="antdTheme">
    <el-config-provider :locale="elementLocale">
      <header-menu v-if="$route?.meta?.header"></header-menu>
      <div class="app-content">
        <router-view></router-view>
      </div>
    </el-config-provider>
  </a-config-provider>
</template>
<script setup>
import { computed, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import headerMenu from "./view/base/header/index.vue";
// import footerMenu from "./view/base/footer/index.vue";
import { theme } from 'ant-design-vue'

const { defaultAlgorithm, darkAlgorithm } = theme



import { useI18n } from "vue-i18n";

const { t, locale, global } = useI18n();

const screenSize = ref(window.innerWidth)

const customToken = computed(() => {
  if (screenSize.value < 768) {
    return { fontSize: 10 }
  } else if (screenSize.value < 1960) {
    return { fontSize: 10 }
  } else {
    return { fontSize: 11 }
  }
})

// 监听窗口大小变化
window.addEventListener('resize', () => {
  screenSize.value = window.innerWidth
})

const antdTheme = computed(() => ({
  algorithm: defaultAlgorithm,
  token: {
    ...customToken.value,
    colorPrimary: "#6900ff",
  },
}))


const elementLocale = computed(() => {
  if (locale.value == "en") {
    return en;
  } else {
    return zhCn;
  }
});
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

@font-face {
  font-family: "alimama";
  src: url("/public/fonts/AlimamaFangYuanTiVF-Thin.ttf");
}

@font-face {
  font-family: "ins";
  src: url("/public/fonts/ins.otf");
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* font-family: alimama; */
}

#app>* {
  flex-shrink: 0;
}

.app-content {
  width: 100%;
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  flex-direction: column;

  &>* {
    flex-shrink: 0;
  }
}
</style>
