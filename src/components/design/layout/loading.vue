<template>
  <div id="loading">加载中...</div>
</template>
<script setup>
</script>

<style>
#loading {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background: rgba(50, 50, 50, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
}
</style>