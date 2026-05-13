<template>
    <el-collapse v-model="collapseActives">
        <el-collapse-item name="1" title="基础属性">
            <operateItemSize
                label="尺寸"
                v-model:width="currentOperatingCanvasChild.width"
                v-model:height="currentOperatingCanvasChild.height"
            />
        </el-collapse-item>

        <el-collapse-item name="2" title="Three.js 引擎">
            <operate-form-item label="几何体">
                <el-select v-model="threejs.object.shape" size="small">
                    <el-option label="立方体" value="box" />
                    <el-option label="球体" value="sphere" />
                    <el-option label="圆环" value="torus" />
                    <el-option label="平面" value="plane" />
                </el-select>
            </operate-form-item>

            <operate-form-item label="颜色">
                <el-color-picker v-model="threejs.object.color" show-alpha />
            </operate-form-item>

            <operate-form-item label="金属度">
                <el-slider v-model="threejs.object.metalness" :min="0" :max="1" :step="0.01" />
            </operate-form-item>

            <operate-form-item label="粗糙度">
                <el-slider v-model="threejs.object.roughness" :min="0" :max="1" :step="0.01" />
            </operate-form-item>

            <operate-form-item label="线框">
                <el-switch v-model="threejs.object.wireframe" />
            </operate-form-item>

            <operate-form-item label="透明背景">
                <el-switch v-model="transparentBackground" />
            </operate-form-item>
        </el-collapse-item>

        <el-collapse-item name="3" title="相机">
            <operate-form-item label="FOV">
                <el-input-number v-model="threejs.camera.fov" size="small" :min="1" :max="120" />
            </operate-form-item>
            <operate-form-item label="相机 X">
                <el-input-number v-model="threejs.camera.position.x" size="small" :step="0.1" />
            </operate-form-item>
            <operate-form-item label="相机 Y">
                <el-input-number v-model="threejs.camera.position.y" size="small" :step="0.1" />
            </operate-form-item>
            <operate-form-item label="相机 Z">
                <el-input-number v-model="threejs.camera.position.z" size="small" :step="0.1" />
            </operate-form-item>
        </el-collapse-item>

        <el-collapse-item name="4" title="动画">
            <operate-form-item label="自动旋转">
                <el-switch v-model="threejs.animation.autoRotate" />
            </operate-form-item>
            <operate-form-item label="X速度">
                <el-input-number v-model="threejs.animation.speedX" size="small" :step="0.005" />
            </operate-form-item>
            <operate-form-item label="Y速度">
                <el-input-number v-model="threejs.animation.speedY" size="small" :step="0.005" />
            </operate-form-item>
            <operate-form-item label="Z速度">
                <el-input-number v-model="threejs.animation.speedZ" size="small" :step="0.005" />
            </operate-form-item>
        </el-collapse-item>

        <el-collapse-item name="5" title="通用属性">
            <operateItemCommonGroup v-model="currentOperatingCanvasChild" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import operateFormItem from '@/components/design/layout/canvas/operate/operateFormItem.vue'
import { currentOperatingCanvasChild } from '../index.tsx'
import { createDefaultThreejsEngineOptions } from '../children/threeScene/index.tsx'

const collapseActives = ref(['1', '2', '3', '4', '5'])

const threejs = computed(() => {
    const child = currentOperatingCanvasChild.value
    if (!child.threeScene) {
        child.threeScene = {
            version: 1,
            engine: 'threejs',
            engines: {},
        }
    }
    if (!child.threeScene.engines) {
        child.threeScene.engines = {}
    }
    if (!child.threeScene.engines.threejs) {
        child.threeScene.engines.threejs = createDefaultThreejsEngineOptions()
    }
    return child.threeScene.engines.threejs
})

const transparentBackground = computed({
    get() {
        return threejs.value.background === 'transparent'
    },
    set(value: boolean) {
        threejs.value.background = value ? 'transparent' : '#ffffff'
    },
})
</script>

