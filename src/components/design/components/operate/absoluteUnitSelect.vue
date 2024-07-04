<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <el-select @change="change" v-model="model" size="small" style="width: 88px">
                <template #label="{ value }">
                    {{ value }}
                </template>
                <el-option  v-for="item in absoluteSizeOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                    <span> {{ item.label }} </span>
                </el-option>
            </el-select>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import { ref, reactive,watch } from 'vue'
import icon from "@/components/design/assets/icon/unit.svg?component";
import { canvasOptions } from '@/components/design/layout/canvas/index.tsx';
const props = defineProps({
    label: {
        default: '尺寸单位'
    }
})

watch(canvasOptions,() => {
    console.log(canvasOptions.value)
})

const emits = defineEmits(['change'])

/*
    深度遍历更新所有单位
    只更新绝对单位
*/
function change(currentUnit) {
    const unitKeys = ['width','height','top','left','right','bottom','fontSize','leftTop','rightTop','leftBottom','rightBottom','borderWidth','horizontal','vertical']
    const absoluteUnits = ['px', 'cm', 'mm', 'in']
    
    function updateUnit(item){
        if(Array.isArray(item)){
            return item.forEach(updateUnit)
        }

        if(item == null || typeof item != 'object'){
            return
        }


        if (item && !isNaN(Number(item.value)) && item.unit && absoluteUnits.includes(item.unit)) {
            
           return item.unit = currentUnit
        }

        for (let key in item) {
            updateUnit(item[key])
        }
    }

    updateUnit(canvasOptions.value.children)
}

const model = defineModel({
})

const absoluteSizeOptions = reactive([
    {
        value: "px",
        label: "px 像素",
    },
    {
        value: "mm",
        label: "mm 毫米",
    },
    {
        value: "cm",
        label: "cm 厘米",
    },
    {
        value: "in",
        label: "in 英寸（1英寸 ～= 2.54厘米）",
    },
]);

</script>

<style></style>
