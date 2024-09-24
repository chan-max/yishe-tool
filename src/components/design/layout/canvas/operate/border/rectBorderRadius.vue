<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 圆角尺寸 </template>
        <template #content>
            <div class="flex items-center" style="column-gap:1rem;">
                <span>水平</span>
                <el-popover  width="180" trigger="click" popper-class="el-popover-operation">
                    <template #reference>
                        <el-input size="small"  min="0" step="1"
                            type="number"
                        style="width:80px;"
                            v-model.number="model.horizontal.value">
                            <template #suffix>
                                <div style="font-size:1rem;"> {{ model.horizontal.unit }}
                                </div>
                            </template>
                        </el-input>
                    </template>

                    <el-row align="middle" justify="end">
                        <el-col :span="24">
                            <el-radio-group v-model="model.horizontal.unit" size="small">
                                <el-radio v-for="u in unitOptions" :value="u.value">
                                    <span style="font-size: 1rem;">{{ u.label }}</span>
                                </el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </el-popover>
                <span>垂直</span>
                <el-popover  width="180" trigger="click" popper-class="el-popover-operation">
                    <template #reference>
                        <el-input size="small"  min="0" step="1"
                            type="number"
                            style="width:80px;"
                            v-model.number="model.vertical.value">
                            <template #suffix>
                                <div style="font-size:1rem;"> {{ model.vertical.unit }}
                                </div>
                            </template>
                        </el-input>
                    </template>

                    <el-row align="middle" justify="end">
                        <el-col :span="24">
                            <el-radio-group v-model="model.vertical.unit" size="small">
                                <el-radio v-for="u in unitOptions" :value="u.value">
                                    <span style="font-size: 1rem;">{{ u.label }}</span>
                                </el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </el-popover>
            </div>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/border-radius.svg?component";
import { ref, computed } from 'vue'
import { canvasStickerOptions } from "@/components/design/layout/canvas/index.tsx";


/*
    矩形的圆角尺寸 ， 只能统一设置，并且设置水平和垂直方向的圆角
*/

const model = defineModel({
    default: {
        horizontal: {
            value: 0,
            unit: 'px'
        },
        vertical: {
            value: 0,
            unit: 'px'
        },
    }
})


const props = defineProps({
    tooltip: {
        default: ''
    },
})

const unitOptions = computed(() => {
    return [
        {
            label: `使用当前画布单位(${canvasStickerOptions.value.unit})`,
            value: canvasStickerOptions.value.unit,
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
    ]
});


</script>
  
<style></style>
  