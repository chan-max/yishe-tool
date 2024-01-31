<template>
  <div class="model-content" v-infinite-scroll="scroll" :infinite-scroll-distance="150">
    <div v-for="item in list" class="item">
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { usePaging } from "@/hooks/data/paging";
import { getModelList } from "@/api";

const { page, pages, pageSize, list, getList } = usePaging(() => {
  return getModelList();
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 180px;
  justify-items: center;
}

.item {
  width: 280px;
  height: 160px;
  background: #eee;
}
</style>
