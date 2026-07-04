<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <div class="size-inputs-wrapper">
                <div class="input-group">
                    <span class="label-text">宽</span>
                    <el-input class="size-input" size="small" v-model.number="width.value" step="10" placeholder="宽" type="number" @input="onWidthChange">
                        <template #suffix>
                            <span class="unit-text">{{ canvasStickerOptions.unit }}</span>
                        </template>
                    </el-input>
                </div>

                <el-tooltip :content="locked ? '点击解锁比例' : '点击锁定比例'" placement="top">
                    <div class="lock-btn" :class="{ 'lock-btn--active': locked }" @click="toggleLock">
                        <el-icon :size="14">
                            <Lock v-if="locked" />
                            <Unlock v-else />
                        </el-icon>
                    </div>
                </el-tooltip>

                <el-tooltip content="翻转宽高" placement="top">
                    <div class="flip-btn" @click="flipSize">
                        <el-icon :size="14">
                            <Sort />
                        </el-icon>
                    </div>
                </el-tooltip>
                
                <div class="input-group input-group--secondary">
                    <span class="label-text">高</span>
                    <el-input class="size-input" size="small" v-model.number="height.value" step="10" placeholder="高" type="number" @input="onHeightChange">
                        <template #suffix>
                            <span class="unit-text">{{ canvasStickerOptions.unit }}</span>
                        </template>
                    </el-input>
                </div>
            </div>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/size.svg?component";
import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'
import { Lock, Unlock, Sort } from "@element-plus/icons-vue";
import { ref } from 'vue'

const props = defineProps({
    label: {
        default: "尺寸",
    }
});

const width = defineModel<any>("width", { default: { value: 0 } });
const height = defineModel<any>("height", { default: { value: 0 } });

const locked = ref(false)
let lockedRatio = 1
let updating = false

function toggleLock() {
    if (!locked.value) {
        const w = Number(width.value?.value) || 0
        const h = Number(height.value?.value) || 0
        lockedRatio = h === 0 ? 1 : w / h
    }
    locked.value = !locked.value
}

function onWidthChange() {
    if (!locked.value || updating) return
    const w = Number(width.value?.value) || 0
    if (w <= 0) return
    updating = true
    const newH = Math.round(w / lockedRatio)
    height.value = { ...height.value, value: newH || 1 }
    updating = false
}

function onHeightChange() {
    if (!locked.value || updating) return
    const h = Number(height.value?.value) || 0
    if (h <= 0) return
    updating = true
    const newW = Math.round(h * lockedRatio)
    width.value = { ...width.value, value: newW || 1 }
    updating = false
}

function flipSize() {
    const w = Number(width.value?.value) || 0
    const h = Number(height.value?.value) || 0
    width.value = { ...width.value, value: h }
    height.value = { ...height.value, value: w }
    // 如果锁定了比例，更新锁定比例
    if (locked.value) {
        lockedRatio = h === 0 ? 1 : w / h
    }
}
</script>

<style scoped lang="less">
.size-inputs-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 12px;
    width: 100%;
    min-width: 0;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 0 1 auto;
    min-width: 0;
    
    .label-text {
        font-size: 11px;
        color: #999;
        flex-shrink: 0;
    }
}

.input-group--secondary {
    margin-left: 0;
}

.size-input {
    width: 86px;
}

.unit-text {
    font-size: 9px;
    color: #ccc;
}

.lock-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    cursor: pointer;
    color: #bbb;
    flex-shrink: 0;
    transition: all 0.15s;

    &:hover {
        color: #666;
        background: #f0f0f0;
    }

    &--active {
        color: var(--el-color-primary, #409eff);
        background: rgba(64, 158, 255, 0.08);

        &:hover {
            background: rgba(64, 158, 255, 0.15);
        }
    }
}

.flip-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    cursor: pointer;
    color: #bbb;
    flex-shrink: 0;
    transition: all 0.15s;
    transform: rotate(90deg);

    &:hover {
        color: #666;
        background: #f0f0f0;
    }
}

@media (max-width: 1080px) {
    .size-input {
        width: 82px;
    }

    .input-group {
        gap: 3px;
    }

    .input-group .label-text {
        font-size: 10px;
    }
}
</style>


