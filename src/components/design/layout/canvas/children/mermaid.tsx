import mermaid from 'mermaid'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
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

let renderSeed = 0

export const createDefaultCanvasChildMermaidOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'mermaid',
        source: `flowchart TD
  A[想法] --> B{选择图表类型}
  B -->|流程| C[Flowchart]
  B -->|结构| D[Class / ER]
  B -->|时间| E[Timeline / Gantt]`,
        config: {
            theme: 'default',
            securityLevel: 'strict',
            flowchart: {
                htmlLabels: true,
                curve: 'basis',
            },
        },
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        fontSize: {
            value: 48,
            unit: 'px',
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

export function createCanvasChildMermaid(options) {
    return <MermaidChild options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></MermaidChild>
}

export const MermaidChild = defineComponent({
    props: {
        options: null,
    },
    setup(props) {
        const targetRef = ref<HTMLElement>()
        const svgHtml = ref('')
        const errorMessage = ref('')

        onCanvasChildSetup({
            targetEl: targetRef,
            options: props.options,
            props,
        })

        const source = computed(() => String(props.options?.source || '').trim())
        const config = computed(() => props.options?.config || {})

        async function renderMermaid() {
            const text = source.value
            if (!text) {
                svgHtml.value = ''
                errorMessage.value = '请输入 Mermaid 内容'
                await nextTick()
                updateRenderingCanvas()
                return
            }

            try {
                errorMessage.value = ''
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: 'strict',
                    theme: 'default',
                    ...config.value,
                })
                const id = `canvas-mermaid-${Date.now()}-${renderSeed++}`
                const result = await mermaid.render(id, text)
                svgHtml.value = result.svg
            } catch (error: any) {
                svgHtml.value = ''
                errorMessage.value = error?.str || error?.message || 'Mermaid 渲染失败'
            } finally {
                await nextTick()
                updateRenderingCanvas()
            }
        }

        watch(
            [source, config],
            renderMermaid,
            {
                immediate: true,
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
                fontSize: formatToNativeSizeString(props.options.fontSize),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
                position: 'relative',
                padding: 0,
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
                    class="canvas-mermaid-child"
                    style={style}
                    data-mermaid-engine="mermaid"
                >
                    <style>{`
                        .canvas-mermaid-child svg {
                            width: 100%;
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                            display: block;
                        }
                        .canvas-mermaid-child .canvas-mermaid-child__error {
                            color: #c45656;
                            font-size: 0.28em;
                            line-height: 1.4;
                            padding: 0.75em;
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
                            ? <div class="canvas-mermaid-child__error">{errorMessage.value}</div>
                            : <div
                                class="canvas-mermaid-child__content"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                innerHTML={svgHtml.value}
                            ></div>
                    }
                </div>
            </div>
        }
    },
})
