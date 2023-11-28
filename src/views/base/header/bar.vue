<template>
  <div ref="headerBar" class="header-bar flex justify-center z-10">
    <div class="header-bar-content flex justify-between items-center">
      <div class="header-bar-logo">1s.design</div>
      <div class="header-bar-menu-item">
        寻找模型
        <icon-arrow-down></icon-arrow-down>
      </div>
      <div class="header-bar-menu-item">在线商场 <icon-arrow-down></icon-arrow-down></div>
      <div class="header-bar-menu-item">设计工具 <icon-arrow-down></icon-arrow-down></div>
      <div class="header-bar-menu-item">更多 <icon-arrow-down></icon-arrow-down></div>
      <div style="flex: 1"></div>
      <user-avatar />
    </div>
  </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import { ref, onMounted, onUnmounted } from "vue";
import iconArrowDown from "@/icon/arrow-down.svg?vueComponent";
</script>

<style lang="less">
.header-bar {
  width: 100%;
  height: 64px;
  background: #fff;
}

.header-bar-content {
  width: 1600px;
  padding: 0 30px;
  column-gap: 50px;
}

.header-bar-logo {
  font-size: 15px;
  font-weight: bold;
}

.header-bar-menu-item {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  cursor: pointer;
  svg{
    width: 10px;
    height: 10px;
  }
}

.fixed {
  position: fixed;
}
</style>
