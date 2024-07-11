<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 二维码点类型 </template>
        <template #content>
            <el-tooltip content="二维码类型" :hide-after="0">
                <el-select v-model="model" size="small" placeholder="" style="width:120px">
                    <template #label="{ label}">
                        <div style="font-size: 1rem;">    {{ label }}</div>
                    </template>
                    <el-option v-for="item in qrcodeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                        <span> {{ item.label }}</span>
                    </el-option>
                </el-select>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import icon from "@/components/design/assets/icon/qrcode-type.svg?component";

const model = defineModel({})

const qrcodeTypeOptions = reactive([
    {
        value: "square",
        label: "方块形（常规类型）",
        displayLabel:'21312'
    },
    {
        value: "dots",
        label: "圆点类型",
    },
    {
        value: 'rounded',
        label: "圆角类型",
    },
    {
        value: 'extra-rounded',
        label: "圆角类型(圆角更大)",
    },

    {
        value: "classy",
        label: "大圆角",
    },
    {
        value: "classy-rounded",
        label: "更大的圆角",
    }
]);

</script>

<style></style>
