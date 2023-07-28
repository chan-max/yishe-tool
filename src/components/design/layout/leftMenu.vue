<template>
  <div class="menu-bar">
    <el-tooltip content="选择服装模型" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'shirt']" />
      </div>
    </el-tooltip>
    <el-tooltip content="图片贴图" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'image']" />
      </div>
    </el-tooltip>
    <el-tooltip content="艺术字贴图" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'font']" />
      </div>
    </el-tooltip>
    <el-tooltip content="尺寸测量工具" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'ruler']" />
      </div>
    </el-tooltip>

    <el-tooltip content="设置场景" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'video']" />
      </div>
    </el-tooltip>
    <el-tooltip content="灯光调整" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'lightbulb']" />
      </div>
    </el-tooltip>
    <el-tooltip content="预览模型" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'eye']" />
      </div>
    </el-tooltip>
    <el-tooltip content="使用帮助" placement="right">
      <div class="menu-bar-item">
        <font-awesome-icon :icon="['fas', 'circle-question']" />
      </div>
    </el-tooltip>
  </div>
</template>
<script></script>
<style lang="less">
.menu-bar {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}

.menu-bar-item {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    color: #06f;
    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
