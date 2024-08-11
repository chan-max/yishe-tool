<template>
    <a-modal v-bind="$attrs" v-model:open="show" :footer="null" :centered="true" :destroyOnClose="true"
        style="min-width:1080px;" width="1080px">
        <el-row style="height:640px;padding:1rem">
            <el-col :span="16">
                <el-row>
                    <el-col :span="24">
                        <div style="width:100%;height:500px;background:#eee;">
                            <gltf-viewer :model="detailInfo.meta.modelInfo"></gltf-viewer>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
            </el-col>
        </el-row>
    </a-modal>
</template>
    
<script setup lang='ts'>
import { useCustomModelDetailDialog } from './index.ts'
import gltfViewer from './gltfViewer/index.vue';


const { show, detailInfo } = useCustomModelDetailDialog()




</script>
    
<style></style>