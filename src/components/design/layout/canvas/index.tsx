import { ref, computed, shallowRef, nextTick, watch, defineAsyncComponent, defineComponent } from 'vue'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { htmlToPngFile, downloadByFile } from '@/common/transform'
import { useDebounceFn } from '@vueuse/core'
import { waitImage } from '@/common'
import { createCanvasChildSvg } from './children/svg/svg.tsx'
import { initDraggableElement } from "@/components/design/utils/draggable";
import { createCanvasChildText, createDefaultCanvasChildTextOptions } from './children/text/text.tsx'
import { createCanvasChildBackground, createDefaultCanvasChildBackgroundOptions } from './children/background.tsx'
import { createDefaultCanvasChildQrcodeOptions, createCanvasChildQrcode, } from './children/qrcode.tsx'
import {
    createDefaultCanvasChildSvgRectOptions,
    createCanvasChildRect,
    createCanvasChildEllipse,
    createDefaultCanvasChildSvgEllipseOptions
} from './children/svg/svg.tsx'
import {
    createCanvasChildImage,
    createDefaultCanvasChildImageOptions
} from './children/image.tsx'

import { createDefaultCanvasChildcanvasStickerOptions } from './children/canvas'

import { Canvas } from './children/canvas.tsx'
import { createFilterDefaultOptions } from './children/defaultOptions.tsx'

/*
    画布参数
*/
export const canvasStickerOptions = ref({
    width: 500,
    height: 500,
    unit: 'px',
    showCanvasRealSize: false,
    supportBackgroundColor: {
        type: 'pure',
        color: 'rgba(0,0,0,0)'
    },
    svgFilter: {
        children: []
    },
    children: [
        // 默认会存在一个画布元素
        createDefaultCanvasChildcanvasStickerOptions()
    ],
})



// 获取子元素最高层级的元素，而不是获取该层级 ， 有多个返回第一个
export function getCanvasTopZIndexChild() {
    const maxIndex = Math.max(...canvasStickerOptions.value.children.map((item: any) => item.zIndex).filter(Boolean));
    let maxChild: any = canvasStickerOptions.value.children.find((item: any) => item.zIndex === maxIndex);

    return maxChild
}

export function getCanvasChildTopZIndex() {
    return getCanvasTopZIndexChild()?.zIndex || 0
}





export enum CanvasChildType {
    CANVAS = 'canvas', // 画布
    TEXT = 'text',
    BACKGROUHND = 'background',
    IMAGE = 'image',
    QRCODE = 'qrcode',
    RECT = 'rect',
    ELLIPSE = 'ellipse',
}


export const canvasChildLabelMap = {
    [CanvasChildType.CANVAS]: '画布',
    [CanvasChildType.TEXT]: '文字',
    [CanvasChildType.BACKGROUHND]: '背景',
    [CanvasChildType.IMAGE]: '图片',
    [CanvasChildType.QRCODE]: '二维码',
    [CanvasChildType.RECT]: '矩形',
    [CanvasChildType.ELLIPSE]: '圆和椭圆',
}

export const canvasChildDefaultOptionsMap = {
    [CanvasChildType.CANVAS]: null,
    [CanvasChildType.TEXT]: createDefaultCanvasChildTextOptions,
    [CanvasChildType.BACKGROUHND]: createDefaultCanvasChildBackgroundOptions,
    [CanvasChildType.IMAGE]: createDefaultCanvasChildImageOptions,
    [CanvasChildType.QRCODE]: createDefaultCanvasChildQrcodeOptions,
    [CanvasChildType.RECT]: createDefaultCanvasChildSvgRectOptions,
    [CanvasChildType.ELLIPSE]: createDefaultCanvasChildSvgEllipseOptions,
}

export const canvasChildRenderMap = {
    [CanvasChildType.CANVAS]: null,
    [CanvasChildType.TEXT]: createCanvasChildText,
    [CanvasChildType.BACKGROUHND]: createCanvasChildBackground,
    [CanvasChildType.IMAGE]: createCanvasChildImage,
    [CanvasChildType.QRCODE]: createCanvasChildQrcode,
    [CanvasChildType.RECT]: createCanvasChildRect,
    [CanvasChildType.ELLIPSE]: createCanvasChildEllipse,
}


interface CanvasChild {
    type: CanvasChildType
}

interface canvasStickerOptions {
    width: number | string,
    height: number | string,
    children: CanvasChild[],
}



/*
    是否展示主画布
*/
export const showMainCanvas = ref(true)



// 添加画布子元素

