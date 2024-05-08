<template>
  <div  style="width:100%;padding:40px;box-sizing: border-box;">
    <el-carousel height="300px">
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
