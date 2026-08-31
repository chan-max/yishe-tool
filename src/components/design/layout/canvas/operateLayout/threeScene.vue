<template>
    <el-collapse v-model="collapseActives">
        <el-collapse-item name="1" title="基础属性">
            <operateItemSize
                label="尺寸"
                v-model:width="currentOperatingCanvasChild.width"
                v-model:height="currentOperatingCanvasChild.height"
            />
        </el-collapse-item>

        <el-collapse-item name="2" title="场景">
            <operate-form-item label="透明背景">
                <el-switch v-model="transparentBackground" />
            </operate-form-item>

            <operate-form-item v-if="!transparentBackground" label="背景色">
                <el-color-picker v-model="threejs.scene.background.value" show-alpha />
            </operate-form-item>

            <operate-form-item label="全局动画">
                <el-switch v-model="threejs.scene.animation.enabled" />
            </operate-form-item>

            <operate-form-item label="拖动旋转">
                <el-switch v-model="threejs.scene.interaction.dragToRotate.enabled" />
            </operate-form-item>

            <operate-form-item v-if="threejs.scene.interaction.dragToRotate.enabled" label="旋转灵敏度">
                <el-slider
                    v-model="threejs.scene.interaction.dragToRotate.sensitivity"
                    :min="0.002"
                    :max="0.02"
                    :step="0.001"
                />
            </operate-form-item>
        </el-collapse-item>

        <el-collapse-item name="3" title="场景项">
            <operate-form-item label="新增">
                <el-dropdown trigger="click" @command="addSceneItem">
                    <el-button size="small">添加</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="primitive">几何体</el-dropdown-item>
                            <el-dropdown-item command="model">模型</el-dropdown-item>
                            <el-dropdown-item command="ambient">环境光</el-dropdown-item>
                            <el-dropdown-item command="directional">方向光</el-dropdown-item>
                            <el-dropdown-item command="point">点光</el-dropdown-item>
                            <el-dropdown-item command="camera">相机</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </operate-form-item>

            <operate-form-item label="当前">
                <el-select v-model="selectedItemKey" size="small" placeholder="选择场景项">
                    <el-option
                        v-for="item in sceneItems"
                        :key="item.key"
                        :label="item.label"
                        :value="item.key"
                    />
                </el-select>
            </operate-form-item>

            <operate-form-item label="操作">
                <div class="three-scene-button-row">
                    <el-button
                        v-if="selectedItem?.group === 'camera'"
                        size="small"
                        :disabled="threejs.scene.activeCameraId === selectedItem.item.id"
                        @click="setActiveCamera"
                    >
                        设为主相机
                    </el-button>
                    <el-button size="small" type="danger" :disabled="!selectedItem" @click="removeSelectedItem">
                        删除
                    </el-button>
                </div>
            </operate-form-item>

            <template v-if="selectedItem">
                <operate-form-item label="名称">
                    <el-input v-model="selectedItem.item.name" size="small" />
                </operate-form-item>

                <template v-if="selectedItem.group === 'object'">
                    <operate-form-item label="显示">
                        <el-switch v-model="selectedItem.item.visible" />
                    </operate-form-item>

                    <template v-if="selectedItem.item.kind === 'primitive'">
                        <operate-form-item label="几何体">
                            <el-select v-model="selectedItem.item.primitive.geometry" size="small">
                                <el-option label="立方体" value="box" />
                                <el-option label="球体" value="sphere" />
                                <el-option label="圆环" value="torus" />
                                <el-option label="平面" value="plane" />
                                <el-option label="圆锥" value="cone" />
                                <el-option label="圆柱" value="cylinder" />
                            </el-select>
                        </operate-form-item>

                        <operate-form-item label="颜色">
                            <el-color-picker v-model="selectedItem.item.primitive.material.color" show-alpha />
                        </operate-form-item>

                        <operate-form-item label="金属度">
                            <el-slider v-model="selectedItem.item.primitive.material.metalness" :min="0" :max="1" :step="0.01" />
                        </operate-form-item>

                        <operate-form-item label="粗糙度">
                            <el-slider v-model="selectedItem.item.primitive.material.roughness" :min="0" :max="1" :step="0.01" />
                        </operate-form-item>

                        <operate-form-item label="线框">
                            <el-switch v-model="selectedItem.item.primitive.material.wireframe" />
                        </operate-form-item>
                    </template>

                    <template v-if="selectedItem.item.kind === 'model'">
                        <operate-form-item label="资源库">
                            <div class="three-scene-button-row">
                                <el-input
                                    :model-value="selectedModelName"
                                    size="small"
                                    placeholder="未选择模型"
                                    readonly
                                />
                                <el-button size="small" type="primary" @click="openAsset3dDialog">选择</el-button>
                            </div>
                        </operate-form-item>

                        <operate-form-item label="模型地址">
                            <el-input v-model="selectedItem.item.model.url" size="small" placeholder="GLB/GLTF URL" />
                        </operate-form-item>
                        <operate-form-item label="格式">
                            <el-select v-model="selectedItem.item.model.format" size="small">
                                <el-option label="GLB" value="glb" />
                                <el-option label="GLTF" value="gltf" />
                            </el-select>
                        </operate-form-item>
                    </template>

                    <operate-form-item label="位置">
                        <vector-input v-model="selectedItem.item.transform.position" />
                    </operate-form-item>

                    <operate-form-item label="旋转">
                        <vector-input v-model="selectedItem.item.transform.rotation" />
                    </operate-form-item>

                    <operate-form-item label="缩放">
                        <vector-input v-model="selectedItem.item.transform.scale" :min="0" />
                    </operate-form-item>

                    <operate-form-item label="自转">
                        <el-switch v-model="selectedItem.item.animation.autoRotate" />
                    </operate-form-item>

                    <operate-form-item v-if="selectedItem.item.animation.autoRotate" label="自转速度">
                        <vector-input v-model="selectedItem.item.animation.speed" :step="0.005" />
                    </operate-form-item>
                </template>

                <template v-if="selectedItem.group === 'light'">
                    <operate-form-item label="类型">
                        <el-select v-model="selectedItem.item.type" size="small">
                            <el-option label="环境光" value="ambient" />
                            <el-option label="方向光" value="directional" />
                            <el-option label="点光" value="point" />
                        </el-select>
                    </operate-form-item>

                    <operate-form-item label="颜色">
                        <el-color-picker v-model="selectedItem.item.color" show-alpha />
                    </operate-form-item>

                    <operate-form-item label="强度">
                        <el-slider v-model="selectedItem.item.intensity" :min="0" :max="10" :step="0.05" />
                    </operate-form-item>

                    <operate-form-item v-if="selectedItem.item.type !== 'ambient'" label="位置">
                        <vector-input v-model="selectedItem.item.position" />
                    </operate-form-item>
                </template>

                <template v-if="selectedItem.group === 'camera'">
                    <operate-form-item label="主相机">
                        <el-switch
                            :model-value="threejs.scene.activeCameraId === selectedItem.item.id"
                            @change="setActiveCamera"
                        />
                    </operate-form-item>

                    <operate-form-item label="FOV">
                        <el-input-number v-model="selectedItem.item.fov" size="small" :min="1" :max="120" />
                    </operate-form-item>

                    <operate-form-item label="裁剪面">
                        <div class="three-scene-button-row">
                            <el-input-number v-model="selectedItem.item.near" size="small" :min="0.01" :step="0.1" />
                            <el-input-number v-model="selectedItem.item.far" size="small" :min="1" :step="10" />
                        </div>
                    </operate-form-item>

                    <operate-form-item label="位置">
                        <vector-input v-model="selectedItem.item.position" />
                    </operate-form-item>

                    <operate-form-item label="看向">
                        <vector-input v-model="selectedItem.item.lookAt" />
                    </operate-form-item>
                </template>
            </template>
        </el-collapse-item>

        <el-collapse-item name="4" title="通用属性">
            <operateItemCommonGroup v-model="currentOperatingCanvasChild" />
        </el-collapse-item>
    </el-collapse>

    <el-drawer
        v-model="asset3dDialogVisible"
        title="选择3D模型"
        size="min(1080px, 92vw)"
        direction="rtl"
        class="three-scene-asset-dialog"
        append-to-body
        @open="loadAsset3dList"
    >
        <div class="three-scene-asset-drawer">
            <div class="three-scene-asset-toolbar">
                <el-input
                    v-model="asset3dQuery.name"
                    clearable
                    placeholder="搜索模型名称"
                    @keyup.enter="searchAsset3d"
                    @clear="searchAsset3d"
                />
                <el-button type="primary" :loading="asset3dLoading" @click="searchAsset3d">搜索</el-button>
            </div>

            <div
                v-loading="asset3dLoading"
                element-loading-text="正在加载资源库..."
                class="three-scene-asset-list"
            >
                <button
                    v-for="item in asset3dList"
                    :key="item.id"
                    type="button"
                    class="three-scene-asset-card"
                    :class="{ 'is-active': asset3dSelectedId === item.id }"
                    @click="asset3dSelectedId = item.id"
                    @dblclick="confirmSelectedAsset3d(item)"
                >
                    <div class="three-scene-asset-card__preview">
                        <img v-if="getAssetThumbnail(item)" :src="getAssetThumbnail(item)" alt="" />
                        <span v-else>3D</span>
                    </div>
                    <div class="three-scene-asset-card__body">
                        <div class="three-scene-asset-card__name" :title="getAssetName(item)">
                            {{ getAssetName(item) }}
                        </div>
                        <div class="three-scene-asset-card__desc" v-if="item.description" :title="item.description">
                            {{ item.description }}
                        </div>
                        <div class="three-scene-asset-card__meta" :title="getAssetUrl(item)">
                            {{ getModelFormat(getAssetUrl(item)).toUpperCase() }}
                        </div>
                    </div>
                    <div class="three-scene-asset-card__check" v-if="asset3dSelectedId === item.id">已选</div>
                </button>

                <div v-if="!asset3dLoading && !asset3dList.length" class="three-scene-asset-empty">
                    <el-empty description="暂无3D模型" />
                </div>
            </div>

            <div class="three-scene-asset-footer">
                <el-pagination
                    v-model:current-page="asset3dPagination.currentPage"
                    v-model:page-size="asset3dPagination.pageSize"
                    background
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[12, 24, 48, 96]"
                    :total="asset3dPagination.total"
                    @current-change="loadAsset3dList"
                    @size-change="handleAsset3dSizeChange"
                />
                <div class="three-scene-asset-actions">
                    <el-button @click="asset3dDialogVisible = false">取消</el-button>
                    <el-button
                        type="primary"
                        :disabled="!asset3dSelectedId"
                        @click="confirmSelectedAsset3d()"
                    >
                        使用模型
                    </el-button>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, resolveComponent, watch } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import operateFormItem from '@/components/design/layout/canvas/operate/operateFormItem.vue'
