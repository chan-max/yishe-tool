<template>
  <div class="header-top flex justify-center items-center">
    <div class="header-top-content h-full flex items-center justify-between">
      <div></div>
      <el-button type="text"> 上传 </el-button>
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
  height: 32px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.header-top-content {
  width: 100%;
  padding: 0 60px;
}
</style>
