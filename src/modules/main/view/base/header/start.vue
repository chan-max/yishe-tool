<template>
  <div class="container">
    <div>
      <div class="title">选择一个模型</div>
      <div class="item">T恤</div>
      <div class="item">马克杯</div>
      <div class="item">毛巾</div>
      <div class="item">锦旗</div>
    </div>
    <div>
      <div class="title">创建一个贴纸</div>
      <div class="item">图片上传</div>
      <div class="item">艺术字</div>
      <div class="item">二维码</div>
      <div class="item">条形码</div>
      <div class="item">矢量图形</div>
      <div class="item">春联</div>
      <div class="item">特效图</div>
    </div>
    <div>
      <div class="title">上传资源</div>
      <div class="item">图片</div>
      <div class="item">字体</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.container {
  display: flex;
  column-gap: 6em;
}

.title {
  color: #333;
  font-size: 1rem;
  font-weight: 300;
  padding: 1em 0;
}

.item {
  color: #333336;
  font-size: 1.1rem;
  font-weight: 300;
  padding: 0.4em 0;
  font-weight: 400;

  &:hover {
    color: #000;
    cursor: pointer;
  }
}
</style>
