<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 选择背景图 </template>
        <template #content>
            <template v-if="model">
                <el-popover>
                    <template #reference>
                        <div class="flex items-center">
                            <div class="text-ellipsis" style="max-width: 120px;">已引用图片{{ model.name }}</div>
                            <el-button @click="model = null" link>
                                <el-icon size="1rem">
                                    <Close></Close>
                                </el-icon>
                            </el-button>
                        </div>
                    </template>
                    <div class="w-full flex justify-center">
                        <desimage style="width:100px;height:100px;" :src="model.url" :lazy="false"></desimage>
                    </div>
                </el-popover>
            </template>
            <template v-else>
                <el-button size="small" link @click="select"> 选择图片 </el-button>
            </template>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import icon from "@/components/design/assets/icon/background-image.svg?component";
import { showSticker, viewDisplayController } from "@/components/design/store";
import { Close } from '@element-plus/icons-vue'
import desimage from "@/components/design/components/image.vue";
const model = defineModel({})

function select() {
    viewDisplayController.value.showStickerModal = true
}

</script> 
    
<style></style>