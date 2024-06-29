import { getPositionInfoFromOptions,getRelativeRealPixelSize } from '../helper.tsx'
import { defineComponent, ref } from 'vue'

/*
*/


export const defaultCanvasChildBackgroundOptions = {
    type: 'background',
    backgroundUnit:'px',
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
    width: {
        value:100,
        unit:'px'
    },
    height: {
        value:100,
        unit:'px'
    },
    backgroundColor: '#000',
    mode: 'number'
}

export const Background = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const options = props.options


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
                width: getRelativeRealPixelSize(props.options.width),
                height: getRelativeRealPixelSize(props.options.height),
                background: props.options.backgroundColor,
                flexShrink:0,
                ..._style
            }

            if (props.options.backgroundImage) {
                style.backgroundImage = `url(${props.options.backgroundImage.url})`
            }


            return <div style={containerStyle}>
                <div style={style}></div>
            </div>
        }
    }
})

export function createCanvasChildBackground(options, controller) {
    return <Background options={options}></Background>
}