import { getAsset3dList } from '@/api'
import { message } from '@/common/message'
import { currentOperatingCanvasChild } from '../index.tsx'
import {
    createDebugCubeObject,
    createDefaultThreejsCamera,
    createDefaultThreejsEngineOptions,
    normalizeThreejsEngineOptions,
} from '../children/threeScene/index.tsx'

const VectorInput = defineComponent({
    props: {
        modelValue: {
            type: Array,
            default: () => [0, 0, 0],
        },
        step: {
            type: Number,
            default: 0.1,
        },
        min: {
            type: Number,
            default: undefined,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const ElInputNumber = resolveComponent('el-input-number')
        function setValue(index: number, value: number) {
            const next = [...(props.modelValue as number[])]
            next[index] = value
            emit('update:modelValue', next)
        }

        return () => h('div', { class: 'three-scene-vector-row' }, [0, 1, 2].map((index) => h(ElInputNumber, {
            modelValue: props.modelValue[index],
            size: 'small',
            step: props.step,
            min: props.min,
            'onUpdate:modelValue': (value: number) => setValue(index, value),
        })))
    },
})

const collapseActives = ref(['1', '2', '3', '4'])
const selectedItemKey = ref('')
const asset3dLoading = ref(false)
const asset3dDialogVisible = ref(false)
const asset3dList = ref<any[]>([])
const asset3dSelectedId = ref('')
const asset3dQuery = ref({
    name: '',
})
const asset3dPagination = ref({
    currentPage: 1,
    pageSize: 12,
    total: 0,
})

const threejs = computed({
    get() {
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
        child.threeScene.engines.threejs = normalizeThreejsEngineOptions(
            child.threeScene.engines.threejs || createDefaultThreejsEngineOptions(),
        )
        ensureSceneDefaults(child.threeScene.engines.threejs)
        return child.threeScene.engines.threejs
    },
    set(value) {
        currentOperatingCanvasChild.value.threeScene.engines.threejs = value
    },
})

const transparentBackground = computed({
    get() {
        return threejs.value.scene.background.type === 'transparent'
    },
    set(value: boolean) {
        threejs.value.scene.background.type = value ? 'transparent' : 'color'
    },
})

const sceneItems = computed(() => {
    const objects = threejs.value.scene.objects.map((item) => ({
        key: `object:${item.id}`,
        label: `${getObjectTypeLabel(item)} - ${item.name || item.id}`,
        group: 'object',
        item,
    }))
    const lights = threejs.value.scene.lights.map((item) => ({
        key: `light:${item.id}`,
        label: `${getLightTypeLabel(item.type)} - ${item.name || item.id}`,
        group: 'light',
        item,
    }))
    const cameras = threejs.value.scene.cameras.map((item) => ({
        key: `camera:${item.id}`,
        label: `${threejs.value.scene.activeCameraId === item.id ? '主相机' : '相机'} - ${item.name || item.id}`,
        group: 'camera',
        item,
    }))
    return [...objects, ...lights, ...cameras]
})

const selectedItem = computed(() => {
    return sceneItems.value.find((item) => item.key === selectedItemKey.value) || null
})

const selectedModelName = computed(() => {
    if (selectedItem.value?.group !== 'object' || selectedItem.value.item.kind !== 'model') {
        return ''
    }
    const model = selectedItem.value.item.model || {}
    const selectedAsset = asset3dList.value.find((item) => item.id === model.resourceId)
    return getAssetName(selectedAsset) || selectedItem.value.item.name || model.url || ''
})

watch(
    () => selectedItem.value?.key,
    () => {
        if (selectedItem.value?.group === 'object' && selectedItem.value.item.kind === 'model') {
            asset3dSelectedId.value = selectedItem.value.item.model?.resourceId || ''
        } else {
            asset3dSelectedId.value = ''
        }
    },
    { immediate: true },
)

watch(
    () => sceneItems.value.map((item) => item.key).join(','),
    () => {
        if (!selectedItemKey.value || !sceneItems.value.some((item) => item.key === selectedItemKey.value)) {
            selectedItemKey.value = sceneItems.value[0]?.key || ''
        }
    },
    { immediate: true },
)

function addSceneItem(command: string) {
    if (command === 'primitive') {
        addPrimitiveObject()
    } else if (command === 'model') {
        addModelObject()
    } else if (command === 'camera') {
        addCamera()
    } else {
        addLight(command)
    }
}

function addPrimitiveObject() {
    const object = createDebugCubeObject() as any
    object.id = createObjectId('primitive')
    object.name = '几何体'
    object.animation.autoRotate = false
    threejs.value.preset = 'empty'
    threejs.value.scene.objects.push(object)
    selectedItemKey.value = `object:${object.id}`
}

function addModelObject() {
    const object = {
        id: createObjectId('model'),
        name: '模型',
        kind: 'model',
        visible: true,
        transform: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        },
        model: {
            resourceId: '',
            url: '',
            format: 'glb',
        },
        animation: {
            autoRotate: false,
            speed: [0, 0.01, 0],
        },
    }
    threejs.value.preset = 'empty'
    threejs.value.scene.objects.push(object)
    selectedItemKey.value = `object:${object.id}`
}

