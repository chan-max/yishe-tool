<template>
  <el-carousel style="border-radius: 8px; overflow: hidden;width:100%;height:100px;" direction="vertical" :motion-blur="true">
    <el-carousel-item>
      <div class="bar">
        <div></div>
        <div>
          <el-button class="button-try" @click="$router.push({ name: 'Design' })">
            快速开始
          </el-button>
        </div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="bar">
        <div></div>
        <div>
          <el-button class="button-try" @click="$router.push({ name: 'Design' })">
            上传资源
          </el-button>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.bar {
  width: 100%;
  height: 100px;
  background: #fbcd25;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: gradient 20s infinite;
}

@keyframes gradient {
  0% {
    background: red;
  }
  33% {
    background: green;
  }
  66% {
    background: blue;
  }
  100% {
    background: red;
  }
}

.button-try {
  background: transparent;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  padding: 1em;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  opacity: 0.8;
  font-weight: bold;
  margin: 40px;
}

.button-try:hover {
  opacity: 1;
  transform: scale(1.05);
}
</style>
