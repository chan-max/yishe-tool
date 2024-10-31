import QRCodeStyling from 'qr-code-styling';
import { ref, watchEffect, watch, onUpdated, onMounted } from 'vue'
import { canvasStickerOptions, updateRenderingCanvas } from '../../index.tsx'

import { getPositionInfoFromOptions, formatToNativeSizeString, formatSizeOptionToPixelValue, getPaddingRealPixel, getBorderRadiusRealPixel } from '../../helper.tsx'
import { defineAsyncComponent, defineComponent } from 'vue';

import { createPositionDefaultOptions, createBasicDefaultOptions, } from '../defaultOptions.tsx';

import { parse } from 'gradient-parser'
import { onCanvasChildSetup, onBeforeReturnRender } from '../commonHooks.ts';
import JsBarcode from 'jsbarcode'


import Utils from '@/common/utils'
import { message } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/core';



export const createDefaultCanvasChildBarcodeOptions = () => {
    const canvasUnit = canvasStickerOptions.value.unit
    return {
        barcodeContent: '123456789012',
        barcodeFormat: '',
        position: createPositionDefaultOptions(canvasUnit),
        lineColor: {
            color: "#f00",
            type: 'pure'
        }, // 条形码颜色
        background: {
            color: "#ff0",
            type: 'pure'
        }, // 背景颜色
        margin: {
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
            unit: canvasUnit
        },
        height: {
            value: 100,
            unit: canvasUnit
        },
        ...createBasicDefaultOptions()
    }
}



export const Barcode = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const options = props.options

        const targetElRef = ref()

        onCanvasChildSetup({
            targetEl: targetElRef,
            options: props.options,
            props: props
        })

        function _initBarcode() {
            if (targetElRef.value) {
                try {
                    if (!props.options.barcodeContent) {
                        return
                    }

                    console.log('barcode before create')

                    JsBarcode(targetElRef.value, props.options.barcodeContent, {
                        format: props.options.barcodeFormat, // 设置条形码格式
                        lineColor: props.options.lineColor.color, // 设置条形码颜色
                        width: formatToNativeSizeString(props.options.width),
                        height: formatToNativeSizeString(props.options.height),
                        displayValue: false, // 是否显示文本值
                        background: props.options.background.color,
                        marginTop: formatSizeOptionToPixelValue(props.options.margin.top),
                        marginRight: formatSizeOptionToPixelValue(props.options.margin.right),
                        marginBottom: formatSizeOptionToPixelValue(props.options.margin.bottom),
                        marginLeft: formatSizeOptionToPixelValue(props.options.margin.left),
                        margin: 0 // 这里如果不设置，会始终显示一段多余边框
                    });
                } catch (e) {
                    message.error('条形码生成错误 :' + (e.message || '未知错误'))
                }
            }
        }

        const initBarcode = useDebounceFn(_initBarcode)

        onMounted(initBarcode)
        watch(props, initBarcode, { deep: true })

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
                ..._containerStyle
            }



            const style = {
                // width: formatToNativeSizeString(props.options.width),
                // height: formatToNativeSizeString(props.options.height),
                flexShrink: 0,
                zIndex: props.options.zIndex,
                ..._style,
            }


            onBeforeReturnRender({
                style,
                options: props.options
            })

            return <div style={containerStyle}>
                <canvas style={style} ref={targetElRef}></canvas>
            </div>
        }
    }
})

export function createCanvasChildBarcode(options) {
    return <Barcode options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></Barcode>
}





