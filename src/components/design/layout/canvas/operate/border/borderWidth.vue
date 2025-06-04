<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> 边框尺寸 </template>
        <template #content>
            <el-popover trigger="click" width="180" popper-class="el-popover-operation">
                <template #reference>
                    <el-input  style="width:80px" v-model="model.value" size="small" min="0" step="1" type="number">
                        <template #suffix>
                            <div style="font-size:1rem;"> {{ model.unit }}
                            </div>
                        </template>
                    </el-input>
                </template>
                <el-row align="middle" justify="end">
                    <el-col :span="24">
                        <el-radio-group v-model="model.unit" size="small">
                            <el-radio v-for="u in unitOptions" :value="u.value">
                                <span style="font-size: 1rem;">{{ u.label }}</span>
                            </el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </el-popover>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/border-width.svg?component";
import { ref ,computed} from 'vue'
import { canvasStickerOptions,canvasStickerOptionsOnlyChild } from "@/components/design/layout/canvas/index.tsx";

const props = defineProps({
    tooltip: {
        default: ''
    },
})

const unitOptions = computed(() => {
    return [
        {
            label: `使用当前画布单位(${canvasStickerOptionsOnlyChild.value.width.unit})`,
            value: canvasStickerOptionsOnlyChild.value.width.unit,
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


const model = defineModel({})

</script>
  
<style></style>
  