async function searchAsset3d(keyword = '') {
    if (typeof keyword === 'string') {
        asset3dQuery.value.name = keyword
    }
    asset3dPagination.value.currentPage = 1
    await loadAsset3dList()
}

async function openAsset3dDialog() {
    if (selectedItem.value?.group !== 'object' || selectedItem.value.item.kind !== 'model') {
        return
    }
    asset3dSelectedId.value = selectedItem.value.item.model?.resourceId || ''
    asset3dDialogVisible.value = true
}

async function loadAsset3dList() {
    asset3dLoading.value = true
    try {
        const data: any = await getAsset3dList({
            currentPage: asset3dPagination.value.currentPage,
            pageSize: asset3dPagination.value.pageSize,
            name: asset3dQuery.value.name,
        })
        const records = data?.records || data?.list || data?.data || []
        asset3dList.value = records
        asset3dPagination.value.total = Number(data?.total ?? data?.count ?? records.length)
    } catch (error: any) {
        console.warn('3D asset list loading failed:', error)
        asset3dList.value = []
        asset3dPagination.value.total = 0
        message.error(error?.message || '资源库加载失败，请稍后重试')
    } finally {
        asset3dLoading.value = false
    }
}

function handleAsset3dSizeChange() {
    asset3dPagination.value.currentPage = 1
    loadAsset3dList()
}

