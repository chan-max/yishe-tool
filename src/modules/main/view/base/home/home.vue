<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-26 07:36:21
 * @FilePath: /yishe/src/modules/main/view/base/home/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="home">
    <div class="simple-content">
      <a-button 
        type="primary" 
        size="large" 
        @click="goToDesign"
        class="start-button"
      >
        开始设计
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到设计页面
const goToDesign = () => {
  router.push('/design')
}
</script>

<style scoped lang="less">
.home {
  min-height: 100vh;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.simple-content {
  text-align: center;
  
  .start-button {
    height: 44px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 22px;
    padding: 0 32px;
    background: linear-gradient(135deg, #adb5bd 0%, #868e96 100%);
    border: none;
    color: white;
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 8px 25px rgba(173, 181, 189, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(173, 181, 189, 0.4);
      background: linear-gradient(135deg, #9ca3af 0%, #6c757d 100%);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(173, 181, 189, 0.3);
    }
  }
}
</style>
