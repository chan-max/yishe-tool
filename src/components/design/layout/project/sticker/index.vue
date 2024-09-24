<template>
    <div v-infinite-scroll="getList" :infinite-scroll-distance="150">
        <el-row style="row-gap: 8px;width:1000px;">
            <el-col :span="24 / column" v-for="item in list" align="center">
                <div style="width:100%;height:100%;flex-shrink: 0;" class="flex flex-col items-center justify-center">
                    <s1-img padding="5%" :src="item.thumbnail" @click="itemClick(item)"
                        style="background:#f6f6f6!important;width:240px;height:180px;border-radius: 8px;">
                        <s1-icon v-if="item.uploader.isAdmin" name="official-badge" style="position: absolute;right:5%;top:5%;opacity:.8;" :size="18"></s1-icon>

                    </s1-img>
                    <div class="bar flex items-center justify-between">
                        <div class="text-ellipsis" style="max-width:80px;"> {{ item.name || '未命名' }} </div>
                        <div class="label-tag" v-if="item.isPublic"> 已共享 </div>
                        <div class="label-tag" v-if="item.uploader.account == loginStore.userInfo?.account"> 我 </div>
                        <div class="timeago"> {{ Utils.time.timeago(item.updateTime) }} </div>
                        <div style="flex:1;"></div>

                        <a-dropdown trigger="click">
                            <el-button link>
                                <el-icon>
                                    <MoreFilled />
                                </el-icon>
                            </el-button>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="edit(item)">
                                        编辑
                                    </a-menu-item>
                                    <a-menu-item @click="useSticker(item)">
                                        在工作台使用
                                    </a-menu-item>
                                    <!-- <a-menu-item @click="editStickerInWorkspace(item)">
                                        在工作台中编辑
                                    </a-menu-item> -->
                                    <a-menu-item @click="setOfficialTemplate(item)">
                                         设置为样例模版
                                    </a-menu-item>
                                    <a-menu-item @click="deleteItem(item)">
                                        <span style="color:var(--el-color-danger)">删除</span>
                                    </a-menu-item>
                                    <a-menu-item>
                                        分享给好友
                                    </a-menu-item>
                                    <a-menu-item>
                                        发布
                                    </a-menu-item>
                                    <a-menu-item v-if="item.type == 'image'" @click="download(item)">
                                        下载源文件
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </div>
            </el-col>
        </el-row>
        <loadingBottom v-if="loading"></loadingBottom>
        <div class="endofpage" v-if="isLastPage"> 到底了~ </div>
        <s1-empty v-if="isEmpty">
            <template #description>
                暂无模型
            </template>
        </s1-empty>
    </div>




    <a-modal v-model:open="showFormModal" :centered="true" :destroyOnClose="true" width="540px" title="更新信息" okText="修改"
        cancelText="取消" @ok="ok" :confirmLoading="submitLoading">
        <el-form style="padding:24px 12px;">
            <el-form-item> <el-input v-model="editForm.name"></el-input></el-form-item>
            <el-form-item> <el-input v-model="editForm.description"></el-input></el-form-item>
            <el-form-item>
                <tagsInput v-model="editForm.keywords" :string="true"> </tagsInput>
            </el-form-item>
        </el-form>
    </a-modal>
</template>

<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold, Operation, ArrowRight, MoreFilled } from "@element-plus/icons-vue";
import { getStickerList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/image.vue";
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
import { message, Modal } from "ant-design-vue";
import { s1Confirm } from '@/common/message'
import Api from '@/api'
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import { useStickerDetailModal } from './stickerModal.ts'
import { useLoginStatusStore } from "@/store/stores/login";
const loginStore = useLoginStatusStore()


// 列表展示几列
const column = ref(4);

const loadingOptions = useLoadingOptions({});

const { list, getList, loading, reset, firstLoading, subsequentLoading, isLastPage, currentPage, totalPage,isEmpty } = usePaging(
    (params) => {
        return getStickerList({
            ...params,
            pageSize: 20,
            // myUploads: true
        });
    },
);


function useSticker(item) {
    canvasStickerOptions.value = item.meta.data
    message.success('引用成功')
}

async function deleteItem(item) {
    await s1Confirm({
        content: '确认删除该贴纸吗？'
    })
    await Api.deleteItem(item.id)
    reset()
    await getList()
    message.success('删除成功')
}

function download(item) {
    Api.downloadCOSFile(item.url)
}

const currentItem = ref({})

const showFormModal = ref(false)

const submitLoading = ref(false)
const editForm = ref({} as any)
// 编辑
function edit(item) {
    editForm.value = {
        id: item.id,
        description: item.description,
        name: item.name,
        keywords: item.keywords
    }
    showFormModal.value = true
    currentItem.value = item
}

async function ok() {
    submitLoading.value = true
    let res = await Api.updateSticker(editForm.value)
    message.success('修改成功')
    submitLoading.value = false
    let ind = list.value.indexOf(currentItem.value,)
    list.value[ind] = res
}


const { open } = useStickerDetailModal()

function itemClick(item) {
    currentItem.value = item
    open(item)
}


/**
 * @method 设置为官方模版
*/

function setOfficialTemplate(item){
    
}


/**
 * @method 在工作台中编辑
*/
function editStickerInWorkspace(item){

}
</script>



<style scoped lang="less">
.bar {
    width: 100%;
    height: 36px;
    padding: 0 1rem;
    column-gap: 1rem;
}

.label-tag {
    background-color: #ccc;
    color: #fff;
    border-radius: 2px;
    padding: 1px 2px;
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

.timeago {
    font-size: .9rem;
    color: #999;
    font-weight: bold;
}
</style>
