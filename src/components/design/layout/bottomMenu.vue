<template>
<div class="designiy-bottom-menu">

  <el-tooltip :hide-after="0" content="重置当前场景" placement="top">
      <div class="bottom-menu-item" >
        <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
      </div>
    </el-tooltip>

  <el-tooltip :hide-after="0" content="上一步" placement="top">
      <div class="bottom-menu-item" >
        <font-awesome-icon :icon="['fas', 'reply']" />
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="下一步" placement="top">
      <div class="bottom-menu-item">
        <font-awesome-icon :icon="['fas', 'share']" />
      </div>
    </el-tooltip>

    <el-tooltip :hide-after="0" content="重制模型位置" placement="top">
      <div class="bottom-menu-item" @click="locate">
        <font-awesome-icon :icon="['fas', 'crosshairs']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" :content="isFullScreen ? '退出全屏' : '进入全屏'" placement="top">
      <div class="bottom-menu-item" @click="isFullScreen = !isFullScreen">
        <font-awesome-icon :icon="['fas', 'expand']" />
      </div>
    </el-tooltip>
    <el-tooltip :hide-after="0" content="旋转动画" placement="top">
      <div class="bottom-menu-item" @click="animate">
        <font-awesome-icon :icon="['fas', 'arrows-spin']" />
      </div>
    </el-tooltip>
</div>
</template>
<script setup>
import {isFullScreen,currentController} from '../store'

function locate(){
    currentController.value.resetPosition()
}

function animate(){
    currentController.value.animate = !currentController.value.animate
}

</script>
<style>
.designiy-bottom-menu{
    height:100%;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 50px;
    box-shadow:rgba(0, 0, 0, 0.15) 0px 2px 6px;
    border-radius: 5px;
}

.bottom-menu-item{
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    color:var(--1s-icon-color);
}
</style>