<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 11:19:12
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-18 08:14:21
 * @FilePath: /1s/src/components/design/components/onlinePoint.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->

<template>
<div class="online-point" :class="online ? 'online-point-online' : 'online-point-offonline'"></div>
</template>

<script setup lang='ts'>
import {ref,defineProps } from 'vue'

const props = defineProps(['online'])

</script>
    
<style lang="less">
.online-point {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.online-point-online{
    background-color: rgba(0,255,0,.9);
}
.online-point-online:after{
    box-shadow: 0px 0px 2px 2px rgba(0,255,0,.9) inset;
}

.online-point-offonline{
    background-color: red;
}
.online-point-offonline:after{
    box-shadow: 0px 0px 2px 2px red inset;
}


.online-point:after {
  content: '';
  position: absolute;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 1.0
}

@keyframes pulsate {
  0% {transform: scale(0.5, 0.5); opacity: 0.0;}
  50% {opacity: 1.0;}
  100% {transform: scale(2, 2); opacity: 0.0;}
}
</style>