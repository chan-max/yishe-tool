<template>
  <div ref="container" class="designiy-base-model-select">
    <div class="designiy-base-model-select-item" v-for="m in models">
      <div class="designiy-base-model-select-item-img">
        <el-image
          :src="m.preview_img"
          draggable="false"
          @click="selectModel(m)"
        ></el-image>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getBaseModel } from "@/api";
import { onMounted, ref } from "vue";
import {
  showBaseModelSelect,
  currentOperatingBaseModelInfo,
  showModelInfo,
} from "../../store.ts";

const models = ref([]);

const container = ref();

onMounted(async () => {
  const data = await getBaseModel();
  models.value = data;
  
  // 适配鼠标滑轮横向滚动
  container.value.addEventListener("wheel", (event) => {
    console.log(event.deltaY)
    container.value.scrollLeft += event.deltaY;
    // event.preventDefault();
  },{passive:false});
});

function selectModel(model) {
  showBaseModelSelect.value = false;
  currentOperatingBaseModelInfo.value = model;
  showModelInfo.value = true;
}
</script>
<style lang="less">
.designiy-base-model-select {
  width: 960px;
  height: 500px;
  overflow: auto;
  display: flex;
  column-gap: 10px;
  margin: 10px 30px;
}

.designiy-base-model-select-item {
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  flex-shrink: 0;
  width:300px;
}

.designiy-base-model-select-item-img {
  width: 150px;
  height: 100px;
}
</style>
