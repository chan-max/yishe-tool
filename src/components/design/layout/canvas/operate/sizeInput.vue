<template>
    <el-popover :placement="placement" width="180">
        <template #reference>
            <div class="size-input">
                <el-input :placeholder="placeholder" size="small"  min="0" step="1" v-model.number="model">
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
    unitOptions: {
        default: []
    },
    placeholder: {
        default: ''
    },
    placement: {
    },
})

const model = defineModel({})
const unit = defineModel('unit', {})

</script>

<style scoped lang="less">
.size-input {
    flex-shrink: 0;
    height: 20px;
    display: flex;
    width: 80px;
    align-items: center;
    justify-content: end;

    :deep(.el-input) {
        height: 20px;
        width: 80px;
    }
}
</style>
