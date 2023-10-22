
<template>
    <div class="market-container">
        <div class="market-title">
            寻找第一无二的创作
        </div>
    </div>
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
.market-container{
    width: 100%;
    height: 100%;
}

.market-title{
    font-size: 40px;
    font-weight: 500;
    color: #444;
    padding: 50px;
}
</style>