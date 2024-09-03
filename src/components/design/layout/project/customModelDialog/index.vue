<template>
    <a-modal v-bind="$attrs" v-model:open="show" :footer="null" :centered="true" :destroyOnClose="true"
        style="min-width:1080px;" width="1080px">
        <el-row style="height:640px;padding:1rem" :gutter="24">
            <el-col :span="16">
                <el-row style="row-gap: 2rem;">
                    <el-col :span="24">
                        <div style="width:100%;height:500px;background:#eee;border-radius: 1rem;">
                            <gltf-viewer :model="detailInfo.meta.modelInfo"></gltf-viewer>
                        </div>
                    </el-col>
                    <el-col>
                        <h1> {{ detailInfo.name || '--' }} </h1>
                        <div> {{ detailInfo.description || '......' }} </div>
                    </el-col>
                    <el-col>
                        <div class="flex items-center" style="column-gap: 2rem;">
                            <a-avatar size="large" :src="detailInfo.uploader.avatar" alt="?">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>
                            {{ detailInfo.uploader.name || '--' }}
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8" style="height: 100%;overflow:auto;">
                <div v-for="decal in detailInfo.meta.modelInfo.decals">
                    <desimage :src="decal.fetchResult.thumbnail"></desimage>
                </div>
            </el-col>
        </el-row>
    </a-modal>
</template>
    
<script setup lang='ts'>
import { useCustomModelDetailDialog } from './index.ts'
import gltfViewer from './gltfViewer/index.vue';
import { UserOutlined } from '@ant-design/icons-vue'
import desimage from "@/components/image.vue";


const { show, detailInfo } = useCustomModelDetailDialog()

</script>
    
<style></style>