<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素裁剪 </template>
        <template #content>
            <el-popover width="auto" :visible="showPopover" :persistent="false" ref="popperRef">
                <template #reference>
                    <el-button link @click="showPopover = !showPopover">
                        {{ label }}
                    </el-button>
                </template>
                <div>
                    <template v-if="activeTab == Tab.Custom">
                        <dragger></dragger>
                    </template>
                    <template v-if="activeTab == Tab.BuiltIn">
                        <el-row>
                            <el-col :span="24" style="height:300px;width:480px;overflow:auto;">
                                <el-row class="w-full">
                                    <el-col :span="4" v-for="item in builtInClipPathList">
                                        <div class="flex flex-col items-center preview-item"
                                            :class="{ checked: isChecked(item) }" @click="useCurrent(item)">
                                            <div style="width:48px;height:48px;" class="preview-box">
                                                <div style="width:100%;height:100%;" :style="createPreviewBoxStyle(item)">
                                                </div>
                                            </div>
                                            <div class="label"> {{
                                                item.label }} </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>

                    <div class="flex items-center" style="margin-top:1rem;">
                        <el-button v-if="activeTab == Tab.BuiltIn" @click="activeTab = Tab.Custom" size="small"> 自定义裁剪
                        </el-button>
                        <el-button v-else @click="activeTab = Tab.BuiltIn" size="small"> 使用内置裁剪 </el-button>
                        <div style="flex:1;"></div>
                        <el-button @click="remove" size="small" type="danger" plain> 不使用裁剪 </el-button>
                        <el-button @click="showPopover = false" size="small" type="danger"> 关闭 </el-button>
                    </div>
                </div>
            </el-popover>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/clip-path.svg?component";
import dragger from './dragger.vue'
import Utils from '@/common/utils'
import { builtInClipPathList } from '@/components/design/layout/canvas/children/svg/clipPath/index.tsx'
// 通用的颜色操作
import { useLocalStorage } from '@vueuse/core'

const popperRef = ref()

// onUpdated(() => {
//     popperRef.value.popperRef?.popperInstanceRef?.update();
// })

type ClipPathModelValue = {
    id: string, // 唯一id
    label: string // 标签
    cssValue: string, // 直接用于css 的属性值
    isCustom: boolean, // 是否使用自定义裁剪
}


enum Tab {
    BuiltIn = 'builtIn',
    Custom = 'custom',
}

const activeTab = useLocalStorage('_1s_clipPathActiveTab', Tab.BuiltIn)


const label = computed(() => {

    let clipPathId = model.value?.id

    if (!clipPathId) {
        return '无裁剪'
    }

    let current = builtInClipPathList.find((item) => item.id == clipPathId)

    return current.label

})


function createPreviewBoxStyle(item) {
    return { clipPath: item.type == 'css' ? item.cssValue : `url(#${item.url})`, background: item.previewBackground }
}

const showPopover = ref(false)

function isChecked(item) {
    return item.id == model.value?.id
}

function remove() {
    model.value = null
}

function useCurrent(item) {
    model.value = {
        ...item
    }
}

const model = defineModel({
    default: null
});

const props = defineProps({
})

</script>
  
<style lang="less" scoped>
.preview-item {
    row-gap: 1rem;
    padding: 1rem;
    border-radius: .2rem;
    transition: all .2s;

    .preview-box {
        cursor: pointer;
    }

    .label {
        cursor: pointer;
        color: #666;
        font-size: .9rem;
        text-align: center;
    }
}

.checked {
    background: #100a09;

    .label {
        color: #fff;
    }
}
</style>
  