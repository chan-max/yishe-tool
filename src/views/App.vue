<template>
  <el-config-provider :locale="locale">
    <div id="notice"></div>
    <div id="header" v-if="!$route.meta.hideHeader">
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

import {useI18n} from 'vue-i18n'

const {t,locale} = useI18n()

const toggle = () => {

}

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
  height: 50px;
  width: 100%;
  flex-shrink: 0;
  position: relative;
  border: 1px solid #eee;
}

#content {
  flex: auto;
  background: #fff;
  overflow-y: auto;
  position: relative;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
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
