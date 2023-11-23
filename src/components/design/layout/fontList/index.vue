<template>
  <div class="designiy-font-list">
    {{  data }}
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { getFonts } from '@/api';
const data = ref();

onBeforeMount(async () => {
    data.value = await getFonts()
});

</script>
<style lang="less">
.designiy-font-list {
  width: 300px;
}
</style>
