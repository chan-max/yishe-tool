<template>
  <div id="loading">
    <div class="designiy-loader-text">
      加载中...
    </div>
    <span class="designiy-loader"></span>
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
  backdrop-filter: blur(6px);
  background:rgba(155,155,155,.3);
}


.designiy-loader-text{
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding:10px 0px;
}

.designiy-loader {
  width: 200px;
  height: 4.8px;
  display: inline-block;
  position: relative;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.designiy-loader::after {
  content: '';
  width: 50px;
  height: 4.8px;
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