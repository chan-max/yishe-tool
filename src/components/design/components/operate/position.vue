<template>
    <operate-form-item>
        <template #icon> <icon-position></icon-position> </template>
        <template #name> 显示位置 </template>
        <template #content>
            <el-popover width="160">
                <template #reference>
                    <div style="padding:0 1em"> {{label}} </div>
                </template>
                <div>
                    <el-row align="middle" justify="center">
                        <el-col :span="24">
                            <div style="font-weight: bold;padding:.5em 0;">优先级自上而下排列</div>
                        </el-col>
                        <el-col :span="8">
                            <div>整体居中</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content"><el-switch size="small" v-model="model.center"></el-switch></div>
                        </el-col>
                        <el-col :span="8">
                            <div>垂直居中</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content"><el-switch size="small" v-model="model.verticalCenter"></el-switch></div>
                        </el-col>
                        <el-col :span="8">
                            <div>水平居中</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content"><el-switch size="small" v-model="model.horizontalCenter"></el-switch></div>
                        </el-col>
                        <el-col :span="8">
                            <div>距离顶部</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content">
                                <el-tooltip content="百分比">
                                    <el-input size="small" type="number" min="0" max="100" step="1"
                                        v-model.number="model.top"></el-input>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>距离左侧</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content">
                                <el-tooltip content="百分比">
                                <el-input size="small" type="number" min="0" max="100" step="1"
                                    v-model.number="model.left"></el-input>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>距离底部</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content">
                                <el-tooltip content="百分比">
                                <el-input size="small" type="number" min="0" max="100" step="1"
                                    v-model.number="model.bottom"></el-input>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>距离右侧</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="content">
                                <el-tooltip content="百分比">
                                <el-input size="small" type="number" min="0" max="100" step="1"
                                    v-model.number="model.right"></el-input>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-popover>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import { ref ,computed} from 'vue'
import iconPosition from "@/components/design/assets/icon/position.svg?component";


const model = defineModel({
    default: {
        center: true,
        verticalCenter: true,
        horizontalCenter: true,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})

const label = computed(() => {

    var  labels = []

    if (model.value.center) {
        labels.push('居中')
    } else if (model.value.verticalCenter && model.value.horizontalCenter) {
        labels.push('居中')
    } else if (!model.value.verticalCenter && model.value.horizontalCenter) {
        labels.push('水平居中')
    } else if (model.value.verticalCenter && !model.value.horizontalCenter) {
        labels.push('垂直居中')
    } else {
        // 自定义位置
        if (model.value.top) {
            labels.push(`距离顶部 ${model.value.top}%`)
        } else if (model.value.bottom) {
            labels.push(`距离底部 ${model.value.bottom}%`)
        }

        if (model.value.left) {
            labels.push(`距离左侧 ${model.value.left}%`)
        } else if (model.value.right) {
            labels.push(`距离右侧 ${model.value.right}%`)
        }
    }

    return labels.join(' , ')
})

/*
    居中
    水平居中
    垂直居中
    上方距离
    下放距离
    左侧距离
    右侧距离
*/

const position = ref({
    center: true
})

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