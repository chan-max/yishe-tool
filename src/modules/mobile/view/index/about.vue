<template>
  <div
    style="padding: 24px; width: 100vw; overflow: hidden; box-sizing: border-box"
    class="flex items-center flex-col"
  >
    <div
      v-animateonscroll="{
        enterClass: 'animate__animated animate__zoomIn',
      }"
    >
      <h1 class="gradient-text title">关于我们</h1>
      <div class="text">
        衣设（1s.design）
        的最终目标是打造一个开放的服装设计平台，我们提供了一个功能丰富的设计工具，并希望提供从设计，宣传到制作一整套的完整的产业链来满足用户对服装的需求
      </div>
    </div>
    <div
      v-animateonscroll="{
        enterClass: 'animate__animated animate__zoomIn',
      }"
    >
      <h1 class="gradient-text title">在线工具</h1>
      <div>
        <div class="text">
          登录 pc 版
          即可使用我们的在线工具，功能丰富，简单易用，有着非常多的内置资源，每个人都可以分享自己的创作
        </div>
      </div>
    </div>
    <div
      v-animateonscroll="{
        enterClass: 'animate__animated animate__zoomIn',
      }"
    >
      <h1 class="gradient-text title">丰富的媒体运营</h1>
      <div>
        <div></div>
        <div class="text">
          在多个平台发布我们的作品，结合当前娱乐方向，创作出最新潮的服装设计，玩儿梗创作两不误
        </div>
      </div>
    </div>

    <div
      v-animateonscroll="{
        enterClass: 'animate__animated animate__zoomIn',
      }"
    >
      <h1 class="gradient-text title">新思路</h1>
      <div>
        <div></div>
        <div class="text">服装新先设计定制出售，再制作，提供一种全新的销售模式</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.text {
  font-size: 16px;
  text-align: center;
}

.title {
  margin: 36px;
  text-align: center;
}
</style>
