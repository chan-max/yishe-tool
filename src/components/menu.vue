<template>
  <div id="menu">
    <div style="margin-left: 10px">
      <a title="导入本地模型" @click="$emit('importModel')">导入</a>
      <a> 自定义素材 </a>
      <a>设置</a>
      <a>编辑</a>
      <a>导入</a>
      <a>导出</a>
      <a> 场景 </a>
      <a>服装底色</a>
      <a>添加贴图</a>
      <a>添加文字</a>
      <a>尺寸参考</a>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["importModel"]);
</script>

<style>
#menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 35px;
  border-bottom: 5px solid #333;
  background-color: #444;
  display: flex;
  align-items: center;
}
#menu a {
  color: #d5d5d5;
  font-size: 14px;
  padding: 2px 10px;
}
#menu a:hover {
  background: #333;
  cursor: pointer;
}
</style>