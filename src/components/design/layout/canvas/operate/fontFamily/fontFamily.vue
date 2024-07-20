<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 个性字体</template>
        <template #content>
            <el-select v-model="model" size="small" filterable clearable :filter-method="filter" style="width:180px">
                <el-option-group label="网络字体">
                    <template v-for="item in list" :key="item.id">
                        <el-option v-if="!item.hide" :label="item.name" :value="item">
                            <desimage :src="item.thumbnail" style="width: 240px; height: 32px"></desimage>
                        </el-option>
                    </template>
                </el-option-group>
            </el-select>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/font-family.svg?component";
import { ref, onBeforeMount, watch } from "vue";
import { getFontListApi, fetchFile } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";
import { cacheFontFamily } from "@/components/design/store";
import { message } from "ant-design-vue";
import Utils from '@/common/utils'
import { initFontFamilyInfo, initFontFamilyInfoWithMessage } from './index.ts'

const model = defineModel({});

const emits = defineEmits(['font-load'])

function filter(key) {
    list.value?.forEach((item) => {
        item.hide = !item.name.includes(key)
    });
}

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


// 字体列表
const { list, getList } = usePaging(
    (params) => {
        return getFontListApi({
            ...params,
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

<style></style>