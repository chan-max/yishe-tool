
<template>
    {{ modelList }}
</template>
<script setup>
import { getModelList } from '@/api/index';
import { onMounted,ref } from 'vue';

const modelList = ref()

onMounted(async () => {
    modelList.value = await getModelList()
})

</script>
<style>
</style>