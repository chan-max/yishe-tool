import * as THREE from 'three'
import { computed, defineComponent, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { canvasStickerOptionsOnlyChild, updateRenderingCanvas } from '../../index.tsx'
import {
    createBasicDefaultOptions,
    createFilterDefaultOptions,
    createPositionDefaultOptions,
    createTransformDefaultOptions,
} from '../defaultOptions.tsx'
import {
    createFilterFromOptions,
    createTransformString,
    formatSizeOptionToPixelValue,
    formatToNativeSizeString,
    getPositionInfoFromOptions,
} from '../../helper.tsx'
import { onBeforeReturnRender, onCanvasChildSetup } from '../commonHooks.ts'

export const createDefaultThreejsEngineOptions = () => {
    return {
        background: 'transparent',
        camera: {
            fov: 45,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 0, z: 3.5 },
        },
        lights: {
            ambient: { color: '#ffffff', intensity: 0.9 },
            directional: {
                color: '#ffffff',
                intensity: 1.1,
                position: { x: 2, y: 2, z: 3 },
            },
        },
        object: {
            shape: 'box',
            color: '#4f46e5',
            metalness: 0.25,
            roughness: 0.35,
            wireframe: false,
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
        },
        animation: {
            autoRotate: true,
            speedX: 0.01,
            speedY: 0.02,
            speedZ: 0,
        },
    }
}

export const createDefaultCanvasChildThreeSceneOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'threeScene',
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        position: createPositionDefaultOptions(canvasUnit),
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex: 0,
        ...createBasicDefaultOptions(),
        transform: createTransformDefaultOptions(canvasUnit),
        threeScene: {
            version: 1,
            engine: 'threejs',
            engines: {
                threejs: createDefaultThreejsEngineOptions(),
            },
        },
    }
}

export function createCanvasChildThreeScene(options) {
    return <ThreeSceneChild options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></ThreeSceneChild>
}

