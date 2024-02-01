<template>
  <div class="model-content" v-infinite-scroll="scroll" :infinite-scroll-distance="150">
    <div v-for="item in list" class="item">
      <el-image :src="item.preview_img" fit="cover" style="width:100%;height:100%">
      </el-image>
      <el-button > 发布 </el-button>
    </div>
  </div>
</template>
<script setup>

import { ref } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { getModelList } from "@/api";

const { page, pages, pageSize, list, getList } = usePaging((params) => {
  return getModelList({
    onlyMyContent:true,
    ...params
  });
});

function scroll() {
  getList();
}


</script>
<style lang="less" scoped>
.model-content {
  width: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 170px;
  justify-items: center;
}

.item {
  width: 300px;
  height: 160px;
  background: #eee;
  border-radius:10px;
  overflow:hidden;
  position:relative;
}
</style>
