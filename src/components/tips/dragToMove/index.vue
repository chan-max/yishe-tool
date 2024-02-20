<template>
  <div class="drag-to-move">
    <div class="swipe">
      <div class="touch-point"></div>
      <icon-finger-move class="icon"></icon-finger-move>
      <div class="text">拖动来查看</div>
    </div>
  </div>
</template>
<script setup>
import iconFingerMove from "@/icon/mobile/fingerMove.svg?component";
</script>
<style lang="less" scoped>
.drag-to-move {
  position: absolute;
  z-index: 999;
}

.icon {
  width: 30px;
  height: 30px;
  color: #fff;
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.2));
}

.swipe {
  animation: swipe-animation 3s ease infinite;
  position: relative;
}

.touch-point {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  left: 12px;
  background-color: rgba(255, 255, 255, 0.5);
}

.text {
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-shadow: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.2));
}

@keyframes swipe-animation {
  0% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  50% {
    transform: translateX(100px) translateY(10px) rotate(20deg);
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
}
</style>
