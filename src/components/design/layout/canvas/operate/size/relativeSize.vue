<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <span style="font-size: 1rem;">宽</span>

            <el-popover trigger="hover" width="200" popper-class="el-popover-operation">
                <template #reference>
                    <el-input style="width: 80px" size="small" v-model="width.value" step="10" 
                        placeholder="宽">
                        <template #suffix>
                            <div style="font-size:1rem;">{{ width.unit }}</div>
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

            <span style="font-size: 1rem;">高</span>

            <el-popover trigger="hover" width="200" popper-class="el-popover-operation">
                <template #reference>
                    <el-input style="width: 80px" size="small" v-model="height.value" step="10" 
                        placeholder="高">
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
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/size.svg?component";
import { ref, watch, computed } from "vue";
import { Setting } from "@element-plus/icons-vue";
import { canvasStickerOptions } from "@/components/design/layout/canvas/index.tsx";



const props = defineProps({
    label: {
        default: "尺寸",
    },
    unit: {
        default: 'px'
    },
});


const unitOptions = computed(() => {

    let currentUnit = canvasStickerOptions.value.unit

    const options = [
        {
            label: `使用当前画布单位(${currentUnit})`,
            value: currentUnit,
        },
        {
            label: '画布宽度的百分比',
            value: 'vw',
        },
        {
            label: '画布高度的百分比',
            value: 'vh',
        }
    ]

    return options
})


const width: any = defineModel("width", {});
const height: any = defineModel("height", {});


</script>

<style scoped lang="less"></style>
