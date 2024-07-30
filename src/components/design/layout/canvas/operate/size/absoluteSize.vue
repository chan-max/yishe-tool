<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <span style="font-size:1rem"> 宽 </span>
            <el-input style="width: 80px" size="small" v-model="width" step="10"  placeholder="宽" type="number">
                <template #suffix>
                    <span class="text-[1rem]">  
                        {{ canvasStickerOptions.unit }}
                    </span>
                </template>
            </el-input>
            <span style="font-size:1rem"> 高 </span>
            <el-input style="width: 80px" size="small" v-model="height" step="10"  placeholder="高" type="number">
                <template #suffix>
                    <span class="text-[1rem]">  
                        {{ canvasStickerOptions.unit }}
                    </span>
                </template>
            </el-input>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/size.svg?component";
import { ref, watch, computed } from "vue";
import { Setting } from "@element-plus/icons-vue";
import {canvasStickerOptions} from '@/components/design/layout/canvas/index.tsx'

const props = defineProps({
    label: {
        default: "尺寸",
    }
});

const width = defineModel("width", {});
const height = defineModel("height", {});

const unit = defineModel("unit", {
    default: 'px'
});

const aspectRatio = defineModel("aspectRatio", {});



// 保留两位小数
function toFixed0(val): any {
    return parseFloat(val).toFixed(3);
}


function selectAsepctRatio(val) {
    aspectRatio.value = val
    height.value = toFixed0(width.value / val)
}

function updateAspectRatio() {
    aspectRatio.value = toFixed0(width.value / height.value);
}

const aspectRatioOptions = ref([
    {
        label: "等宽高(1 : 1)",
        value: "1",
    },
    {
        label: "16 : 9",
        value: 16 / 9,
    },
    {
        label: "黄金比(1.618 : 1)",
        value: 1.618 / 1,
    },
    {
        label: "银比例(1 : √2)",
        value: 1 / Math.sqrt(2),
    },
    {
        label: "4 : 3",
        value: 4 / 3,
    },
    {
        label: "16 : 9",
        value: 16 / 9,
    },
]);
</script>

<style scoped lang="less"></style>
