<template>
  <div class="designiy-base-model-select">
    <el-image  class="designiy-base-model-select-item"  v-for="m in models" :src="m.img" draggable="false" @click="selectModel(m)"></el-image>
  </div>
</template>
<script setup>
import { getBaseModelList,baseModelListAdapter  } from "@/api";
import { onMounted, ref } from "vue";
import {showBaseModelSelectDialog,currentModelInfo} from '../../store.ts'

const models = ref([]);

onMounted(async () => {
  const res = await getBaseModelList();
  models.value = baseModelListAdapter(res.data);
});


function selectModel(m){
  showBaseModelSelectDialog.value = false
  currentModelInfo.value = m
}

</script>
<style lang="less">
.designiy-base-model-select {
  width: 800px;
  height: 400px;
  overflow-y: auto ;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  grid-auto-rows: 130px;
  justify-items: center;
  align-items: center;
}

.designiy-base-model-select-item{
  width:190px;
  height: 120px;
  cursor: pointer;
}
</style>
