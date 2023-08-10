<template>
  <div class="designiy-base-model-select"></div>
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
<style>
.designiy-base-model-select {
  width: 800px;
  height: 400px;
  background-color: ;
}
</style>
