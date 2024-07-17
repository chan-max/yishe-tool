<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 边框圆角 </template>
        <template #content>
            <el-popover width="180" trigger="click">
                <template #reference>
                    <el-button size="small" link>
                        <el-tooltip :content="borderRadiusLabel" :hide-after="0">
                            <div class="text-ellipsis" style="max-width:200px;">
                                {{ borderRadiusLabel }}
                            </div>
                        </el-tooltip>
                    </el-button>
                </template>
                <div>
                    <el-row align="middle" justify="center">
                        <el-col :span="24">
                            <div style="font-weight: bold; padding: 1em 0">圆角设置</div>
                        </el-col>
                        <template v-for="item in borderRadiusOptions">
                            <el-col :span="8">
                                <div>{{ item.label }}</div>
                            </el-col>
                            <el-col :span="16">
                                <div class="input-item">
                                    <el-popover placement="right" width="200" trigger="click" :teleported="false">
                                        <template #reference>
                                            <el-input size="small" type="number" min="0" step="1"
                                                style="width:88px;height:24px;" v-model.number="model[item.type].value">
                                                <template #suffix>
                                                    <div style="font-size:1rem;"> {{ model[item.type].unit }}
                                                    </div>
                                                </template>
                                            </el-input>
                                        </template>

                                        <el-row align="middle" justify="end">
                                            <el-col :span="24">
                                                <el-radio-group v-model="model[item.type].unit" size="small">
                                                    <el-radio v-for="u in unitOptions" :value="u.value">
                                                        <span style="font-size: 1rem;">{{ u.label }}</span>
                                                    </el-radio>
                                                </el-radio-group>
                                            </el-col>
                                        </el-row>

                                    </el-popover>
                                </div>
                            </el-col>
                        </template>
                        <el-col :span="24">
                            <div class="input-item">
                                <el-button size="small" style="width:100%;" @click="reset">
                                    重置
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-popover>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import icon from "@/components/design/assets/icon/border-radius.svg?component";
import { getBroderRadiusDispalyLabel } from "@/components/design/layout/canvas/helper.tsx";
import { canvasOptions } from "@/components/design/layout/canvas/index.tsx";

/*
 padding 存在五种单位
 像素
 相对于画布的宽
 相对于画布的高
 相对于当前元素的宽
 相对于当起元素的高
*/




const model = defineModel({});

function reset() {
    let val = { value: 0, unit: 'px' }
    model.value = {
        leftTop: val,
        rightTop: val,
        rightBottom: val,
        leftBottom: val,
    }
}

const borderRadiusOptions = ref([
    {
        type: "leftTop",
        label: "左上角",
    },
    {
        type: "rightTop",
        label: "右上角",
    },
    {
        type: "rightBottom",
        label: "右下角",
    },
    {
        type: "leftBottom",
        label: "左下角",
    },
]);


const unitOptions = computed(() => {
    return [
        {
            label: `使用当前画布单位(${canvasOptions.value.unit})`,
            value: canvasOptions.value.unit,
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



const borderRadiusLabel = computed(() => {
    return getBroderRadiusDispalyLabel(model.value);
});

</script>

<style scoped lang="less">
.input-item {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: end;

    :deep(.el-input) {
        width: 48px;
        height: 20px;
    }
}
</style>
