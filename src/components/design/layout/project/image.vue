<template>
    <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
        <el-row style="row-gap: 1rem;">
            <el-col :span="24 / column" v-for="item in  list" align="center">

                <desimage class="img" padding="5%" :src="item.thumbnail">
                </desimage>

            </el-col>
        </el-row>
        <loadingBottom v-if="loading"></loadingBottom>
    </div>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight } from "@element-plus/icons-vue";
import { getStickerListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";

import {
    currentController,
    showImageUplaod,
    showDecalControl,
    viewDisplayController,
} from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";

import { useLoadingOptions } from "@/components/loading/index.tsx";
import scrollbar from "@/components/scrollbar/index.vue";

import { loadingBottom } from "@/components/loading/index.tsx";
import { currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import Utils from '@/common/utils'

// 列表展示几列
const column = ref(8);

const loadingOptions = useLoadingOptions({});

const { list, getList, loading, reset, firstLoading, subsequentLoading } = usePaging(
    (params) => {
        return getStickerListApi({
            ...params,
            pageSize: 20,
            type: 'image',
            myUploads: true
        });
    },
    {
        forEach(item) {
            item.thumbnail = Utils.formatUrl(item.thumbnail)
            item.url = Utils.formatUrl(item.url)
        },
    }
);

</script>



<style scoped lang="less">
.img {
    width: 100px !important;
    height: 100px !important;
    background: #f1f1f1;
}
</style>
