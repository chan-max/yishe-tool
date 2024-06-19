<template>
    <el-row align="center" justify="center" :gutter="12">
        <el-col :span="8">
            <div class="label">宽</div>
        </el-col>
        <el-col :span="16">
            <el-input size="small" v-model="svgCanvasWidth"  type="number" min="100" step="10"></el-input>
        </el-col>
    </el-row>
    <el-row :gutter="12">
        <el-col :span="8">
            <div class="label">
                高
            </div>
        </el-col>
        <el-col :span="16">
            <el-input v-model="svgCanvasHeight" size="small" type="number" min="100" step="10"></el-input>
        </el-col>
    </el-row>
    <el-row :gutter="12">
        <el-col :span="8">
            <div class="label">
                主画布
            </div>
        </el-col>
        <el-col :span="16">
            <el-switch v-model="svgCanvasSyncMainCanvas" size="small" inline-prompt  />
        </el-col>
    </el-row>
</template>
    
<script setup lang='ts'>
import { svgCanvasChildren, svgCanvasWidth,svgCanvasHeight,svgCanvasSyncMainCanvas} from '@/components/design/store'
</script>
    
<style lang="less" scoped>
.el-row{
    margin-bottom: 6px;
}

.label{
    height: 100%;
    align-content: center;
    text-align: end;
}
</style>
<style>

</style>