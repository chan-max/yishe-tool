<template>
  <div class="designiy-header-menu">
      <div class="designiy-header-menu-item">背景</div>
  </div>
</template>

<script setup></script>

<style lang="less">
.designiy-header-menu {
  width: 100%;
  height: 40px;
  background-color: #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
}

.designiy-header-menu-item{
  color:#eee;
  font-size: 12px;
  font-weight: bold;
  margin: 0 20px;
  cursor: pointer;
}


.designiy-bg-picker {
  input {
    width: 30px;
    height: 30px;
    border: none;
    outline: none;
    background-color: transparent;
  }
}
</style>
