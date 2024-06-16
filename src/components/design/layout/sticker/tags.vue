<template>
    <div class="tags">
        <template v-for="item in tags">
            <el-check-tag class="tag" :checked="item.checked" type="primary" @change="(value) => item.checked = value">
                {{ item.label }}
            </el-check-tag>
        </template>
        <div style="flex:1;"></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const tags = ref([
    {
        label: "最近更新",
        checked: false,
    },
    {
        label: "热门",
        checked: false,
    },
    {
        label: "艺术字",
        checked: false,
    },
    {
        label: "图片",
        checked: false,
    },
    {
        label: "印章",
        checked: false,
    },
    {
        label: "艺术字",
        checked: false,
    },
    {
        label: "矢量图",
        checked: false,
    },
    {
        label: "码",
        checked: false,
    },
    {
        label: "我的收藏",
        checked: false,
    },
    {
        label: "我的点赞",
        checked: false,
    },
    {
        label: "我上传的",
        checked: false,
    },
]);
</script>

<style scoped lang="less">
.tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: .8em .4em;
}

.tag{
    padding:6px 10px;
    border-radius: 12px;
    font-weight: 700;
    font-size: .8rem;
}
</style>