var canvas_child_id = 0

export function addCanvasChild(options) {
    let index = canvasStickerOptions.value.children.length

    options = {
        ...canvasChildDefaultOptionsMap[options.type].call(null),
        ...options,
        id: canvas_child_id++,
    }

    canvasStickerOptions.value.children.push(options)
    currentOperatingCanvasChildIndex.value = index
}

// 当前正在操作的元素
export const currentOperatingCanvasChildIndex = ref(0)

export const currentOperatingCanvasChild: any = computed(() => {
    let child = canvasStickerOptions.value.children[currentOperatingCanvasChildIndex.value]

    if (!child) {
        currentOperatingCanvasChildIndex.value = 0
        return canvasStickerOptions.value.children[0]
    }

    return child
})

export function removeCavnasChild(index) {
    if (index == 0) {
        return
    }

    canvasStickerOptions.value.children.splice(index, 1)
    currentOperatingCanvasChildIndex.value = index - 1
}



export const currentCanvasControllerInstance = shallowRef(null)


export function updateCanvas() {
    currentCanvasControllerInstance.value?.updateCanvas()
}


function createCanvasChild(options) {
    if (!canvasChildRenderMap[options.type]) {
        return
    }
    return canvasChildRenderMap[options.type]?.call(null, options)
}

export class CanvasController {
    target = null
    constructor(params) {
        currentCanvasControllerInstance.value = this
        // this.updateCanvas = useDebounceFn(this.updateCanvas, 666).bind(this)
        this.maxDisplaySize = params.max
    }

    maxDisplaySize = null

    loading = ref(false)

    async exportPng() {
        const file = await htmlToPngFile(this.el)
        return file
    }

    async downloadPng() {
        downloadByFile(await this.exportPng())
    }


    canvasId = 'canvas-display-el'

    rawId = 'canvas-raw-el'

    get el() {
        return document.querySelector('#' + this.rawId) as any
    }


    get canvasEl() {
        return document.querySelector('#' + this?.canvasId) as any
    }


    get ctx() {
        if (!this.canvasEl) {
            return null
        }
        return this.canvasEl.getContext('2d')
    }

    getBase64() {
        return this.canvasEl.toDataURL('image/png')
    }

    drawImage(img) {
        if (!this.ctx) {
            return
        }
        img.setAttribute('crossorigin', 'anonymous');
        this.ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    // 需要组件渲染后再更新
    async updateCanvas() {
        this.loading.value = true
        clearTimeout(this.updateWorker);
        this.updateWorker = setTimeout(() => {
            this.addTask(this.updateCanvasJob);
        }, this.updateWorkDelay);
    }

    addTask(task) {
        this.updateQueue.push(task);
        this.run();
    }

    run() {
        if (!this.isUpdating && this.updateQueue.length) {
            this.isUpdating = true;
            const task = this.updateQueue.shift();
            task.call(this).then(() => {
                this.isUpdating = false;
                this.run();
            });
        }
    }


    updateQueue = []; // 画布更新队列
    isUpdating = false; // 是否正在更新
    updateWorker = null; // 更新任务
    updateWorkDelay = 999; // 更新延迟

    async updateCanvasJob() {
        if (!this.el) {
            return
        }

        async function update() {
            let base64 = await toPng(this.el) // 会有页面卡顿的问题
            let img = document.createElement('img')
            img.width = canvasStickerOptions.value.width
            img.height = canvasStickerOptions.value.height
            document.body.appendChild(img)
            img.src = base64
            await waitImage(img)
            this.clearCanvas()
            this.drawImage(img)
            await nextTick()
            document.body.removeChild(img)
            this.initDraggable(base64)
            this.loading.value = false
        }

        try {
            await update.call(this)
        } catch (e) {
            console.error('画布渲染：存在丢失的元素')
            this.loading.value = false
        }
    }


    initDraggable(base64) {
        initDraggableElement(this.canvasEl, () => {
        }, () => base64)
    }

    clearCanvas() {
        if (!this.canvasEl) {
            return
        }
        this.canvasEl.width = this.canvasEl?.width
    }


    // 画布元素是否在加载中
    pending = ref(false)

    getRender() {

        // 改为异步组件
        function render() {

            const children = canvasStickerOptions.value.children.map((childOptions) => {
                return createCanvasChild(childOptions)
            })

            this.updateCanvas()

            return <Canvas options={canvasStickerOptions.value.children.find((item) => item.type == 'canvas')}>
                {children}
            </Canvas>
        }

        return render.bind(this)
    }
}

