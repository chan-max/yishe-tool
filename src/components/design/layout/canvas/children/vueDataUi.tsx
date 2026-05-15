import { computed, defineComponent, ref } from 'vue'
import { VueDataUi } from 'vue-data-ui'
import 'vue-data-ui/style.css'
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

export const VUE_DATA_UI_COMPONENTS = [
    // Charts
    { value: 'VueUiAgePyramid', label: '年龄金字塔', category: 'Charts' },
    { value: 'VueUiBump', label: 'Bump 图', category: 'Charts' },
    { value: 'VueUiCandlestick', label: 'K线图', category: 'Charts' },
    { value: 'VueUiChestnut', label: '栗子图', category: 'Charts' },
    { value: 'VueUiChord', label: '和弦图', category: 'Charts' },
    { value: 'VueUiCirclePack', label: '圆形打包', category: 'Charts' },
    { value: 'VueUiDag', label: 'DAG 图', category: 'Charts' },
    { value: 'VueUiDonut', label: '环形图', category: 'Charts' },
    { value: 'VueUiDonutEvolution', label: '环形演变', category: 'Charts' },
    { value: 'VueUiDumbbell', label: '哑铃图', category: 'Charts' },
    { value: 'VueUiFlow', label: '流程图', category: 'Charts' },
    { value: 'VueUiFunnel', label: '漏斗图', category: 'Charts' },
    { value: 'VueUiGalaxy', label: '星系图', category: 'Charts' },
    { value: 'VueUiGauge', label: '仪表盘', category: 'Charts' },
    { value: 'VueUiHeatmap', label: '热力图', category: 'Charts' },
    { value: 'VueUiHistoryPlot', label: '历史图', category: 'Charts' },
    { value: 'VueUiHorizontalBar', label: '水平条形图', category: 'Charts' },
    { value: 'VueUiMolecule', label: '分子图', category: 'Charts' },
    { value: 'VueUiMoodRadar', label: '情绪雷达', category: 'Charts' },
    { value: 'VueUiNestedDonuts', label: '嵌套环形', category: 'Charts' },
    { value: 'VueUiOnion', label: '洋葱图', category: 'Charts' },
    { value: 'VueUiQuadrant', label: '四象限', category: 'Charts' },
    { value: 'VueUiQuickChart', label: '快速图表', category: 'Charts' },
    { value: 'VueUiRadar', label: '雷达图', category: 'Charts' },
    { value: 'VueUiRelationCircle', label: '关系圆', category: 'Charts' },
    { value: 'VueUiRidgeline', label: '脊线图', category: 'Charts' },
    { value: 'VueUiRings', label: '环形图', category: 'Charts' },
    { value: 'VueUiScatter', label: '散点图', category: 'Charts' },
    { value: 'VueUiStackbar', label: '堆叠条形图', category: 'Charts' },
    { value: 'VueUiStackline', label: '堆叠线图', category: 'Charts' },
    { value: 'VueUiStripPlot', label: '条带图', category: 'Charts' },
    { value: 'VueUiThermometer', label: '温度计', category: 'Charts' },
    { value: 'VueUiTiremarks', label: '轮胎标记', category: 'Charts' },
    { value: 'VueUiTreemap', label: '树状图', category: 'Charts' },
    { value: 'VueUiWaffle', label: '华夫图', category: 'Charts' },
    { value: 'VueUiWheel', label: '轮盘', category: 'Charts' },
    { value: 'VueUiWordCloud', label: '词云', category: 'Charts' },
    { value: 'VueUiXy', label: 'XY 图表', category: 'Charts' },
    { value: 'VueUiXyCanvas', label: 'XY 画布', category: 'Charts' },
    // Mini charts
    { value: 'VueUiSparkHistogram', label: '迷你直方图', category: 'Mini' },
    { value: 'VueUiSparkbar', label: '迷你条形图', category: 'Mini' },
    { value: 'VueUiSparkgauge', label: '迷你仪表', category: 'Mini' },
    { value: 'VueUiSparkline', label: '迷你线图', category: 'Mini' },
    { value: 'VueUiSparkStackbar', label: '迷你堆叠条', category: 'Mini' },
    { value: 'VueUiSparkTrend', label: '迷你趋势', category: 'Mini' },
    { value: 'VueUiBullet', label: '子弹图', category: 'Mini' },
    // 3D
    { value: 'VueUi3dBar', label: '3D 条形图', category: '3D' },
    // Tables
    { value: 'VueUiTableHeatmap', label: '表格热力图', category: 'Table' },
    { value: 'VueUiTableSparkline', label: '表格迷你图', category: 'Table' },
    { value: 'VueUiTable', label: '数据表格', category: 'Table' },
    { value: 'VueUiCarouselTable', label: '轮播表格', category: 'Table' },
    // Rating
    { value: 'VueUiRating', label: '评分', category: 'Rating' },
    { value: 'VueUiSmiley', label: '表情评分', category: 'Rating' },
]

export const createDefaultCanvasChildVueDataUiOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'vueDataUi',
        component: 'VueUiDonut',
        config: {},
        dataset: [
            { name: '项目 A', values: [30] },
            { name: '项目 B', values: [25] },
            { name: '项目 C', values: [20] },
            { name: '项目 D', values: [15] },
            { name: '项目 E', values: [10] },
        ],
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

export function createCanvasChildVueDataUi(options) {
    return <VueDataUiChild options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></VueDataUiChild>
}

export const VueDataUiChild = defineComponent({
    props: {
        options: null,
    },
    setup(props) {
        const targetRef = ref<HTMLElement>()

        onCanvasChildSetup({
            targetEl: targetRef,
            options: props.options,
            props,
        })

        const component = computed(() => String(props.options?.component || 'VueUiDonut'))
        const config = computed(() => props.options?.config || {})
        const dataset = computed(() => props.options?.dataset || [])

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
                    <VueDataUi
                        component={component.value}
                        config={config.value}
                        dataset={dataset.value}
                    />
                </div>
            </div>
        }
    },
})
