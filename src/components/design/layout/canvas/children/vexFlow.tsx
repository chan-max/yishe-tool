import Vex from 'vexflow'
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

export const createDefaultCanvasChildVexFlowOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'vexFlow',
        notes: [
            { keys: ['c/4'], duration: 'q' },
            { keys: ['d/4'], duration: 'q' },
            { keys: ['e/4'], duration: 'q' },
            { keys: ['f/4'], duration: 'q' },
        ],
        timeSignature: '4/4',
        clef: 'treble',
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

export function createCanvasChildVexFlow(options) {
    return <VexFlowChild options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></VexFlowChild>
}

const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex

export const VexFlowChild = defineComponent({
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

        const notes = computed(() => props.options?.notes || [])
        const timeSignature = computed(() => String(props.options?.timeSignature || '4/4'))
        const clef = computed(() => String(props.options?.clef || 'treble'))

        function renderVexFlow() {
            if (!containerRef.value) return

            // 清除旧内容
            containerRef.value.innerHTML = ''

            if (notes.value.length === 0) {
                errorMessage.value = '请输入音符数据'
                updateRenderingCanvas()
                return
            }

            try {
                errorMessage.value = ''

                const renderer = new Renderer(containerRef.value as HTMLDivElement, Renderer.Backends.SVG)
                renderer.resize(containerRef.value.clientWidth || 400, containerRef.value.clientHeight || 200)
                const context = renderer.getContext()

                const stave = new Stave(10, 40, (containerRef.value.clientWidth || 400) - 20)
                stave.addClef(clef.value)
                stave.addTimeSignature(timeSignature.value)
                stave.setContext(context).draw()

                const staveNotes = notes.value.map(note => {
                    const staveNote = new StaveNote({
                        keys: note.keys || ['c/4'],
                        duration: note.duration || 'q',
                        clef: clef.value,
                    })
                    return staveNote
                })

                const voice = new Voice({ numBeats: 4, beatValue: 4 })
                voice.setStrict(false)
                voice.addTickables(staveNotes)

                new Formatter().joinVoices([voice]).format([voice], (containerRef.value.clientWidth || 400) - 40)
                voice.draw(context, stave)
            } catch (error: any) {
                containerRef.value.innerHTML = ''
                errorMessage.value = error?.message || 'VexFlow 渲染失败'
            } finally {
                updateRenderingCanvas()
            }
        }

        onMounted(() => {
            nextTick(renderVexFlow)
        })

        watch(
            [notes, timeSignature, clef],
            () => {
                nextTick(renderVexFlow)
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
                        .canvas-vexflow-child svg {
                            width: 100%;
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                            display: block;
                        }
                        .canvas-vexflow-child__error {
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
                            ? <div class="canvas-vexflow-child__error">{errorMessage.value}</div>
                            : <div
                                ref={containerRef}
                                class="canvas-vexflow-child"
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
