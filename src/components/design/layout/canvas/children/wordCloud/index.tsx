import WordCloud from 'wordcloud'
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
    formatSizeOptionToPixelValue,
    formatToNativeSizeString,
    getPositionInfoFromOptions,
} from '../../helper.tsx'
import { onBeforeReturnRender, onCanvasChildSetup } from '../commonHooks.ts'

type WordCloud2ListItem = [string, number, ...any[]]

const DEFAULT_WORDS: WordCloud2ListItem[] = [
    ['Sticker', 72],
    ['Design', 56],
    ['Custom', 48],
    ['Print', 42],
    ['Canvas', 36],
    ['Gift', 30],
    ['Cute', 26],
    ['Brand', 24],
]

export const createDefaultWordCloud2EngineOptions = () => {
    return {
        list: DEFAULT_WORDS,
        fontFamilyInfo: null,
        fontFamily: 'sans-serif',
        fontWeight: '600',
        colorMode: 'palette',
        color: '#111111',
        colors: ['#111111', '#ff4d6d', '#2ec4b6', '#ffbe0b', '#3a86ff'],
        minSize: 8,
        weightFactor: 1,
        clearCanvas: true,
        backgroundColor: 'rgba(0,0,0,0)',
        gridSize: 8,
        origin: null,
        drawOutOfBound: false,
        shrinkToFit: true,
        drawMask: false,
        maskColor: 'rgba(255,0,0,0.3)',
        maskGapWidth: 0.3,
        wait: 0,
        abortThreshold: 0,
        minRotation: -Math.PI / 2,
        maxRotation: Math.PI / 2,
        rotationSteps: 2,
        shuffle: true,
        rotateRatio: 0.35,
        shape: 'circle',
        ellipticity: 1,
    }
}

export const createDefaultCanvasChildWordCloudOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'wordCloud',
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
        wordCloud: {
            version: 1,
            engine: 'wordcloud2',
            engines: {
                wordcloud2: createDefaultWordCloud2EngineOptions(),
            },
        },
    }
}

export function createCanvasChildWordCloud(options) {
    return <WordCloudChild options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></WordCloudChild>
}

