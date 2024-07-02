<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <el-tooltip placee :content="tooltip" :disabled="!tooltip" placement="top">
            <div class="flex justify-between">
                <el-popover trigger="hover" width="200">
                    <template #reference>
                        <el-button size="small" link style="margin-right:4px;">
                            <el-icon size="16">
                                <Setting></Setting>
                            </el-icon>
                        </el-button>
                    </template>
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
                </el-popover>

                <el-popover trigger="hover" width="200">
                    <template #reference>
                        <el-input style="width: 88px" size="small" v-model="width.value" step="10" type="number"
                            placeholder="宽">
                            <template #suffix>
                                <div style="font-size:1rem;">{{ width.unit}}</div>
                            </template>
                        </el-input>
                    </template>
                    <el-row align="middle" justify="end">
                        <el-col :span="24">
                            <el-radio-group v-model="width.unit" size="small">
                                <el-radio v-for="u, index in unitOptions" :value="u.value" :key="index">
                                    <span style="font-size: 1rem;">{{ u.label }}</span>
                                </el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </el-popover>

                <span style="padding:0 1rem;" class="flex items-center justify-center">x</span>
      
                <el-popover trigger="hover" width="200">
                    <template #reference>
                        <el-input style="width: 88px" size="small" v-model="height.value" step="10" type="number" placeholder="高">
                            <template #suffix>
                                <div style="font-size:1rem;">{{ height.unit }}</div>
                            </template>
                        </el-input>
                    </template>
                    <el-row align="middle" justify="end">
                        <el-col :span="24">
                            <el-radio-group v-model="height.unit" size="small">
                                <el-radio v-for="u, index in unitOptions" :value="u.value" :key="index">
                                    <span style="font-size: 1rem;">{{ u.label }}</span>
                                </el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </el-popover>
            </div>
        </el-tooltip>
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
    },
    unit: {
        default: 'px'
    },
    tooltip:{

    },
    mode: {
        default: "number",  // number | % | all  数字模式和百分比模式
    },
    units: {
        default: ['px', 'vw','vh']
    },
});




const unitOptions = computed(() => {
    return props.units.map((u) => {
        if (u == 'px') {
            return {
                label: '像素值',
                value: 'px',
            }
        }

        if (u == 'vw') {
            return {
                label: '主画布宽度的百分比',
                value: 'vw',
            }
        }

        if (u == 'vh') {
            return {
                label: '主画布高度的百分比',
                value: 'vh',
            }
        }
    })
})


const width = defineModel("width", {});
const height = defineModel("height", {});



// 存在绑定 bug
const unitBind = ref()

watch(unitBind, (val) => [
    unit.value = val
])

const unit = defineModel("unit", {
    default: 'px'
});

watch(unit, (val) => [
    unitBind.value = val
], {
    immediate: true
})

const aspectRatio = defineModel("aspectRatio", {});



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

<style scoped lang="less"></style>
