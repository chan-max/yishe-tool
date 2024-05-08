<template>
  <div  style="width:100%;box-sizing:border-box;flex-shrink: 0;">
    <el-carousel height="300px;" style="border-radius:8px;overflow:hidden;">
      <el-carousel-item v-for="item in imgs" :key="item">
        <img :src="item.url">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import {reactive} from 'vue'
import url from './imgs/1.webp'
    const imgs = reactive([
        {
            url
        },
        {
            url
        },
        {
            url
        },
    ])
</script>
<style scoped>

</style>
