<template>
  <div class="designiy-custom-text-sticker">
    <div class="designiy-custom-text-sticker-title">创作文本贴纸</div>
    <sticker-canvas></sticker-canvas>
    <operating-form></operating-form>
  </div>
</template>
<script setup>

import stickerCanvas from "./canvas.vue";
import operatingForm from './operatingForm.vue'


</script>
<style lang="less">
.designiy-custom-text-sticker {
  height: 100%;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.designiy-custom-text-sticker-title {
  width: 100%;
  padding: 10px 10px;
  font-size: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
  color: #333;
}

</style>