export const ThreeSceneChild = defineComponent({
    props: {
        options: null,
    },
    setup(props) {
        const canvasRef = ref<HTMLCanvasElement>()

        let renderer: THREE.WebGLRenderer | null = null
        let scene: THREE.Scene | null = null
        let camera: THREE.PerspectiveCamera | null = null
        let mesh: THREE.Mesh | null = null
        let geometry: THREE.BufferGeometry | null = null
        let material: THREE.MeshStandardMaterial | null = null
        let ambientLight: THREE.AmbientLight | null = null
        let directionalLight: THREE.DirectionalLight | null = null
        let animationFrameId: number | null = null

        onCanvasChildSetup({
            targetEl: canvasRef,
            options: props.options,
            props,
        })

        const canvasPixelSize = computed(() => {
            const width = Math.max(1, Math.round(Number(formatSizeOptionToPixelValue(props.options.width)) || 1))
            const height = Math.max(1, Math.round(Number(formatSizeOptionToPixelValue(props.options.height)) || 1))
            return { width, height }
        })

        function getEngineOptions() {
            return props.options?.threeScene?.engines?.threejs || createDefaultThreejsEngineOptions()
        }

        function createGeometryByShape(shape: string) {
            switch (shape) {
                case 'sphere':
                    return new THREE.SphereGeometry(0.85, 48, 48)
                case 'torus':
                    return new THREE.TorusGeometry(0.62, 0.24, 24, 80)
                case 'plane':
                    return new THREE.PlaneGeometry(1.8, 1.8)
                case 'box':
                default:
                    return new THREE.BoxGeometry(1.35, 1.35, 1.35, 2, 2, 2)
            }
        }

        function disposeMeshResources() {
            if (mesh) {
                scene?.remove(mesh)
            }
            geometry?.dispose?.()
            material?.dispose?.()
            mesh = null
            geometry = null
            material = null
        }

        function ensureRenderer() {
            const canvas = canvasRef.value
            if (!canvas) {
                return
            }
            if (!renderer) {
                renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true,
                })
            }
            if (!scene) {
                scene = new THREE.Scene()
            }
            if (!camera) {
                camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
            }
            if (!ambientLight) {
                ambientLight = new THREE.AmbientLight('#ffffff', 1)
                scene.add(ambientLight)
            }
            if (!directionalLight) {
                directionalLight = new THREE.DirectionalLight('#ffffff', 1)
                scene.add(directionalLight)
            }
        }

        const renderSnapshot = useDebounceFn(() => {
            if (!renderer || !scene || !camera) {
                return
            }
            renderer.render(scene, camera)
            updateRenderingCanvas()
        }, 80)

        function applySceneOptions() {
            ensureRenderer()
            if (!renderer || !scene || !camera || !ambientLight || !directionalLight) {
                return
            }

            const { width, height } = canvasPixelSize.value
            const options = getEngineOptions()

            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.fov = Number(options?.camera?.fov) || 45
            camera.near = Number(options?.camera?.near) || 0.1
            camera.far = Number(options?.camera?.far) || 1000
            camera.position.set(
                Number(options?.camera?.position?.x) || 0,
                Number(options?.camera?.position?.y) || 0,
                Number(options?.camera?.position?.z) || 3.5,
            )
            camera.updateProjectionMatrix()

            const background = String(options?.background || 'transparent')
            if (background === 'transparent') {
                renderer.setClearColor(0x000000, 0)
                scene.background = null
            } else {
                renderer.setClearColor(background, 1)
                scene.background = new THREE.Color(background)
            }

            ambientLight.color = new THREE.Color(options?.lights?.ambient?.color || '#ffffff')
            ambientLight.intensity = Number(options?.lights?.ambient?.intensity) || 0

            directionalLight.color = new THREE.Color(options?.lights?.directional?.color || '#ffffff')
            directionalLight.intensity = Number(options?.lights?.directional?.intensity) || 0
            directionalLight.position.set(
                Number(options?.lights?.directional?.position?.x) || 2,
                Number(options?.lights?.directional?.position?.y) || 2,
                Number(options?.lights?.directional?.position?.z) || 3,
            )

            const objectOptions = options?.object || {}
            const shape = String(objectOptions.shape || 'box')
            const needRebuildMesh =
                !mesh ||
                (mesh.userData?.shape || '') !== shape

            if (needRebuildMesh) {
                disposeMeshResources()
                geometry = createGeometryByShape(shape)
                material = new THREE.MeshStandardMaterial({
                    color: objectOptions.color || '#4f46e5',
                    metalness: Math.max(0, Math.min(1, Number(objectOptions.metalness) || 0)),
                    roughness: Math.max(0, Math.min(1, Number(objectOptions.roughness) || 0)),
                    wireframe: !!objectOptions.wireframe,
                })
                mesh = new THREE.Mesh(geometry, material)
                mesh.userData.shape = shape
                scene.add(mesh)
            }

            if (material) {
                material.color = new THREE.Color(objectOptions.color || '#4f46e5')
                material.metalness = Math.max(0, Math.min(1, Number(objectOptions.metalness) || 0))
                material.roughness = Math.max(0, Math.min(1, Number(objectOptions.roughness) || 0))
                material.wireframe = !!objectOptions.wireframe
            }

            if (mesh) {
                mesh.scale.set(
                    Number(objectOptions?.scale?.x) || 1,
                    Number(objectOptions?.scale?.y) || 1,
                    Number(objectOptions?.scale?.z) || 1,
                )
                mesh.rotation.set(
                    Number(objectOptions?.rotation?.x) || 0,
                    Number(objectOptions?.rotation?.y) || 0,
                    Number(objectOptions?.rotation?.z) || 0,
                )
            }

            renderSnapshot()
        }

        function stopAnimationLoop() {
            if (animationFrameId != null) {
                cancelAnimationFrame(animationFrameId)
                animationFrameId = null
            }
        }

        function startAnimationLoop() {
            stopAnimationLoop()

            const tick = () => {
                const options = getEngineOptions()
                const animation = options?.animation || {}

                if (mesh && animation.autoRotate) {
                    mesh.rotation.x += Number(animation.speedX) || 0
                    mesh.rotation.y += Number(animation.speedY) || 0
                    mesh.rotation.z += Number(animation.speedZ) || 0
                }

                if (renderer && scene && camera) {
                    renderer.render(scene, camera)
                }
                animationFrameId = requestAnimationFrame(tick)
            }
            animationFrameId = requestAnimationFrame(tick)
        }

        const refresh = useDebounceFn(() => {
            applySceneOptions()
            startAnimationLoop()
        }, 80)

        onMounted(refresh)
        onUpdated(refresh)
        watch(() => props.options, refresh, { deep: true })

        onBeforeUnmount(() => {
            stopAnimationLoop()
            disposeMeshResources()
            renderer?.dispose?.()
            renderer = null
            scene = null
            camera = null
            ambientLight = null
            directionalLight = null
        })

        return () => {
            const {
                containerStyle: _containerStyle,
                style: _style,
            } = getPositionInfoFromOptions(props.options.position)

            const containerStyle: any = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                ..._containerStyle,
            }

            const style: any = {
                flexShrink: 0,
                width: formatToNativeSizeString(props.options.width),
                height: formatToNativeSizeString(props.options.height),
                transform: createTransformString(props.options.transform),
                filter: createFilterFromOptions(props.options.filter),
                zIndex: props.options.zIndex,
                ..._style,
            }

            onBeforeReturnRender({
                style,
                options: props.options,
            })

            return <div style={containerStyle}>
                <canvas
                    ref={canvasRef}
                    style={style}
                    width={canvasPixelSize.value.width}
                    height={canvasPixelSize.value.height}
                    data-three-scene-engine={props.options?.threeScene?.engine || 'threejs'}
                ></canvas>
            </div>
        }
    },
})
