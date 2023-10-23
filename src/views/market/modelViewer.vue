<template>
    <div class="market-viewer">
        <div  class="market-viewer-main" >
            <el-image :src="props.model.img" draggable="false">
                <template #placeholder>
                加载中
                </template>
            </el-image>
        </div>
        <div class="market-viewer-title">
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps(['model'])

</script>
<style>
.market-viewer{
    width: 330px;
    background-color: #fff;
    box-shadow: 0 0 4px #e6e6e6;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.market-viewer-main{
    width: 100%;
    height: 200px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.market-viewer-title{
    width: 100%;
    height: 30px;
    background-color: #fff;
}
</style>