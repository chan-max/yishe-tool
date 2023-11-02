<template lang="">
<div class="home-top flex justify-center items-center ">
    <div class="home-top-content h-full flex items-center justify-between">
    <div @click="toggleLanguage">
      {{ $t("language") }}
    </div>
    <div>
        <span class="font-bold">tel:</span>
        <span class=" text-xs">18742539196</span>
    </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t, locale, global } = useI18n();

function toggleLanguage() {
  if (locale.value == "en") {
    locale.value = "cn";
  } else {
    locale.value = "en";
  }
}

</script>
<style lang="less">
    .home-top{
        width: 100%;
        height:36px;
        background-color: #f2f2f2;
    }

    .home-top-content{
        width:1080px;
        padding:0 20px;
    }
</style>