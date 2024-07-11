<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 纠错等级 </template>
        <template #content>
            <el-tooltip content="纠错等级越高，二维码在损坏的情况下扫描成功率越高" :hide-after="0">
                <el-select v-model="model" size="small" placeholder="" style="width:120px">
                    <template #label="{label}">
                        <div style="font-size: 1rem;">    {{ label }}</div>
                    </template>
                    <el-option v-for="item in errorCorrectionLevelOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                        <span> {{ item.label }}</span>
                    </el-option>
                </el-select>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import icon from "@/components/design/assets/icon/error-level.svg?component";

const model = defineModel({})

const errorCorrectionLevelOptions = reactive([
    {
        value: 'L',
        label: "L(低)",
    },
    {
        value: "M",
        label: "M(中)",
    },
    {
        value: "Q",
        label: "Q(较高)",
    },
    {
        value: "H",
        label: "H(高)",
    }
]);

</script>

<style></style>
