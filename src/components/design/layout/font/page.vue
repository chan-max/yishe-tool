<template>
    <el-row>
        <el-col :span="4">
        </el-col>
        <el-col :span="20">
            <s1-scrollbar height="540px">
                <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
                    {{ list }}
                    <s1-loadingBottom v-if="loading"></s1-loadingBottom>
                </div>
            </s1-scrollbar>
        </el-col>
    </el-row>
</template>
    
<script setup lang='ts'>
import { ref, onBeforeMount } from "vue";
import { getFontListApi } from "@/api";
import { operatingTextStickerOptions, showFontModal } from "../../store";
import { usePaging } from "@/hooks/data/paging";
import Utils from '@/common/utils'

// 字体列表
const { list, getList, reset, loading } = usePaging(
    (params) => {
        return getFontListApi({
            ...params,
            pageSize: 30,
        });
    },
);
</script>
    
<style></style>