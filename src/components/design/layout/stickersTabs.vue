<template>
  <div class="designiy-stickers-tabs">
    <el-tabs >
      <el-tab-pane v-for="sticker,index in stickers" :key="index" :label="sticker.type">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { getStickers } from '@/api';
import {ref} from 'vue'

const stickers = ref()

getStickers().then((res) => stickers.value = res.data)
  

</script>
<style>
.designiy-stickers-tabs{
    padding:  10px 25px 10px 25px;
}
</style>
