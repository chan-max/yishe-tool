<template>
  <div class="designiy-base-model-select">
    <div class="designiy-base-model-select-item" v-for="m in models">
      <div class="designiy-base-model-select-item-img">
        <el-image :src="m.imgFullpath" draggable="false" @click="selectModel(m)"></el-image>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getBaseModel } from "@/api";
import { onMounted, ref } from "vue";
import { showBaseModelSelect, currentOperatingModelInfo,showModelInfo } from "../../store.ts";

const models = ref([]);

onMounted(async () => {
  const data = await getBaseModel();
  models.value = data;
});

function selectModel(model) {
  showBaseModelSelect.value = false;
  currentOperatingModelInfo.value = model;
  showModelInfo.value = true
}
</script>
<style lang="less">
.designiy-base-model-select {
  width: 800px;
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  row-gap: 10px;
  margin: 10px;
}

.designiy-base-model-select-item {
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.designiy-base-model-select-item-img{
  width: 150px;
  height: 100px;
}

</style>
