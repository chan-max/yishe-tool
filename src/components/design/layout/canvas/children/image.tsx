import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../index.tsx"
import { getPositionInfoFromOptions, getRelativeRealPixelSize } from '../helper.tsx'
import { defineComponent, onUpdated } from "vue"



export const defaultCanvasChildImageOptions = {
    type: 'image',
    position: {
        center: true,
        verticalCenter: true,
        horizontalCenter: true,
        top: {
            value: 0,
            unit: 'px'
        },
        left: {
            value: 0,
            unit: 'px'
        },
        bottom: {
            value: 0,
            unit: 'px'
        },
        right: {
            value: 0,
            unit: 'px'
        }
    },
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0,
    imageInfo:null
}



export function createCanvasChildImage(options) {
    return <Image options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Image>
}

export const Image = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const options = props.options

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
                transform: `scale3d(${props.options.scaleX ?? 1}, ${props.options.scaleY ?? 1}, ${props.options.scaleZ ?? 1}) rotateX(${props.options.rotateX ?? 0}deg) rotateY(${props.options.rotateY ?? 0}deg) rotateZ(${props.options.rotateZ ?? 0}deg) skew(${props.options.skewX ?? 0}deg, ${props.options.skewY ?? 0}deg)`,
                ..._style
            }

            return <div style={containerStyle}>
                <img src={''} style={style}></img>
            </div>
        }
    }
})