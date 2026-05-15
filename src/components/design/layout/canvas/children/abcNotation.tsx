import ABCJS from 'abcjs'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { canvasStickerOptionsOnlyChild, updateRenderingCanvas } from '../index.tsx'
import {
    createFilterFromOptions,
    createTransformString,
    formatToNativeSizeString,
    getPositionInfoFromOptions,
} from '../helper.tsx'
import {
    createBasicDefaultOptions,
    createFilterDefaultOptions,
    createPositionDefaultOptions,
    createTransformDefaultOptions,
} from './defaultOptions.tsx'
import { onBeforeReturnRender, onCanvasChildSetup } from './commonHooks.ts'

export const createDefaultCanvasChildAbcNotationOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'abcNotation',
        source: `X:1
T:小星星
M:4/4
K:C
C C G G | A A G2 | F F E E | D D C2 |`,
        abcOptions: {
            responsive: 'resize',
        },
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        backgroundColor: {
            type: 'pure',
            color: 'transparent',
        },
        position: createPositionDefaultOptions(canvasUnit),
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex: 0,
        ...createBasicDefaultOptions(),
        transform: createTransformDefaultOptions(canvasUnit),
    }
}

export function createCanvasChildAbcNotation(options) {
    return <AbcNotationChild options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></AbcNotationChild>
}

export const AbcNotationChild = defineComponent({
    props: {
        options: null,
    },
    setup(props) {
        const targetRef = ref<HTMLElement>()
        const containerRef = ref<HTMLElement>()
        const errorMessage = ref('')

        onCanvasChildSetup({
            targetEl: targetRef,
            options: props.options,
            props,
        })

        const source = computed(() => String(props.options?.source || '').trim())
        const abcOptions = computed(() => props.options?.abcOptions || {})

        function renderAbc() {
            const text = source.value
            if (!containerRef.value) return

            if (!text) {
                containerRef.value.innerHTML = ''
                errorMessage.value = '请输入 ABC 记谱法内容'
                updateRenderingCanvas()
                return
            }

            try {
                errorMessage.value = ''
                ABCJS.renderAbc(containerRef.value, text, {
                    responsive: 'resize',
                    ...abcOptions.value,
                })
            } catch (error: any) {
                containerRef.value.innerHTML = ''
                errorMessage.value = error?.message || 'ABC 记谱法渲染失败'
            } finally {
                updateRenderingCanvas()
            }
        }

        onMounted(() => {
            nextTick(renderAbc)
        })

        watch(
            [source, abcOptions],
            () => {
                nextTick(renderAbc)
            },
            {
                deep: true,
            },
        )

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
                background: props.options.backgroundColor?.color || 'transparent',
                overflow: 'hidden',
                position: 'relative',
                pointerEvents: 'none',
                ..._style,
            }

            onBeforeReturnRender({
                style,
                options: props.options,
            })

            return <div style={containerStyle}>
                <div
                    ref={targetRef}
                    style={style}
                >
                    <style>{`
                        .canvas-abc-notation-child svg {
                            width: 100%;
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                            display: block;
                        }
                        .canvas-abc-notation-child__error {
                            color: #c45656;
                            font-size: 14px;
                            line-height: 1.4;
                            padding: 12px;
                            background: rgba(255, 245, 245, 0.92);
                            border: 1px solid rgba(196, 86, 86, 0.35);
                            border-radius: 4px;
                            white-space: pre-wrap;
                            max-width: 100%;
                            max-height: 100%;
                            overflow: hidden;
                            box-sizing: border-box;
                        }
                    `}</style>
                    {
                        errorMessage.value
                            ? <div class="canvas-abc-notation-child__error">{errorMessage.value}</div>
                            : <div
                                ref={containerRef}
                                class="canvas-abc-notation-child"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                }}
                            ></div>
                    }
                </div>
            </div>
        }
    },
})
