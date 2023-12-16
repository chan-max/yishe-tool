<template lang="">
<div class="header-top flex justify-center items-center ">
    <div class="header-top-content h-full flex items-center justify-between">
    <div @click="toggleLanguage">
      {{ $t("language") }}
    </div>
    <div>
        <span>tel</span>
        <!-- <span class=" text-xs font-bold">18742539196</span> -->
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
.header-top {
  width: 100%;
  height: 36px;
  background-color: #f2f2f2;
}

.header-top-content {
  width: 1200px;
  padding: 0 30px;
}
</style>