<template>
  <div class="left-menu">
    <el-tooltip content="选择服装模型" placement="right">
      <div class="left-menu-item"><font-awesome-icon :icon="['fass', 'shirt']" /></div>
    </el-tooltip>
  </div>
</template>
<script></script>
<style lang="less">
.left-menu {
  width: 50px;
  background-color: #fff;
}

.left-menu-item {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
