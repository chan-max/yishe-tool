<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 个性字体 </template>
        <template #content>
            <el-select ref="selectRef" v-model="model" size="small" placeholder="请选择" filterable clearable remote
                :remote-method="remoteMethod" style="width:120px" :loading="loading">
                <template #label="{ label }">
                    {{ model.name }}
                </template>

                <template #empty>
                    <s1-empty v-if="!loading">
                        <template #description>
                            <p>
                                无相关字体，尝试使用关键字或相关描述查找
                            </p>
                        </template>
                        <el-button type="primary" size="small" plain round @click="emitUpload"> 快速上传 </el-button>
                    </s1-empty>
                </template>
                <template v-for="item in list" :key="item.id">
                    <el-option v-if="!item.hide" :label="item.name" :value="item">
                        <div>
                            <desimage :src="item.thumbnail" style="width: 240px; height: 32px"></desimage>
                        </div>

                    </el-option>
                </template>
            </el-select>
            <el-button size="small" @click="showFontModal = true">
                字体库
            </el-button>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/font-family.svg?component";
import { ref, onBeforeMount, watch, computed } from "vue";
import { getFontListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/image.vue";
import Utils from '@/common/utils'
import { fetchFontFaceWithMessage } from './index.ts'
import { showUpload } from '@/components/design/store'
import { GlobalConst } from '@/types/index.ts'
import { useDebounceFn } from "@vueuse/core";
import { TopRight } from '@element-plus/icons-vue'
import { showFontModal } from '@/components/design/store'

const model = defineModel({});

const selectRef = ref()

function emitUpload() {
    selectRef.value.toggleMenu(false)
    showUpload.value = true
}


function resetSearchInput() {
    reset()
    getList()
}

/**
 * */
const emits = defineEmits(['font-load'])


watch(model, async () => {
    let info: any = model.value;
    if (!info) {
        return;
    }
    const { url, id, name } = info;

    await fetchFontFaceWithMessage(info)

    emits('font-load')
}, {
    immediate: true
});


const remoteMethod = useDebounceFn(function (val) {
    reset()
    getList({
        match: val
    })
}, 333)



// 字体列表
const { list, getList, reset, loading } = usePaging(
    (params) => {
        return getFontListApi({
            ...params,
            pageSize: 999,
        });
    },
    {
        immediate: false,
        forEach(item) {
            item.thumbnail = Utils.formatUrl(item.thumbnail)
            item.url = Utils.formatUrl(item.url)
        },
    }
);
</script>

<style></style>