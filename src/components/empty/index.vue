<template>
    <div class="s1-empty">
        <el-empty :image="image" :image-size="82" v-bind="$attrs">
            <slot></slot>
            <template #description>
                <slot name="description"></slot>
            </template>
        </el-empty>
    </div>
</template>
    
<script setup lang='ts'>

const image = '/components/empty.svg'

</script>
    
<style lang="less">
.s1-empty {
    font-size: 1rem;
    .el-empty {
        --el-empty-padding: 12px  24px!important;
        --el-empty-bottom-margin-top:8px;
    }

    .el-empty__description {
        --el-empty-description-margin-top: 12px !important;
    }
}
</style>