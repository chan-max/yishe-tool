import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeString, createFilterFromOptions, createTransformString } from '../helper.tsx'
import { computed, defineComponent, onUpdated, ref } from "vue"

export const createDefaultCanvasChildImageOptions = () => {

    const canvasUnit = canvasOptions.value.unit

    return {
        type: 'image',
        position: {
            center: true,
            verticalCenter: true,
            horizontalCenter: true,
            top: {
                value: 0,
                unit: canvasUnit
            },
            left: {
                value: 0,
                unit: canvasUnit
            },
            bottom: {
                value: 0,
                unit: canvasUnit
            },
            right: {
                value: 0,
                unit: canvasUnit
            }
        },
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        skewX: 0,
        skewY: 0,
        imageInfo: null,
        objectFit: 'contain',
        filterBlur: {
            value: 0,
            unit: canvasUnit
        },
        filterBrightness: 100, // 亮度百分比，默认为100 ，正常
        filterContrast: 100, // 对比度
        filterGrayscale: 0, // 灰度
        filterHueRotate: 0, // 色相旋转
        filterInvert: 0, // 反转输入
        filterOpacity: 100, // 透明度
        filterSaturate: 100, // 饱和度
        filterSepia: 0, // 褐色
        zIndex: 0,
    }
}



export function createCanvasChildImage(options) {
    return <Image options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Image>
}

export const Image = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const imgUrl = computed(() => {
            return props.options.imageInfo ? props.options.imageInfo.url : null
        })

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
                zIndex:props.options.zIndex,
                ..._style,
            }



            return <div style={containerStyle}>
                <img src={imgUrl.value} style={style}></img>
            </div>
        }
    }
})




