<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-16 23:12:29
 * @FilePath: /1s/src/modules/main/view/market/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
    <div class="market-container">
        <div class="market-title">
        </div>
        <div class="market-content">
            <card  v-for="model in modelList" @click="edit(model)" :model="model"></card>
        </div>
    </div>
</template>
<script setup>
import { getModelList } from '@/api/index';
import { onMounted,ref } from 'vue';
import card from './card.vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const modelList = ref()

onMounted(async () => {
    modelList.value = await getModelList()
})

function edit(model){
    router.push({
        name:'Design',
        query:{
            id:model.id
        },
        params:{
            // 如火传入了model信息，则进入设计台不需要再获取
            model:model
        } 
    })
}

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