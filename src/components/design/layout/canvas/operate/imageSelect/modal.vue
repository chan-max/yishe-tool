<template>
    <el-dialog v-bind="$attrs" width="960px" title="选择图片">
        <div class="model">
            <scrollbar>
                <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
                    <el-row style="row-gap: 1rem;padding: 20px;">
                        <el-col :span="24 / column" v-for="item in  list" align="center">

                            <div @click="useAsCanvasImage(item)">
                                <desimage class="img" padding="5%" :src="item.thumbnail">
                                </desimage>
                            </div>

                        </el-col>
                    </el-row>
                    <loadingBottom v-if="loading"></loadingBottom>
                </div>
            </scrollbar>
        </div>
    </el-dialog>
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

const emits = defineEmits(['close'])

/*
    作为当前
*/
function useAsCanvasImage(item) {
    if (item.type != 'image') {
        throw '图片类型才能作为画布图片元素'
    }
    if (currentOperatingCanvasChild.value.type != 'image') {
        throw '当前操作的不是图片元素'
    }
    currentOperatingCanvasChild.value.imageInfo = item

    emits('close')
}

const { list, getList, loading, reset, firstLoading, subsequentLoading } = usePaging(
    (params) => {
        return getStickerListApi({
            ...params,
            pageSize: 20,
            type:'image'
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
.model {
    // width: 920px;
    height: 500px;
}

.img {
    width: 100px!important;
    height: 100px!important;
    background: #f1f1f1;
}
</style>
