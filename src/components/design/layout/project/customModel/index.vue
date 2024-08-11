<template>
    <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
        <el-row style="row-gap: 8px;width:1000px;">
            <el-col :span="24 / column" v-for="item in  list" align="center">
                <div @click="openDetail(item)" style="width:100%;height:100%;flex-shrink: 0;"
                    class="flex flex-col items-center justify-center">
                    <desimage padding="5%" :src="item.thumbnail"
                        style="background:#f6f6f6!important;width:160px;height:160px;">
                    </desimage>
                    <div class="bar"></div>
                </div>
            </el-col>
        </el-row>
        <loadingBottom v-if="loading"></loadingBottom>
    </div>

    <modelDetailDialog></modelDetailDialog>
</template> 

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight } from "@element-plus/icons-vue";
import { getStickerListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";

import {
    currentModelController,
    showImageUplaod,
    viewDisplayController,
} from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";

import { useLoadingOptions } from "@/components/loading/index.tsx";
import scrollbar from "@/components/scrollbar/index.vue";

import { loadingBottom } from "@/components/loading/index.tsx";
import { currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import Utils from '@/common/utils'
import Api from '@/api'

import { useCustomModelDetailDialog } from '../customModelDialog/index.ts'


const { component: modelDetailDialog, open } = useCustomModelDetailDialog()


function openDetail(item) {
    open(item)
}

// 列表展示几列
const column = ref(6);

const loadingOptions = useLoadingOptions({});

const { list, getList, loading, reset, firstLoading, subsequentLoading } = usePaging(
    (params) => {
        return Api.getCustomModelListApi({
            ...params,
            pageSize: 20,
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


const showDetailModal = ref()

</script>

<style scoped lang="less">
.bar {
    width: 100%;
    height: 24px;
}
</style>
