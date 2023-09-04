<template>
  <div class="designiy-word-sticker">
    <div class="designiy-word-sticker-canvas">
    </div>
    <el-button style="width:280px;margin:5px 10px; " type="primary" size="default"><span
        style="font-weight: bold">添加文字贴纸</span></el-button>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { showBaseModelSelectDialog, currentModelInfo, canvasBgColor, canvasBgOpacity } from '../../store.ts'

</script>
<style lang="less">
.designiy-word-sticker {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.designiy-word-sticker-canvas {
  width: 280px;
  height: 200px;
  margin: 10px;
  background: #eee;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0),
    linear-gradient(45deg, #ccc 25%, transparent 0, transparent 75%, #ccc 0);
    background-position: -15px 5px, 15px 15px, 10px 10px,20px 20px;
    background-size: 20px 20px;
}
</style>
  