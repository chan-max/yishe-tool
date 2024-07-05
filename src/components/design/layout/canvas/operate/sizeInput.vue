<template>
    <el-popover :placement="placement" width="180">
        <template #reference>
            <div class="size-input">
                <el-input style="width:80px" :placeholder="placeholder" size="small" type="number" min="0" step="1" v-model.number="model">
                    <template #suffix>
                        <span style="font-size: 1rem;">
                            {{ unit }}
                        </span>
                    </template>
                </el-input>
            </div>
        </template>
        <el-row align="middle" justify="end">
            <el-col :span="24">
                <el-radio-group v-model="unit" size="small">
                    <el-radio v-for="(u, index) in unitOptions" :value="u.value">
                        <div style="font-size: 1rem;">{{ u.label }}</div>
                    </el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
    </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";

/*
 带有单位选择弹层的输入框
*/

const props = defineProps({
    units: {
        default: ['px', 'vw', 'vh', '%w', '%h','cm','mm','in']
    },
    placeholder:{
        default:''
    },
    placement:{
    },
})

const model = defineModel({})
const unit = defineModel('unit', {
    default:'px'
})



const rawUnitOptions = ref([
    {
        label: "像素值",
        value: "px",
    },
    {
        label: "相对于画布宽的百分比",
        value: "vw",
    },
    {
        label: "相对于画布高的百分比",
        value: "vh",
    },
    {
        label: "相对于当前元素宽的百分比",
        value: "%w",
    },
    {
        label: "相对于当前元素高的百分比",
        value: "%h",
    },
    {
        label: "厘米",
        value: "cm",
    },
    {
        label: "毫米",
        value: "mm",
    },
    {
        label: "英寸 (1英寸 ~= 2.54厘米)",
        value: "in",
    },
]);



const unitOptions = computed(() => {
    return props.units.map((unit) => {
        return rawUnitOptions.value.find((item) => item.value == unit)
    })
})
</script>

<style scoped lang="less">
.size-input {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: end;

    :deep(.el-input) {
        width: 48px;
    }
}
</style>