function confirmSelectedAsset3d(asset?: any) {
    const target = asset || asset3dList.value.find((item) => item.id === asset3dSelectedId.value)
    if (!target) {
        return
    }
    applySelectedAsset3d(target)
    asset3dDialogVisible.value = false
}

function applySelectedAsset3d(asset: any) {
    const url = getAssetUrl(asset)
    if (!asset?.id || !url || selectedItem.value?.group !== 'object' || selectedItem.value.item.kind !== 'model') {
        return
    }
    const model = selectedItem.value.item.model
    model.resourceId = asset.id
    model.url = url
    model.format = getModelFormat(url)
    selectedItem.value.item.name = getAssetName(asset) || selectedItem.value.item.name || '模型'
    upsertModelResource(asset)
}

function upsertModelResource(asset: any) {
    const url = getAssetUrl(asset)
    if (!asset?.id || !url) {
        return
    }
    if (!Array.isArray(threejs.value.resources.models)) {
        threejs.value.resources.models = []
    }
    const resource = {
        id: asset.id,
        url,
        format: getModelFormat(url),
    }
    const index = threejs.value.resources.models.findIndex((item) => item.id === asset.id)
    if (index >= 0) {
        threejs.value.resources.models.splice(index, 1, resource)
    } else {
        threejs.value.resources.models.push(resource)
    }
}

