<template>
    <a-modal v-bind="$attrs" v-model:open="showOfficialTempalteModal" :footer="null" :centered="true" :destroyOnClose="true"
        style="min-width:1080px;" title="模版">
        <div style="padding:1rem;">
            <a-tabs class="off-template-tab" v-model:activeKey="activeOfficialStickerTab" tab-position="left"
                @change="tabChange" :style="{ height: '480px' }">
                <a-tab-pane v-for="item in officialStickerTemplateOptions" :key="item.value" :tab="item.label">
                    <div style="height:480px;width:100%; overflow:auto;padding:20px;" v-infinite-scroll="getList"
                        :infinite-scroll-distance="150">

                        <el-row>
                            <el-col :span="4" v-for="item in list">
                                <div style="margin:20px;">
                                    <s1-img :src="item.thumbnail"></s1-img>
                                </div>
                            </el-col>
                        </el-row>

                        <s1-loadingBottom v-if="loading"></s1-loadingBottom>
                        <s1-empty v-if="isEmpty">
                            <template #description>
                                暂无结果
                            </template>
                        </s1-empty>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-modal>
</template>

<script setup lang='ts'>
import { showOfficialTempalteModal } from './index.tsx'
import { ref } from 'vue'
import { officialStickerTemplateOptions } from './index.tsx'
import { getStickerList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";


const activeOfficialStickerTab = ref(officialStickerTemplateOptions[0].value)


const { list, getList, loading, reset, firstLoading, subsequentLoading, isLastPage, currentPage, totalPage, isEmpty, } = usePaging(
    (params) => {
        return getStickerList({
            ...params,
            pageSize: 20,
            group: activeOfficialStickerTab.value
        });
    },
);


function tabChange() {
    reset()
    getList()
}

</script>

<style  lang="less">
.off-template-tab {
    .ant-tabs-tab {
        padding-right: 20px !important;
    }

    .ant-tabs-tab-btn {
        width: 100%;
        text-align: right;
    }
}
</style>