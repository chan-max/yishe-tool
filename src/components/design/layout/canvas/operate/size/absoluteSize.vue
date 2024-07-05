<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <div class="flex justify-between">
                <el-popover trigger="hover" width="200">
                    <template #reference>
                        <el-button size="small" link style="margin-right:.6em;">
                            <el-icon size="16">
                                <Setting></Setting>
                            </el-icon>
                        </el-button>
                    </template>
                    <div>
                        <el-row style="padding:.5em 0">
                            <el-col :span="24">
                                <div class="flex flex-wrap " style="gap:1em;">
                                    <el-tag size="small" style="cursor:pointer;" effect="plain"
                                        v-for="item in aspectRatioOptions" @click="selectAsepctRatio(item.value)">
                                        <div style="font-size: 1rem;">
                                            {{
                                                item.label }}
                                        </div>
                                    </el-tag>
                                    <div style="flex: 1"></div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-popover>
                <el-input style="width: 88px" size="small" v-model="width" step="10" type="number" placeholder="宽">
                </el-input>
                <span style="padding:0 1em" class="flex items-center justify-center">x</span>
                <el-input style="width: 88px" size="small" v-model="height" step="10" type="number" placeholder="高">
                </el-input>
            </div>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/size.svg?component";
import { ref, watch, computed } from "vue";
import { Setting } from "@element-plus/icons-vue";

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
