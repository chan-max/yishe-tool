import QRCodeStyling from 'qr-code-styling';
import { ref, watchEffect } from 'vue'
import { updateCanvas } from '../index.tsx'

import { getPositionInfoFromOptions, getRelativeRealPixelSize, getRelativeRealPixelValue, getPaddingRealPixel, getBorderRadiusRealPixel } from '../helper.tsx'
import { defineAsyncComponent, defineComponent } from 'vue';

/*
    
*/
export const defaultCanvasChildQrcodeOptions = {
    type: 'qrcode',
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
    padding: {
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
        value: 100,
        unit: 'px'
    },
    height: {
        value: 100,
        unit: 'px'
    },
    backgroundColor: '#000',
    backgroundUnit: 'px',
    qrcodeContent: '1s.design',
    borderRadius: {
        leftTop: {
            value: 0,
            unit: 'px',
        },
        rightTop: {
            value: 0,
            unit: 'px',
        },
        rightBottom: {
            value: 0,
            unit: 'px',
        },
        leftBottom: {
            value: 0,
            unit: 'px',
        }
    }
}


async function createQrcodeUrl(options) {
    const qrCode = new QRCodeStyling({
        width: getRelativeRealPixelValue(options.width),
        height: getRelativeRealPixelValue(options.height),
        type: "svg",
        data: options.qrcodeContent,
        image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: 'transparent',
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
        }
    });

    const file = await qrCode.getRawData()
    return URL.createObjectURL(file)
}

export const Qrcode = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const options = props.options

        const qrcodeUrl = ref()

        watchEffect(() => {
            createQrcodeUrl(props.options).then((url) => {
                qrcodeUrl.value = url
            })
        })

        return () => {

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

            let width = getRelativeRealPixelSize(props.options.width)
            let height = getRelativeRealPixelSize(props.options.height)

            let realWidthValue = getRelativeRealPixelValue(props.options.width)
            let realHeightValue = getRelativeRealPixelValue(props.options.height)

            let padding = getPaddingRealPixel(props.options.padding, {
                width: realWidthValue,
                height: realHeightValue,
            })

            const borderRadius = getBorderRadiusRealPixel(props.options.borderRadius,{
                width: realWidthValue,
                height: realHeightValue
            })

            const style = {
                width,
                height,
                flexShrink: 0,
                background: props.options.backgroundColor,
                padding,
                borderRadius,
                ..._style,
            }

            return <div style={containerStyle}>
                {qrcodeUrl.value ? <img onLoad={updateCanvas} style={style} src={qrcodeUrl.value}></img> : null}
            </div>
        }
    }
})

export function createCanvasChildQrcode(options, controller) {
    return <Qrcode options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Qrcode>
}




