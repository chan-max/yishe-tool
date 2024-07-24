import { canvasStickerOptions, currentCanvasControllerInstance, updateRenderingCanvas } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeString, createFilterFromOptions, createTransformString } from '../helper.tsx'
import { computed, defineComponent, onUpdated, ref } from "vue"
import { createFilterDefaultOptions, createPositionDefaultOptions, createTransformDefaultOptions } from "./defaultOptions.tsx"

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
        ...createTransformDefaultOptions(canvasUnit),
        imageInfo: null,
        objectFit: 'contain',
        ...createFilterDefaultOptions(canvasUnit),
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

        const imgUrl = computed(() => {
            return props.options.imageInfo ? props.options.imageInfo.url : null
        })


        // 图片是否加载失败
        let loadError = ref(false)

        function onLoad() {
            loadError.value = false
        }

        function onError() {
            loadError.value = true
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
                transform: createTransformString(props.options),
                width: formatToNativeSizeString(props.options.width),
                height: formatToNativeSizeString(props.options.height),
                objectFit: props.options.objectFit,
                filter: createFilterFromOptions(props.options),
                zIndex: props.options.zIndex,
                ..._style,
            }



            return <div style={containerStyle}>

                {
                    !imgUrl.value
                        ? '未选择图片'
                        : loadError.value
                            ? '图片加载失败'
                            : <img onLoad={onLoad} onError={onError} src={imgUrl.value} style={style}></img>
                }

            </div>
        }
    }
})




