<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-01 22:53:17
 * @FilePath: /1s/src/modules/main/App.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <el-config-provider :locale="elementLocale">
      <header-menu v-if="$route.meta.header"></header-menu>
      <div class="content"><router-view></router-view>
      </div>

  </el-config-provider>
</template> 
<script setup>
import { computed, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import headerMenu from './view/base/header/index.vue'
import footerMenu from './view/base/footer/index.vue'

import { useI18n } from "vue-i18n";

const { t, locale, global } = useI18n();



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
  overflow:hidden;
}

/* @font-face{
    font-family: 'alimama';
    src : url('/public/fonts/AlimamaFangYuanTiVF-Thin.ttf');
} */

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#app > * {
  flex-shrink: 0;
}

.content{
  width: 100%;
  flex:1;
  overflow:auto;
}

</style>
