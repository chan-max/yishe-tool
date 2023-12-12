<template>
  <el-config-provider :locale="elementLocale">
      <header-menu v-if="$route.meta.header"></header-menu>
      <router-view></router-view>
  </el-config-provider>
</template>
<script setup>
import { computed, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import headerMenu from './view/base/header/index.vue'
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
  /* font-family: alimama;
  font-weight: 500; */
}

#app > * {
  flex-shrink: 0;
}

</style>
