import { canvasStickerOptions, currentCanvasControllerInstance, updateRenderingCanvas } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeString, createFilterFromOptions, createTransformString } from '../helper.tsx'
import { computed, defineComponent, onUpdated, ref } from "vue"
import { createFilterDefaultOptions, createPositionDefaultOptions, createTransformDefaultOptions } from "./defaultOptions.tsx"
import Utils from '@/common/utils'
import { useProps } from "vue"


export const createDefaultCanvasChildImageOptions = () => {

    const canvasUnit = canvasStickerOptions.value.unit

    return {
        type: 'image',
        position: createPositionDefaultOptions(canvasUnit),
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        transform: createTransformDefaultOptions(canvasUnit),
        imageInfo: null,
        objectFit: 'contain',
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex: 0,
    }
}



export function createCanvasChildImage(options) {
    return <Image options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></Image>
}

export const Image = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {


        const targetRef = ref()

        onUpdated(() => {
            props.options.targetComputedWidth = Utils.getComputedWidth(targetRef.value)
            props.options.targetComputedHeight = Utils.getComputedHeight(targetRef.value)
        })

        const imgUrl = computed(() => {
            return props.options.imageInfo ? props.options.imageInfo.url : null
        })


        // 图片是否加载失败
        let loadError = ref(false)

        let loading = ref(true)

        function onLoad() {
            loadError.value = false
            loading.value = false
        }

        function onError() {
            loadError.value = true
            loading.value = false
        }




        return () => {

            const {
                containerStyle: _containerStyle,
                style: _style
            } = getPositionInfoFromOptions(props.options.position)


            var containerStyle: any = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: props.options.zIndex,
                ..._containerStyle
            }


            var style: any = {
                flexShrink: 0,
                transform: createTransformString(props.options.transform),
                width: formatToNativeSizeString(props.options.width),
                height: formatToNativeSizeString(props.options.height),
                objectFit: props.options.objectFit,
                filter: createFilterFromOptions(props.options.filter),
                zIndex: props.options.zIndex,
                ..._style,
            }


            const imgDiaplay = computed(() => {
                return true
            })


            return <div style={containerStyle}>
                {!imgUrl.value && '未选择图片'}
                {loadError.value && '图片加载失败'}
                {<img ref={targetRef} onLoad={onLoad} onError={onError} src={imgUrl.value} style={{ ...style, display: imgDiaplay.value }}></img>}
            </div>
        }
    }
})




