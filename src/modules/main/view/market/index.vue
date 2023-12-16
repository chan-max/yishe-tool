<template>
    <div class="market-container">
        <div class="market-title">
        </div>
        <div class="market-content">
            <card  v-for="model in modelList" :model="model"></card>
        </div>
    </div>
</template>
<script setup>
import { getModelList } from '@/api/index';
import { onMounted,ref } from 'vue';
import card from './card.vue'

const modelList = ref()

onMounted(async () => {
    modelList.value = await getModelList()
})

</script>
<style>

.market-container{
    width: 100%;
    height: 100%;
    overflow: auto;
    display:flex;
    justify-content: center;
 
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
    row-gap: 10px;
    overflow: auto;
    width:100%;
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    justify-content: space-around;
    row-gap:20px;
    column-gap:20px;
}


</style>