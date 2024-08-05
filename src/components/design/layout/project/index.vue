<template>
        <a-row style="height:600px;margin:12px;">
                <a-col :span="3">
                        <el-tabs v-model="activeKey" tab-position="left" style="height: 400px">
                                <el-tab-pane v-for="tab, i in tabs" :label="tab.label" :name="tab.key"></el-tab-pane>
                        </el-tabs>
                </a-col>
                <a-col :span="21">
                        <a-row style="height:48px;" align="top">
                                <a-input v-model:value="searchText" style="width:240px;" placeholder="快速搜索">
                                        <template #prefix>
                                                <SearchOutlined />
                                        </template>
                                </a-input>
                        </a-row>
                        <div style="height:calc(600px - 48px); width:900px;overflow:auto;">
                                <!-- <a-row justify="center" :gutter="[12, 12]">
                                        <a-col v-for="item in 1000" :span="6">
                                                <div class="item">
                                                        {{ activeKey }}
                                                </div>
                                        </a-col>
                                </a-row> -->
                                <component :is="activeComponent"></component>
                        </div>
                </a-col>
        </a-row>
</template>
<script lang="ts" setup>
import { ref, computed,toRaw } from 'vue';

import { SearchOutlined } from '@ant-design/icons-vue'
import tabImage from './image.vue'
import tabSticker from './sticker.vue'
import tabFont from './tabFont.vue'
const searchText = ref('')


enum UserOwnSourceType {
        CUSTOM_MODEL = 'customModel',
        STICKER = 'sticker',
        IMAGE = 'image',
        FONT = '_font',
        COLLECT = 'collect',
        LIKED = 'liked',
}

const activeKey = ref(UserOwnSourceType.STICKER)

const activeComponent = computed(() => {
        return toRaw(tabs.value.find((item) => item.key == activeKey.value).component)
})

const tabs = ref([
        {
                label: '最近',
                key: 'recent'
        },
        {
                label: '设计模型',
                key: 'customModel',
                component:tabImage
        },
        {
                label: '我的贴纸',
                key: 'sticker',
                component: tabSticker
        },
        {
                label: '图片',
                key: 'image',
                component: tabImage
        },
        {
                label: '字体',
                key: UserOwnSourceType.FONT,
                component:tabFont
        },
        {
                label: '我的收藏',
                key: 'collect'
        },
        {
                label: '我的喜欢',
                key: 'liked'
        },
])



</script>
<style lang="less" scoped>
.item {
        background: red;
        width: 100%;
        height: 160px;
        border-radius: 8px;
        background-color: #f5f5f5;

        &:hover {
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        }
}

:deep(.el-tabs__item) {
        font-weight: 400;
}
</style>
