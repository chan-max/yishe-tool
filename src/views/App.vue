<template>
  <el-config-provider :locale="elementLocale">
    <div id="notice"></div>
    <div id="header" v-if="$route.meta.header">
      <header-view @change-language="toggleLanguage"></header-view>
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>
<script setup>
import headerView from "./base/header.vue";
import { computed, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";

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
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

#header {
  height: 45px;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}


#content {
  flex: auto;
  text-align: center;
  & > *{
    margin-left:auto;
    margin-right:auto;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
}
::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
::-webkit-scrollbar-corner {
}
</style>