export const WordCloudChild = defineComponent({
    props: {
        options: null,
    },
    setup(props) {
        const canvasRef = ref<HTMLCanvasElement>()
        let renderToken = 0

        onCanvasChildSetup({
            targetEl: canvasRef,
            options: props.options,
            props,
        })

        const canvasPixelSize = computed(() => {
            const width = Math.max(1, Math.round(Number(formatSizeOptionToPixelValue(props.options.width)) || 1))
            const height = Math.max(1, Math.round(Number(formatSizeOptionToPixelValue(props.options.height)) || 1))
            return {
                width,
                height,
            }
        })

        async function waitForFontsLoaded() {
            const fontInfo = getWordCloud2Options(props.options)?.fontFamilyInfo
            if (fontInfo?.url && fontInfo?.id && !document.fonts?.check?.(`12px font_${fontInfo.id}`)) {
                try {
                    const fontFace = new FontFace(`font_${fontInfo.id}`, `url(${fontInfo.url})`)
                    await fontFace.load()
                    document.fonts.add(fontFace)
                } catch (error) {
                    console.warn('Word cloud font loading failed:', error)
                }
            }

            if (document.fonts?.ready) {
                await document.fonts.ready
            }
        }

        const renderWordCloud = useDebounceFn(async () => {
            const canvas = canvasRef.value
            if (!canvas) {
                return
            }

            const currentToken = ++renderToken
            const { width, height } = canvasPixelSize.value
            if (canvas.width !== width) {
                canvas.width = width
            }
            if (canvas.height !== height) {
                canvas.height = height
            }

            const context = canvas.getContext('2d')

            const engineOptions = getWordCloud2Options(props.options)
            if (!engineOptions?.list?.length || !isWordCloudSupported()) {
                context?.clearRect(0, 0, width, height)
                updateRenderingCanvas()
                return
            }

            await waitForFontsLoaded()

            const options = createWordCloud2RenderOptions(engineOptions, canvas)
            const finish = () => {
                if (currentToken === renderToken) {
                    updateRenderingCanvas()
                }
            }

            await new Promise<void>((resolve) => {
                let resolved = false
                const done = () => {
                    if (resolved) {
                        return
                    }
                    resolved = true
                    canvas.removeEventListener('wordcloudstop', done)
                    canvas.removeEventListener('wordcloudabort', done)
                    resolve()
                }

                canvas.addEventListener('wordcloudstop', done)
                canvas.addEventListener('wordcloudabort', done)

                try {
                    WordCloud(canvas, options)
                } catch (error) {
                    console.warn('Word cloud render failed:', error)
                    done()
                }
            })

            finish()
        }, 120)

        onMounted(renderWordCloud)
        onUpdated(renderWordCloud)
        watch(() => props.options, renderWordCloud, { deep: true })

        onBeforeUnmount(() => {
            renderToken++
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
                    data-word-cloud-engine={props.options.wordCloud?.engine || 'wordcloud2'}
                ></canvas>
            </div>
        }
    },
})

function getWordCloud2Options(options: any) {
    return options?.wordCloud?.engines?.wordcloud2
}

function isWordCloudSupported() {
    return WordCloud.isSupported !== false
}

function createWordCloud2RenderOptions(options: any, canvas: HTMLCanvasElement) {
    return {
        list: normalizeList(options.list),
        fontFamily: getWordCloud2FontFamily(options),
        fontWeight: options.fontWeight,
        color: createWordCloud2ColorOption(options),
        minSize: Number(options.minSize) || 0,
        weightFactor: Number(options.weightFactor) || 1,
        clearCanvas: options.clearCanvas !== false,
        backgroundColor: options.backgroundColor || 'rgba(0,0,0,0)',
        gridSize: Number(options.gridSize) || 8,
        origin: normalizeOrigin(options.origin, canvas),
        drawOutOfBound: !!options.drawOutOfBound,
        shrinkToFit: options.shrinkToFit !== false,
        drawMask: !!options.drawMask,
        maskColor: options.maskColor || 'rgba(255,0,0,0.3)',
        maskGapWidth: Number(options.maskGapWidth) || 0,
        wait: Number(options.wait) || 0,
        abortThreshold: Number(options.abortThreshold) || 0,
        abort: () => null,
        minRotation: Number(options.minRotation) || 0,
        maxRotation: Number(options.maxRotation) || 0,
        rotationSteps: Math.max(0, Number(options.rotationSteps) || 0),
        shuffle: options.shuffle !== false,
        rotateRatio: Number(options.rotateRatio) || 0,
        shape: options.shape || 'circle',
        ellipticity: Number(options.ellipticity) || 1,
    }
}

function normalizeList(list: any): WordCloud2ListItem[] {
    if (!Array.isArray(list)) {
        return []
    }

    return list
        .map((item) => {
            if (Array.isArray(item)) {
                return [String(item[0] ?? ''), Number(item[1]) || 0, ...item.slice(2)] as WordCloud2ListItem
            }

            if (item && typeof item === 'object') {
                return [String(item.text ?? item.word ?? ''), Number(item.weight ?? item.size) || 0, item.meta].filter((value) => value !== undefined) as WordCloud2ListItem
            }

            return null
        })
        .filter((item): item is WordCloud2ListItem => !!item && !!item[0] && item[1] > 0)
}

function getWordCloud2FontFamily(options: any) {
    if (options.fontFamilyInfo?.id) {
        return `font_${options.fontFamilyInfo.id}`
    }
    return options.fontFamily || 'sans-serif'
}

function createWordCloud2ColorOption(options: any) {
    if (options.colorMode === 'random-dark' || options.colorMode === 'random-light') {
        return options.colorMode
    }

    if (options.colorMode === 'palette') {
        const colors = Array.isArray(options.colors) && options.colors.length ? options.colors : ['#111111']
        return function colorByPalette(word: string, weight: number, fontSize: number, distance: number, theta: number) {
            const index = Math.abs(hashText(word) + Math.round(weight) + Math.round(theta * 100)) % colors.length
            return colors[index]
        }
    }

    return options.color || '#111111'
}

function normalizeOrigin(origin: any, canvas: HTMLCanvasElement) {
    if (!Array.isArray(origin) || origin.length < 2) {
        return null
    }

    const x = Number(origin[0])
    const y = Number(origin[1])
    if (Number.isNaN(x) || Number.isNaN(y)) {
        return null
    }

    return [
        Math.min(canvas.width, Math.max(0, x)),
        Math.min(canvas.height, Math.max(0, y)),
    ]
}

function hashText(text: string) {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i)
        hash |= 0
    }
    return hash
}