function getAssetName(asset?: any) {
    return asset?.name || asset?.filename || asset?.title || asset?.id || ''
}

function getAssetUrl(asset?: any) {
    return asset?.url || asset?.modelUrl || asset?.fileUrl || asset?.path || ''
}

function getAssetThumbnail(asset?: any) {
    return asset?.thumbnail || asset?.cover || asset?.preview || ''
}

function getModelFormat(url = '') {
    const normalized = String(url).split('?')[0].toLowerCase()
    return normalized.endsWith('.gltf') ? 'gltf' : 'glb'
}

function addLight(type: string) {
    const light = {
        id: createObjectId(type),
        name: getLightTypeLabel(type),
        type,
        color: '#ffffff',
        intensity: type === 'ambient' ? 0.9 : 1.1,
        position: [2, 2, 3],
    }
    threejs.value.scene.lights.push(light)
    selectedItemKey.value = `light:${light.id}`
}

function addCamera() {
    const camera = {
        ...createDefaultThreejsCamera(),
        id: createObjectId('camera'),
        name: '相机',
    }
    threejs.value.scene.cameras.push(camera)
    if (!threejs.value.scene.activeCameraId) {
        threejs.value.scene.activeCameraId = camera.id
    }
    selectedItemKey.value = `camera:${camera.id}`
}

function removeSelectedItem() {
    if (!selectedItem.value) {
        return
    }
    const { group, item } = selectedItem.value as any
    if (group === 'object') {
        threejs.value.scene.objects = threejs.value.scene.objects.filter((target) => target.id !== item.id)
    } else if (group === 'light') {
        threejs.value.scene.lights = threejs.value.scene.lights.filter((target) => target.id !== item.id)
    } else if (group === 'camera') {
        if (threejs.value.scene.cameras.length <= 1) {
            return
        }
        threejs.value.scene.cameras = threejs.value.scene.cameras.filter((target) => target.id !== item.id)
        if (threejs.value.scene.activeCameraId === item.id) {
            threejs.value.scene.activeCameraId = threejs.value.scene.cameras[0]?.id || ''
        }
    }
    selectedItemKey.value = sceneItems.value[0]?.key || ''
}

