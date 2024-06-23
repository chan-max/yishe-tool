import { ref, computed, shallowRef, nextTick, watch } from 'vue'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { htmlToPngFile, downloadByFile } from '@/common/transform'
import { useDebounceFn } from '@vueuse/core'
import { waitImage } from '@/common'
import { createCanvasChildText } from './children/text.tsx'

export const canvasOptions = ref({
    width: 1000,
    height: 1000,
    aspectRatio: 1,
    children: [{
        type: 'canvas'
    }],
})

// 保留两位小数
function toFixed2(val): any {
    return parseFloat(val).toFixed(2);
}

watch(() => canvasOptions.value.width, updateAspectRatio)

watch(() => canvasOptions.value.height, updateAspectRatio)

watch(() => canvasOptions.value.aspectRatio, () => {
    canvasOptions.value.height = toFixed2(canvasOptions.value.width / canvasOptions.value.aspectRatio)
})

function updateAspectRatio() {
    canvasOptions.value.aspectRatio = toFixed2(canvasOptions.value.width / canvasOptions.value.height)
}


export enum CanvasChildType {
    CANVAS = 'canvas', // 画布
    TEXT = 'text',
    BACKGROUHND = 'background',
    IMAGE = 'image',
}

export function getCanvasChildLabel(val) {
    switch (val) {
        case 'text':
            return '文字类'
        case 'image':
            return '图片'
        case 'svg':
            return '矢量图'
        case 'background':
            return '背景'
        case 'qrcode':
            return '二维码'
        case 'barcode':
            return '条形码 '
        case 'canvas':
            return '画布'
    }
}


interface CanvasChild {
    type: CanvasChildType
}

interface CanvasOptions {
    width: number | string,
    height: number | string,
    children: CanvasChild[],
    showMainCanvas: boolean // 编辑时是否展示主画布
}








function createCanvasChild(options) {
    if (options.type == CanvasChildType.TEXT) {
        return createCanvasChildText(options)
    }
}


export function addCanvasChild(options) {

    options = {
        type: 'text',
        position: {
            center: true,
            verticalCenter: true,
            horizontalCenter: true,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        skewX:0,
        skewY:0,
        ...options
    }

    canvasOptions.value.children.push(options)

    // 返回最新的索引
    return canvasOptions.value.children.length - 1
}


export const childrenTabActive = ref(0)



export function removeCavnasChild(index) {

    if (index == 0) {
        return
    }

    canvasOptions.value.children.splice(index, 1)
    childrenTabActive.value = index - 1
}

function calcCanvasDisplayTransformScale(max) {
    let m = Math.max(canvasOptions.value.width, canvasOptions.value.height)
    return `scale(${max / m}, ${max / m}`
}

const canvasControllerInstance = shallowRef(null)

export class CanvasController {
    target = null
    constructor() {
        canvasControllerInstance.value = this
        this.updateCanvas = useDebounceFn(this.updateCanvas, 666).bind(this)
    }

    shouldUpdate = true

    loading = ref(false)

    el = null


    render(h) {

    }


    getContainerRender() {

    }

    async exportPng() {
        const file = await htmlToPngFile(this.el)
        return file
    }

    async downloadPng() {
        downloadByFile(await this.exportPng())
    }

    getEl(e) {
        this.el = e
    }

    canvasEl = null

    getCanvasEl(e) {
        this.canvasEl = e
    }

    get ctx() {
        return this.canvasEl.getContext('2d')
    }

    renderParams = null


    getBase64() {
        return this.canvasEl.toDataURL('image/png')
    }

    drawImage(img) {
        img.setAttribute('crossorigin', 'anonymous');
        this.ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    updating = false

    async updateCanvas() {

        if (this.updating) {
            return
        }

        this.updating = true
        this.clearCanvas()
        let elBase64 = await toPng(this.el) // 会有页面卡顿的问题
        let img = document.createElement('img')
        img.width = canvasOptions.value.width
        img.height = canvasOptions.value.height
        document.body.appendChild(img)
        img.src = elBase64
        await waitImage(img)
        this.drawImage(img)
        await nextTick()
        this.loading.value = false
        this.updating = false
    }


    clearCanvas() {
        this.canvasEl.width = this.canvasEl.width
    }

    getRender(params) {
        this.renderParams = params
        return (props) => {
            // 画布的最大尺寸
            this.loading.value = true
            this.shouldUpdate = false
            this.updateCanvas.call(this)

            const containerStyle: any = {
                width: canvasOptions.value.width + 'px',
                height: canvasOptions.value.height + 'px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform: calcCanvasDisplayTransformScale(params.max),
                flexShrink: 0,
                position: "relative",
            }

            let style = {
                flexShrink: 0,
                width: canvasOptions.value.width + 'px',
                height: canvasOptions.value.height + 'px',
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0
            }

            const canvasStyle = {
                position: "absolute",
                top: 0,
                left: 0,
                background: 'red',
                zIndex: 1
            }

            let children = canvasOptions.value.children.map((opts) => {
                return createCanvasChild(opts)
            })

            return <div style={containerStyle}>
                {/* 真是转换的元素 */}
                <div style={style} ref={this.getEl.bind(this)}>
                    {children}
                </div>
                {/* 真实的画布 */}
                <canvas class="png-background" ref={this.getCanvasEl.bind(this)} style={canvasStyle} width={canvasOptions.value.width} height={canvasOptions.value.height}></canvas>
            </div>
        }
    }
}

// htmlToImage.toCanvas(document.getElementById('my-node'))
//   .then(function (canvas) {
//     document.body.appendChild(canvas);
//   });

