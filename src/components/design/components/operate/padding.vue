<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 内间距 </template>
        <template #content>
            <el-popover width="160" trigger="click">
                <template #reference>
                    <el-button size="small">{{ positionLabel }}</el-button>
                </template>
                <div>
                    <el-row align="middle" justify="center">
                        <el-col :span="24">
                            <div style="font-weight: bold; padding: 1em 0">间距设置</div>
                        </el-col>

                        <template v-for="item in paddingOptions">
                            <el-col :span="8">
                                <div>{{ item.label }}</div>
                            </el-col>
                            <el-col :span="16">
                                <div class="content" >
                                    <el-popover placement="right">
                                       <template #reference>
                                        <el-input size="small" type="number" min="0" step="1"
                                            v-model.number="model[item.type].value"></el-input>
                                       </template>
                                       
                                    </el-popover>
                                </div>
                            </el-col>
                        </template>
                    </el-row>
                </div>
            </el-popover>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import icon from "@/components/design/assets/icon/padding.svg?component";
import { getPositionInfoFromOptions } from "@/components/design/layout/canvas/helper.tsx";

/*
 padding 存在五种单位
 像素
 相对于画布的宽
 相对于画布的高
 相对于当前元素的宽
 相对于当起元素的高
*/

const model = defineModel({
    default: {
        top: {
            value: 0,
            unit: "px",
        },
        right: {
            value: 0,
            unit: "px",
        },
        bottom: {
            value: 0,
            unit: "px",
        },
        left: {
            value: 0,
            unit: "px",
        },
    },
});

const paddingOptions = ref([
    {
        type: "top",
        label: "上间距",
    },
    {
        type: "right",
        label: "右间距",
    },
    {
        type: "bottom",
        label: "下间距",
    },
    {
        type: "left",
        label: "左间距",
    },
]);

const positionLabel = computed(() => {
    return getPositionInfoFromOptions(model.value).label;
});
</script>

<style scoped lang="less">
.content {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: end;

    :deep(.el-input) {
        width: 48px;
        height: 20px;
    }
}
</style>
