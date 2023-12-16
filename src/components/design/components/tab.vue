
<template >
    <div class="designiy-tab" >
        <div v-for="item in items" @click="click(item)" :class="(item ===activeTab) && 'designiy-tab-item-focus'" class="designiy-tab-item"> {{ item }} </div>
    </div>
</template>
<script setup>
import { defineProps,ref } from 'vue';
const props = defineProps(['modelValue','items'])
const emits = defineEmits(['update:modelValue'])

// 默认第一条
const activeTab = ref(props.items[0])

function click(item) {
    activeTab.value = item
    emits('update:modelValue',item)
}

</script>
<style lang="less">
    .designiy-tab{
        width:100%;
        display: flex;
        column-gap: 10px;
        border-bottom: 1px solid #eee;
        padding:  0 10px;
        padding-top:20px;
    }

    .designiy-tab-item{
        font-size: 12px;
        display: flex;
        align-items: center;
        padding: 6px;
        border-bottom: 1px solid transparent;
        cursor: pointer;
        color: #777;
    }

    .designiy-tab-item-focus{
        color: #333;
        border-bottom: 1px solid #555;
    }
</style>