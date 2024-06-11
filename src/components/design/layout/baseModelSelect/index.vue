<template>
  <div ref="container" class="designiy-base-model-select">
    <div class="designiy-base-model-select-item" v-for="m in models">
      <div class="designiy-base-model-select-item-img">
        <el-image :src="m.thumbnail" draggable="false" @click="selectModel(m)"></el-image>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getProductModelListApi } from "@/api";
import { onMounted, ref } from "vue";
import {
  showBaseModelSelect,
  currentOperatingBaseModelInfo,
  showModelInfo,
} from "../../store.ts";

const models = ref([]);

const container = ref();

onMounted(async () => {
  const res = await getProductModelListApi({
    currentPage: 1,
    pageSize: 100,
  });

  models.value = res.list;
  res.list.map((item) => {
    item.url = "http://" + item.url;
    item.thumbnail = "http://" + item.thumbnail;
  });

  // 适配鼠标滑轮横向滚动
  container.value.addEventListener(
    "wheel",
    (event) => {
      container.value.scrollLeft += event.deltaY;
      // event.preventDefault();
    },
    { passive: false }
  );
});

function selectModel(productModel) {
  // 选择基础模型
  showBaseModelSelect.value = false;
  currentOperatingBaseModelInfo.value = productModel;
  showModelInfo.value = true;
}
</script>
<style lang="less">
.designiy-base-model-select {
  width: 900px;
  height: 400px;
  overflow: auto;
  display: flex;
  column-gap: 10px;
  padding: 10px 30px;
}

.designiy-base-model-select-item {
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  flex-shrink: 0;
  width: 300px;
}

.designiy-base-model-select-item-img {
  width: 150px;
  height: 100px;
}
</style>
