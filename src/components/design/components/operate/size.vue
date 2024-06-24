<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <el-popover :show-arrow="false" trigger="hover">
                <template #reference>
                    <div v-if="mode == 'number'">
                        <el-input style="width: 72px" size="small" v-model="width" step="10" min="100" type="number"
                            placeholder="宽"></el-input>
                        <span style="margin: 0 1em">x</span>
                        <el-input style="width: 72px" size="small" v-model="height" step="10" min="100" type="number"
                            placeholder="高"></el-input>
                    </div>
                    <div v-if="mode == 'percent'">
                        <el-input style="width: 72px" size="small" v-model="width" step="1" min="0" max="100" type="number"
                            placeholder="宽"></el-input>
                        <span style="margin: 0 0.4em">%</span>
                        <span style="margin: 0 0.4em"></span>
                        <el-input style="width: 72px" size="small" v-model="height" step="1" min="0" max="100" type="number"
                            placeholder="高"></el-input>
                        <span style="margin: 0 0.4em">%</span>
                    </div>
                </template>
                <div style="display: flex; gap: 1em; flex-wrap: wrap">
                    <el-tag style="cursor: pointer" v-for="item in aspectRatioOptions" @click="selectAsepctRatio(item.value)">{{
                        item.label }}</el-tag>
                    <div style="flex: 1"></div>
                </div>
            </el-popover>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/size.svg?component";
import { ref, watch } from "vue";

const props = defineProps({
    label: {
        default: "尺寸",
    },
    mode: {
        default: "number", // number | percent 数字模式和百分比模式
    },
});

const width = defineModel("width", { default: 1000 });
const height = defineModel("height", { default: 1000 });
const aspectRatio = defineModel("aspectRatio", { default: 1 });

// 保留两位小数
function toFixed0(val): any {
    return parseFloat(val).toFixed(3);
}

watch(width, (val) => {
    updateAspectRatio();
});

watch(height, (val) => {
    updateAspectRatio();
});

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

<style></style>
