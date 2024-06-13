<template>
  <div class="container">
    <el-button @click="add" type="primary"> 添加该贴纸 </el-button>
  </div>
</template>

<script setup lang="ts">
import { currentController } from "@/components/design/store";

const props = defineProps({
  data: {
    default:{}
  },
});

function add() {
  currentController.value.addSticker({
    ...props.data,
  });
}
</script>

<style scoped lang="less">
.container {
  width: 300px;
  height: 200px;
}
</style>
