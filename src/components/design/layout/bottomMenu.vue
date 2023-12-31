<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-19 18:50:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-30 21:53:29
 * @FilePath: /1s/src/components/design/layout/bottomMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
<div class="designiy-bottom-menu">

  <el-tooltip :hide-after="0" content="重置当前场景" placement="top">
      <div class="bottom-menu-item" >
        <icon-refresh></icon-refresh>
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="重制模型位置" placement="top">
      <div class="bottom-menu-item" @click="locate">
        <icon-locate></icon-locate>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" :content="isFullScreen ? '退出全屏' : '进入全屏'" placement="top">
      <div class="bottom-menu-item" @click="isFullScreen = !isFullScreen">
        <icon-fullscreen></icon-fullscreen>
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="旋转动画" placement="top">
      <div class="bottom-menu-item" @click="animate">
        <icon-rotate></icon-rotate>
      </div>
    </el-tooltip>
</div>
</template>
<script setup>
import {isFullScreen,currentController} from '../store'
import iconFullscreen from '@/icon/fullscreen.svg?vueComponent'
import iconRotate from '@/icon/rotate.svg?vueComponent'
import iconLocate from '@/icon/locate.svg?vueComponent'
import iconRefresh from '@/icon/refresh.svg?vueComponent'

function locate(){
    currentController.value.resetPosition()
}

function animate(){
    currentController.value.animate = !currentController.value.animate
}



</script>
<style lang="less">
.designiy-bottom-menu{
    height:100%;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 50px;
    background-color: #fff;
    box-shadow:rgba(0, 0, 0, 0.15) 0px 2px 6px;
}

.bottom-menu-item{
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    color:var(--1s-icon-color);
    svg{
      width: 14px;
      height: 14px;
    }
}
</style>