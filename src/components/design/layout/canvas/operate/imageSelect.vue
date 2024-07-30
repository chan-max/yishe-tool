<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <template v-if="model">
                <el-popover placement="right" popper-class="el-popover-operation">
                    <template #reference>
                        <div class="flex items-center">
                            <div class="text-ellipsis" style="font-size:1rem;max-width: 180px;">已引用图片 : {{ model.name }}</div>
                        </div>
                    </template>
                    <el-row align="middle" justify="center" style="row-gap: 1rem;">
                        <el-col :span="24">
                            <div class="flex justify-center">
                                <desimage style="width:100px;height:100px;" :src="model.url" :lazy="false"></desimage>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <el-button @click="remove" size="small" :icon="Close" style="width:100%;">
                                移除图片
                            </el-button>
                        </el-col>
                    </el-row>
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

const props = defineProps({
    label:{
        default:'选择图片'
    }
})

function select() {
    viewDisplayController.value.showStickerModal = true
}

function remove(){
   model.value = null
}

</script> 
    
<style></style>