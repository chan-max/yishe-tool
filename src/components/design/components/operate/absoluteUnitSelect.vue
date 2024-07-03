<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <el-select v-model="model" size="small" style="width: 88px">
                <template #label="{ value }">
                    {{ value }}
                </template>
                <el-option v-for="item in absoluteSizeOptions" :key="item.value" :label="item.label" :value="item.value">
                    <span> {{ item.label }} </span>
                </el-option>
            </el-select>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import icon from "@/components/design/assets/icon/unit.svg?component";

const props = defineProps({
    label: {
        default: '尺寸单位'
    }
})

const model = defineModel({
})

const absoluteSizeOptions = reactive([
    {
        value: "px",
        label: "px 像素",
    },
    {
        value: "mm",
        label: "mm 毫米",
    },
    {
        value: "cm",
        label: "cm 厘米",
    },
    {
        value: "in",
        label: "in 英寸（1英寸 ～= 2.54厘米）",
    },
]);

</script>

<style></style>
