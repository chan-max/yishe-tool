<template>
    <div class="market-container">
        <div class="market-title">
        </div>
        <div class="market-content">
            <viewer v-for="model in modelList" :model="model"></viewer>
        </div>
    </div>
</template>
<script setup>
import { getModelList } from '@/api/index';
import { onMounted,ref } from 'vue';
import viewer from './modelViewer.vue'

const modelList = ref()

onMounted(async () => {
    modelList.value = await getModelList()
})

</script>
<style>
.market-container{
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
}

.market-title{
    font-size: 40px;
    font-weight: 500;
    color: #444;
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #e7e7e7;
}
.market-content{
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 10px;
    overflow: auto;
    justify-content: center;
}
</style>