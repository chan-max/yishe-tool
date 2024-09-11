<template>
    <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
        <el-row style="row-gap: 8px;width:1000px;">
            <el-col :span="24 / column" v-for="item in  list" align="center">
                <div style="width:100%;height:100%;flex-shrink: 0;" class="flex flex-col items-center justify-center">
                    <desimage padding="5%" :src="item.thumbnail"
                        style="background:#f6f6f6!important;width:240px;height:180px;border-radius: 8px;">
                    </desimage>
                    <div class="bar flex items-center justify-between">
                        <div class="text-ellipsis" style="max-width:80px;"> {{ item.name || '未命名'  }} </div>
                        <div class="public-tag" v-if="item.isPublic"> 已共享 </div>
                        <div class="timeage"> {{ Utils.time.timeago(item.updateTime) }} </div>
                        <div style="flex:1;"></div>

                        <a-dropdown trigger="click">
                            <el-button  link>
                                <el-icon size="12">
                                    <MoreFilled />
                                </el-icon>
                            </el-button>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="deleteItem(item)">
                                        <el-button type="danger" size="small" link>删除</el-button>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <el-button size="small" link> 分享给好友 </el-button>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <el-button size="small" link> 发布 </el-button>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </div>
            </el-col>
        </el-row>
        <loadingBottom v-if="loading"></loadingBottom>
    </div>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight } from "@element-plus/icons-vue";
import { getStickerList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/image.vue";

import {
    currentModelController,
    showImageUplaod,
    viewDisplayController,
} from "@/components/design/store";
import { initDraggableElement } from "@/components/design/utils/draggable";
import { imgToFile, createImgObjectURL, imgToBase64 } from "@/common/transform/index";
import { MoreFilled } from "@element-plus/icons-vue";
import { useLoadingOptions } from "@/components/loading/index.tsx";
import scrollbar from "@/components/scrollbar/index.vue";

import { loadingBottom } from "@/components/loading/index.tsx";
import { currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import Utils from '@/common/utils'
import Api from '@/api'
import { s1Confirm } from '@/common/message'
import { message } from 'ant-design-vue'

// 列表展示几列
const column = ref(4);

const loadingOptions = useLoadingOptions({});

const { list, getList, loading, reset, firstLoading, subsequentLoading } = usePaging(
    (params) => {
        return Api.getFileListApi({
            ...params,
            pageSize: 20,
            type: 'ttf,otf',
            myUploads: true
        });
    },
);

async function deleteItem(item) {

    await s1Confirm({
        content: '确认删除该字体？'
    })

    await Api.deleteFile(item.id)
    reset()
    await getList()
    message.success('删除成功')
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

.endofpage {
    width: 100%;
    text-align: center;
    height: 36px;
    line-height: 36px;
    color: #aaa;
}

.timeage{
    font-size: .9rem;
    color: #999;
    font-weight: bold;
}
</style>