function setActiveCamera() {
    if (selectedItem.value?.group !== 'camera') {
        return
    }
    threejs.value.scene.activeCameraId = selectedItem.value.item.id
    threejs.value.scene.camera = selectedItem.value.item
}

function ensureSceneDefaults(config) {
    if (!Array.isArray(config.scene.objects)) {
        config.scene.objects = []
    }
    if (!Array.isArray(config.scene.lights)) {
        config.scene.lights = []
    }
    if (!Array.isArray(config.scene.cameras) || !config.scene.cameras.length) {
        const camera = createDefaultThreejsCamera()
        config.scene.cameras = [camera]
        config.scene.activeCameraId = camera.id
    }
    if (!config.scene.activeCameraId) {
        config.scene.activeCameraId = config.scene.cameras[0].id
    }
    if (!config.scene.interaction) {
        config.scene.interaction = {}
    }
    if (!config.scene.interaction.dragToRotate) {
        config.scene.interaction.dragToRotate = {
            enabled: true,
            sensitivity: 0.008,
        }
    }
    if (typeof config.scene.interaction.dragToRotate.enabled !== 'boolean') {
        config.scene.interaction.dragToRotate.enabled = true
    }
    if (!Number(config.scene.interaction.dragToRotate.sensitivity)) {
        config.scene.interaction.dragToRotate.sensitivity = 0.008
    }
    config.scene.camera = config.scene.cameras.find((item) => item.id === config.scene.activeCameraId) || config.scene.cameras[0]
}

function createObjectId(prefix: string) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function getObjectTypeLabel(item) {
    if (item.kind === 'model') {
        return '模型'
    }
    return '几何体'
}

function getLightTypeLabel(type: string) {
    if (type === 'ambient') {
        return '环境光'
    }
    if (type === 'directional') {
        return '方向光'
    }
    if (type === 'point') {
        return '点光'
    }
    return '灯光'
}
</script>

<style scoped>
.three-scene-button-row,
.three-scene-vector-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.three-scene-vector-row :deep(.el-input-number) {
    width: 76px;
}

.three-scene-asset-drawer {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.three-scene-asset-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 0 12px;
    flex-shrink: 0;
}

.three-scene-asset-toolbar .el-input {
    flex: 1;
}

.three-scene-asset-list {
    flex: 1;
    min-height: 360px;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    align-content: start;
    gap: 12px;
    padding: 4px;
}

.three-scene-asset-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;
    padding: 0;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.three-scene-asset-card:hover,
.three-scene-asset-card.is-active {
    border-color: #409eff;
    box-shadow: 0 6px 18px rgba(64, 158, 255, 0.14);
    transform: translateY(-1px);
}

.three-scene-asset-card.is-active {
    background: #f5faff;
}

.three-scene-asset-card__preview {
    height: 136px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #909399;
    font-size: 18px;
    font-weight: 600;
}

.three-scene-asset-card__preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.three-scene-asset-card__body {
    padding: 10px;
    min-height: 88px;
}

.three-scene-asset-card__name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.three-scene-asset-card__desc {
    margin-top: 4px;
    min-height: 34px;
    font-size: 12px;
    line-height: 17px;
    color: #909399;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.three-scene-asset-card__meta {
    margin-top: 8px;
    font-size: 12px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.three-scene-asset-card__check {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 7px;
    border-radius: 999px;
    background: #409eff;
    color: #fff;
    font-size: 12px;
}

.three-scene-asset-empty {
    grid-column: 1 / -1;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.three-scene-asset-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid #e4e7ed;
    flex-shrink: 0;
}

.three-scene-asset-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

@media (max-width: 860px) {
    .three-scene-asset-footer {
        align-items: flex-end;
        flex-direction: column;
    }
}
</style>
