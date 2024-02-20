<template>
  <div class="designiy-custom-text-sticker">
    <div class="designiy-custom-text-sticker-title">
      <div>创作文本贴纸</div>
      <el-button text type="primary" plain @click="save" size="small"> 上传 </el-button>
    </div>
    <sticker-canvas></sticker-canvas>
    <operating-form></operating-form>
  </div>
</template>
<script setup>

import stickerCanvas from "./canvas.vue";
import operatingForm from './operatingForm.vue'
import { uploadTextSticker } from '@/api';
import { base64 } from './watch';
import { base64ToFile } from '@/common/transform/base64ToFile';


async function save() {
  await uploadTextSticker({
    img: base64ToFile(base64.value),
  });
}


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
  justify-content: space-between;
}

</style>
