<template>
  <div>使用在线工具，定制专属商品</div>
  <div class="operate">
    <designer style="filter: blur(6px)"></designer>
    <div class="mask">
      <el-button
        type="primary"
        @click="$router.push({ name: 'Design' })"
        size="large"
        round
      >
        快速开始
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import designer from "@/components/design/index.vue";
</script>

<style scoped lang="less">
.operate {
  height: 800px;
  width: 1280px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px,
    rgba(17, 17, 26, 0.1) 0px 24px 80px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
</style>
