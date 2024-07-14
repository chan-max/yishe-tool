<template>
  <div id="loading">
    <span class="loader">1s.design</span>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, .5);
}


.loader {
  font-size:32px;
  display: inline-block;
  font-style: italic;
  font-family: ins;
  color: #fff;
  box-sizing: border-box;
  text-shadow: 0 0 2px #FFF, 0 0 1px #FFF, 0 0 1px #FFF;
  position: relative;
}
.loader::after {
  content: '1s.design';
  position: absolute;
  left: 0;
  top: 0;
  color: #6900ff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  animation: animloader 1.2s linear infinite;
}

@keyframes animloader {
  0% {
    width: 0%;
  }
  90% {
    width: 100%;
  }
  100% {
    width: 100%;
  }
}
</style>