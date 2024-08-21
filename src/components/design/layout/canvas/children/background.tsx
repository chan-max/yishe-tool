import { canvasStickerOptions,updateRenderingCanvas } from '../index.tsx'
import { getPositionInfoFromOptions, formatToNativeSizeString } from '../helper.tsx'
import { defineComponent, ref, onUpdated, onMounted } from 'vue'
import Utils from '@/common/utils'
import { createFilterDefaultOptions, createTransformDefaultOptions, createPositionDefaultOptions ,createBasicDefaultOptions} from "./defaultOptions.tsx";
/*
*/

export const createDefaultCanvasChildBackgroundOptions = () => {
    const canvasUnit = canvasStickerOptions.value.unit
    return {
        type: 'background',
        ...createBasicDefaultOptions(),
        position: createPositionDefaultOptions(canvasUnit),

        width: {
            value: 100,
            unit: 'vw'
        },
        height: {
            value: 100,
            unit: 'vh'
        },
        backgroundColor: {
            color: '#000',
            type: 'pure'
        },
        transform: createTransformDefaultOptions(canvasUnit),
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex:0,
    }
}

export const Background = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const options = props.options

        const targetEl = ref()

        function setTargetSize() {
            props.options.targetComputedWidth = Utils.getComputedWidth(targetEl.value)
            props.options.targetComputedHeight = Utils.getComputedHeight(targetEl.value)
        }

        onUpdated(setTargetSize)
        onMounted(setTargetSize)

        return () => {

            // 处理布局
            const {
                containerStyle: _containerStyle,
                style: _style
            } = getPositionInfoFromOptions(props.options.position)

            const containerStyle = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: props.options.zIndex,
                ..._containerStyle
            }



            const style = {
                width: formatToNativeSizeString(props.options.width),
                height: formatToNativeSizeString(props.options.height),
                background: props.options.backgroundColor.color,
                flexShrink: 0,
                ..._style
            }

            if (props.options.backgroundImage) {
                style.backgroundImage = `url(${props.options.backgroundImage.url})`
            }


            return <div style={containerStyle}>
                <div ref={targetEl} style={style}></div>
            </div>
        }
    }
})

export function createCanvasChildBackground(options) {
    return <Background options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></Background>
}