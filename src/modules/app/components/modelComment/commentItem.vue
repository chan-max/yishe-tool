
<template>
    <div class="comment-item">
        <div class="main">
            <div class="avatar">
                头像
            </div>
            <div class="content">
                评论内容
            </div>
            <div style="flex:1"></div>
            <div class="save">
                点赞
            </div>
        </div>
        <div class="children">
            
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

</script>
<style lang="less" scoped>
    .comment-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .main{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>