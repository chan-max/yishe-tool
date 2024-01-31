<template>
  <div class="model-content" v-infinite-scroll="scroll" :infinite-scroll-distance="150">
    <div v-for="item in list" class="item"></div>
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
<style lang="less">
.model-content {
  width: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  grid-auto-rows: 170px;
  justify-items: center;
}

.item {
  width: 280px;
  height: 160px;
  background: #eee;
}
</style>
