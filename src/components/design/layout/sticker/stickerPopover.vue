<template>
  <div class="container">
    <el-button-group  class="w-full" style="display:flex;">
      <el-button @click="add" type="primary"> 添加该贴纸 </el-button>
      <el-button style="flex:1;" @click="use" type="primary"> 使用该贴纸 </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { currentController } from "@/components/design/store";

const props = defineProps({
  stickerInfo: {
    default: {}
  },
});

function add() {
  return
  currentController.value.addSticker({
    ...props.stickerInfo,
  });
}

function use(){
  currentController.value.addClickDelaySticker({
    ...props.stickerInfo,
  });
}
</script>

<style scoped lang="less">
.container {
  width: 300px;
  height: 200px;
}
</style>
