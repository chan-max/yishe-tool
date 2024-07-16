<template>
        <a-row style="height:600px;width:1080px;margin:12px;">
                <a-col :span="4">
                        <a-tabs size="small" v-model:activeKey="activeKey" tab-position="left">
                                <a-tab-pane v-for="tab, i in tabs" :key="i">
                                        <template #tab>
                                                {{ tab.label }}
                                        </template>
                                </a-tab-pane>
                        </a-tabs>
                </a-col>
                <a-col :span="20">
                        <a-row style="height:48px;" align="top">
                                <a-input v-model:value="searchText" style="width:240px;" placeholder="快速搜索">
                                        <template #prefix>
                                                <SearchOutlined />
                                        </template>
                                </a-input>
                        </a-row>
                        <a-row justify="center" style="height:calc(600px - 48px);overflow:auto;" :gutter="[12, 12]">

                                <a-col v-for="item in 1000" :span="6">
                                        <div class="item">

                                        </div>
                                </a-col>
                        </a-row>
                </a-col>
        </a-row>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { viewDisplayController } from '@/components/design/store'
import content from './content.vue'
import { SearchOutlined } from '@ant-design/icons-vue'
const searchText = ref('')


const tabs = ref([
        {
                label: '最近'
        },
        {
                label: '设计模型'
        },
        {
                label: '草稿箱'
        },
        {
                label: '我上传的'
        },
])

const activeKey = ref()

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
</style>
