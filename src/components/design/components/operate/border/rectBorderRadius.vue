<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> 圆角尺寸 </template>
        <template #content>
            <div class="flex items-center" style="column-gap:1rem;">
                <span>水平</span>
                <size-input v-model="model.horizontal.value" v-model:unit="model.horizontal.unit"></size-input>
                <span>垂直</span>
                <size-input  v-model="model.vertical.value" v-model:unit="model.vertical.unit"></size-input>
            </div>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/border-radius.svg?component";
import sizeInput from '../sizeInput.vue'
import { ref } from 'vue'

/*
    矩形的圆角尺寸 ， 只能统一设置，并且设置水平和垂直方向的圆角
*/

const model = defineModel({
    default:{
        horizontal:{
            value:0,
            unit:'px'
        },
        vertical:{
            value:0,
            unit:'px'
        },
    }
})


const props = defineProps({
    tooltip: {
        default: ''
    },
})

const unitOptions = ref([{
    label: '像素值',
    value: 'px',
}, {
    label: '画布宽度百分比',
    value: 'vw',
}, {
    label: '画布高度度百分比',
    value: 'vh',
}])


</script>
  
<style></style>
  