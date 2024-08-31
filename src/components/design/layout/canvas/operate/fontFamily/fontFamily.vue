<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 个性字体</template>
        <template #content>
            <el-select v-model="model" size="small" placeholder="请选择" filterable clearable remote
                :remote-method="remoteMethod" style="width:120px" :loading="loading">
                <template #label="{ label }">
                    {{ model.name }}
                </template>

                <template #empty>
                    <span style="font-size:1rem;"> 无相关字体 , 去上传</span>
                </template>
                <!-- <el-option-group label="网络字体"> -->
                <template v-for="item in list" :key="item.id">
                    <el-option v-if="!item.hide" :label="item.name" :value="item">
                        <desimage :src="item.thumbnail" style="width: 240px; height: 32px"></desimage>
                    </el-option>
                </template>
                <!-- </el-option-group> -->
            </el-select>
            <el-button size="small">
                字体库
            </el-button>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/font-family.svg?component";
import { ref, onBeforeMount, watch } from "vue";
import { getFontListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";
import Utils from '@/common/utils'
import { initFontFamilyInfoWithMessage } from './index.ts'

const model = defineModel({});

/**
 * */
const emits = defineEmits(['font-load'])


watch(model, async () => {
    let info: any = model.value;
    if (!info) {
        return;
    }
    const { url, id, name } = info;

    await initFontFamilyInfoWithMessage(info)

    emits('font-load')
}, {
    immediate: true
});



function remoteMethod(val) {
    reset()
    getList({
        match: val
    })
}

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