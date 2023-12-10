<template>
    <van-nav-bar :border="false">
        <template #left>    
        </template>
        <template #title>
            衣设
        </template>
        <template #right>
            <icon-scan @click="$router.push({name:'Scan'})" style="width:20px;height:20px;"></icon-scan>
        </template>
    </van-nav-bar>
</template>
<script setup>
    import iconScan from '@/icon/mobile/scan.svg?vueComponent'

</script>
    
<style lang="less">
    
    :root{
        --van-nav-bar-height:60px;
    }


    .van-theme-dark{
        svg{
            color:#fff;
        }
    }

</style>