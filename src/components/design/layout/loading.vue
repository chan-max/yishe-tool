<template>
  <div id="loading">
    <div class="designiy-loader-text">
      正在创建场景...
    </div>
    <span class="loader"></span>
  </div>
</template>
<script setup>
</script>

<style>
#loading {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999999;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  /* backdrop-filter: blur(6px);
  background:rgba(155,155,155,.5); */
  background: rgba(0,0,0,0.2);
}


.designiy-loader-text{
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding:10px 0px;
}

.loader{
      display: block;
      position: relative;
      height: 10px;
      width: 200px;
      border: 1px solid #fff;
      border-radius: 10px;
      overflow: hidden;
    }
    .loader::after {
      content: '';
      width: 200px;
      height: 100%;
      background: var(--1s-main);
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      animation: animloader 2s linear infinite;
    }
    
    @keyframes animloader {
      0% {
        left: 0;
        transform: translateX(-100%);
      }
      100% {
        left: 100%;
        transform: translateX(0%);
      }
    }
    
</style>