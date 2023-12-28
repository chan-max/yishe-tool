<template>
  <h5>实物图</h5>
  <div style="width: 100%; height: 200px;display:flex;align-items: center;justify-content: center;">
    <template v-if="currentOperatingBaseModelInfo.description_imgs ">
      <el-carousel style="width:100%;" height="200px" type="card" :autoplay="false">
        <el-carousel-item v-for="item in 4" :key="item">
        </el-carousel-item>
      </el-carousel>
    </template>
    <template v-else>
        暂未上传实物图
    </template>
  </div>
</template>
<script setup>
import { currentOperatingBaseModelInfo } from "../../store";
</script>
<style>
</style>
