<template>
    <div class="bar flex items-center justify-between">
        <a-button type="text" size="small" @click="showWorkspace = !showWorkspace">
            <template #icon>
                <DesktopOutlined />
            </template>
            工作台
        </a-button>

        <a-button type="text" size="small" @click="showDecalList = !showDecalList">
            <template #icon>
                <OrderedListOutlined />
            </template>
            已引用贴纸 ({{ decals }})
        </a-button>
        <div style="flex:1"></div>
    </div>
</template>
    
<script setup lang='ts'>
import { DesktopOutlined ,OrderedListOutlined} from '@ant-design/icons-vue'
import { currentModelController, showWorkspace, showDecalList } from '@/components/design/store'
import { computed } from 'vue'

const decals = computed(() => {
    return currentModelController.value.decalControllers.length
})

</script>
    
<style scoped lang="less">
.bar {
    // margin: 1rem;
    width: 100%;
    height: 40px;
    background: #fff;
    padding: 0 2rem;
    // box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
</style>