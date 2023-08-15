<template>
  <div class="designiy-base-model-select">
    <div class="designiy-base-model-select-item" v-for="m in models">
      <img :src="(__DEV__ ? 'api' : '') +  m.imgPath" draggable="false">
    </div>
  </div>
</template>
<script setup>
import { getBaseModelList } from "@/api";
import { onMounted, ref } from "vue";

const models = ref([]);

onMounted(async () => {
  const res = await getBaseModelList();
  models.value = res.data;
});

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
  img{
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
