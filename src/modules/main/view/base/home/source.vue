<template>
  <div>
    <h3>基础模型</h3>
    <div class="container">
      <div v-for="item in list" class="card">
        <model-card-viewer
          class="viewer"
          :model-url="'http://' + item.url"
          :thumbnail-url="'http://' + item.thumbnail"
        ></model-card-viewer>
        <div>这是模型描述</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getProductModelListApi } from "@/api";
import modelCardViewer from "@/components/model/modelCardViewer/index.vue";

const list = ref([]);

const showImage = ref(true);

onBeforeMount(async () => {
  const res = await getProductModelListApi({
    currentPage: 1,
    pageSize: 100,
  });
  list.value = res.data.list;
});
</script>

<style scoped lang="less">
.card {
  width: 150px;
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
  &:hover {
    border-bottom: 2px solid black;
    cursor: pointer;
  }
}

.viewer {
  width: 140px;
  height: 140px;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-gap: 10px;
  grid-auto-rows: 220px;
  justify-items: center;
  justify-content: center;
}
</style>
