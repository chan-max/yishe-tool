<template>
        <div> 使用在线工具，定制专属商品</div>
        <div class="operate">
            <designer></designer>
        </div>
</template>
    
<script setup lang='ts'>
    import designer from "@/components/design/index.vue"
</script>
    
<style scoped lang="less">
    .operate{
        width: 75vw;
        height: 45vw;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
        border-radius: 12px;
        overflow: hidden;
    }
</style>