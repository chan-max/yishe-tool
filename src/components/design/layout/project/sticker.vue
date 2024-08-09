<template>
    <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
        <el-row style="row-gap: 8px;width:990px;">
            <el-col :span="24 / column" v-for="item in  list" align="center">
                <div style="width:100%;height:100%;flex-shrink: 0;" class="flex flex-col items-center justify-center">
                    <desimage padding="5%" :src="item.thumbnail"
                        style="background:#f6f6f6!important;width:240px;height:180px;border-radius: 8px;">
                    </desimage>
                    <div class="bar flex items-center justify-between">
                        <div class="text-ellipsis" style="max-width:80px;"> {{ item.name }} </div>
                        <div class="public-tag" v-if="!item.isPublic"> 已共享 </div>
                        <div style="flex:1;"></div>
                        <el-dropdown>
                            <el-button size="small" link>
                                <el-icon>
                                    <MoreFilled />
                                </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>
                                        <el-button size="small" link @click="useSticker(item)"> 在工作台使用 </el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="danger" size="small" link>删除</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button size="small" link> 发布 </el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button size="small" link> 分享给好友 </el-button>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </el-col>
        </el-row>
        <loadingBottom v-if="loading"></loadingBottom>
        <div class="endofpage" v-if="isLastPage"> 到底了~ </div>
    </div>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight, MoreFilled } from "@element-plus/icons-vue";
import { getStickerListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";
import { MoreOutlined } from '@ant-design/icons-vue'
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
import { canvasStickerOptions } from "@/components/design/layout/canvas/index.tsx";
import { message } from "ant-design-vue";


// 列表展示几列
const column = ref(4);

const loadingOptions = useLoadingOptions({});

const { list, getList, loading, reset, firstLoading, subsequentLoading, isLastPage, currentPage, totalPage, } = usePaging(
    (params) => {
        return getStickerListApi({
            ...params,
            pageSize: 20,
            type: 'composition',
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


function useSticker(item) {
    canvasStickerOptions.value = item.meta.data
    message.success('引用成功')
}

</script>



<style scoped lang="less">
.bar {
    width: 100%;
    height: 36px;
    padding: 0 1rem;
    column-gap: 1rem;
}

.public-tag {
    background-color: #ccc;
    color: #fff;
    border-radius: 2px;
    padding: 2px;
    font-size: .8rem;
    font-weight: bold;
}

.endofpage{
    width: 100%;
    text-align: center;
    height: 36px;
    line-height: 36px;
    color: #aaa;
}
</style>
