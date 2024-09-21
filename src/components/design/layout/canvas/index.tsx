import { ref, computed, shallowRef, nextTick, watch, defineAsyncComponent, defineComponent, shallowReactive } from 'vue'
import { toPng, toJpeg, toBlob, toPixelData, toSvg, toCanvas } from "html-to-image";
import { htmlToPngFile, downloadByFile } from '@/common/transform'
import { useDebounceFn } from '@vueuse/core'
import { waitImage } from '@/common'
import { createCanvasChildSvg } from './children/svg/svg.tsx'
import { initDraggableElement } from "@/components/design/utils/draggable";
import { createCanvasChildText, createDefaultCanvasChildTextOptions } from './children/text/text.tsx'
import { createCanvasChildBackground, createDefaultCanvasChildBackgroundOptions } from './children/background/index.tsx'
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



import { createCanvasChildRawCanvas, createDefaultCanvasChildRawCanvasOptions } from './children/rawCanvas.tsx'

import { createDefaultCanvasChildcanvasStickerOptions } from './children/canvas'

import { Canvas } from './children/canvas.tsx'
import { createFilterDefaultOptions } from './children/defaultOptions.tsx'

import Utils from '@/common/utils'

import { currentModelController } from '@/components/design/store'

import { imageDataToFile } from '@/common/transform'
import { defineCanvasChild } from './children/define.tsx';

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
        // 正在操作的自定义的滤镜元素， 只存在一个
        children: [],

        // 内置的滤镜
        // builtInSvgFilters: [],
    },
    children: [
        // 默认会存在一个画布元素
        createDefaultCanvasChildcanvasStickerOptions()
    ],
})



// 获取子元素最高层级的元素，而不是获取该层级 ， 有多个返回第一个
export function getCanvasTopZIndexChild() {
    let children = canvasStickerOptions.value.children

    const maxIndex = Math.max(...children.map((item: any) => item.zIndex).filter(Boolean));
    let maxChild: any = children.find((item: any) => item.zIndex == maxIndex);

    return maxChild
}

export function getCanvasChildTopZIndex() {
    return getCanvasTopZIndexChild()?.zIndex || 0
}

/**
 * 这里会默认的留一个画布元素
*/

export const CanvasChildType = {
    canvas: 'canvas', // 画布
}

export const canvasChildLabelMap = {
    [CanvasChildType.canvas]: '画布',
}

export const canvasChildDefaultOptionsMap = {
    [CanvasChildType.canvas]: null,
}

export const canvasChildRenderMap = {
    [CanvasChildType.canvas]: null,
}

import backgroundLayout from './operateLayout/background.vue'
import canvasLayout from './operateLayout/canvas.vue'
import textLayout from './operateLayout/text.vue'
import imageLayout from './operateLayout/image.vue'
import rawCanvasLayout from './operateLayout/rawCanvas.vue'
import qrcodeLayout from './operateLayout/qrcode.vue'
import rectLayout from './operateLayout/rect.vue'
import ellipseLayout from './operateLayout/ellipse.vue'


export const CanvasChildOperationComponentMap = {
    [CanvasChildType.canvas]: canvasLayout
}



defineCanvasChild({
    typeName: 'text',
    typeKey: 'text',
    label: '文字',
    defaultOptionsCreator: createDefaultCanvasChildTextOptions,
    renderer: createCanvasChildText,
    operationLayout: textLayout
})

defineCanvasChild({
    typeName: 'background',
    typeKey: 'background',
    label: '背景',
    defaultOptionsCreator: createDefaultCanvasChildBackgroundOptions,
    renderer: createCanvasChildBackground,
    operationLayout: backgroundLayout
})

defineCanvasChild({
    typeName: 'image',
    typeKey: 'image',
    label: '图片',
    defaultOptionsCreator: createDefaultCanvasChildImageOptions,
    renderer: createCanvasChildImage,
    operationLayout: imageLayout
})



/*
    是否展示主画布
*/
export const showMainCanvas = ref(true)

export function addCanvasChild(options) {

    let index = canvasStickerOptions.value.children.length

    options = {
        id: crypto.randomUUID().toString(),
        ...canvasChildDefaultOptionsMap[options.type].call(null),
        ...options,
    }

    canvasStickerOptions.value.children.push(options)
    currentOperatingCanvasChildId.value = options.id
}



// 当前正在操作的元素id
export const currentOperatingCanvasChildId = ref('canvas_id')

export const currentOperatingCanvasChild: any = computed(() => {

    let child = canvasStickerOptions.value.children.find((c) => c.id == currentOperatingCanvasChildId.value)

    if (!child) {
        currentOperatingCanvasChildId.value = canvasStickerOptions.value.children[0].id
        return canvasStickerOptions.value.children[0]
    }
    return child
})

export function removeCavnasChild(id) {
    if (id == 'canvas_id') {
        return
    }

    let child = canvasStickerOptions.value.children.find(child => child.id == id)

    let index = canvasStickerOptions.value.children.indexOf(child)

    canvasStickerOptions.value.children.splice(index, 1)
}



export const currentCanvasControllerInstance = shallowRef(null)


export function updateRenderingCanvas() {
    currentCanvasControllerInstance.value?.updateRenderingCanvas()
}

function createCanvasChild(options) {
    if (!canvasChildRenderMap[options.type]) {
        return
    }
    return canvasChildRenderMap[options.type]?.call(null, options)
}



export const renderingLoading = ref(false)

export class CanvasController {

    target = null

    constructor(params) {
        currentCanvasControllerInstance.value = this
        // this.updateRenderingCanvas = useDebounceFn(this.updateRenderingCanvas, 666).bind(this)
        this.maxDisplaySize = params.max
    }

    // 保存最近的画布base64 格式
    base64 = null

    maxDisplaySize = null

    loading = ref(false)

    async toPngFile() {
        const file = await htmlToPngFile(this.el)
        return file
    }

    async downloadTrimmedPng() {
        const imageData = this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
        const trimmed = Utils.trimImageData(imageData)

        downloadByFile(imageDataToFile(trimmed))
    }

    async downloadPng() {
        const imageData = this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
        downloadByFile(imageDataToFile(imageData))
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
    async updateRenderingCanvas() {
        // this.loading.value = true
        // renderingLoading.value = true
        // clearTimeout(this.updateWorker);
        // this.updateWorker = setTimeout(() => {
        //     this.addTask(this.updateRenderingCanvasJob);
        // }, this.updateWorkDelay);

        this.loading.value = true
        renderingLoading.value = true

        this.debouncedUpdateJob()
    }


    // addTask(task) {
    //     this.updateQueue.push(task);
    //     this.run();
    // }

    // run() {
    //     if (!this.isUpdating && this.updateQueue.length) {
    //         this.isUpdating = true;
    //         const task = this.updateQueue.shift();
    //         task.call(this).then(() => {
    //             this.isUpdating = false;
    //             this.run();
    //         });
    //     }
    // }


    // updateQueue = []; // 画布更新队列
    // isUpdating = false; // 是否正在更新
    // updateWorker = null; // 更新任务
    // updateWorkDelay = 999; // 更新延迟

    debouncedUpdateJob = useDebounceFn(this.updateRenderingCanvasJob.bind(this), 999)

    async updateRenderingCanvasJob() {
        if (!this.el) {
            return
        }

        // // 暂时先不更新
        // this.loading.value = false
        // renderingLoading.value = false
        // return


        async function update() {

            try {
                // this.base64 = await toPng(this.el)
                let _canvas = await toCanvas(this.el)
                let _ctx = _canvas.getContext('2d')
                const imageData = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);

                this.ctx.putImageData(imageData, 0, 0);
                this.base64 = _canvas.toDataURL('image/png')
            } catch (e) {
                throw Error('元素转换失败', e.message)
            }


            // let img = document.createElement('img')
            // img.width = canvasStickerOptions.value.width
            // img.height = canvasStickerOptions.value.height
            // document.body.appendChild(img)
            // img.src = this.base64
            // await waitImage(img)
            // this.clearCanvas()
            // this.drawImage(img)
            // await nextTick()
            // document.body.removeChild(img)

            this.loading.value = false
            renderingLoading.value = false

            if (!showMainCanvas.value) {
                await Utils.sleep(99)
                this.initDraggable()
            }
        }


        try {
            await update.call(this)
            console.warn('画布渲染成功')
        } catch (e) {
            console.error('画布渲染：存在丢失的元素')
            this.loading.value = false
            renderingLoading.value = false
        }
    }




    /*
        初始化拖拽
    */



    initDraggable() {
        let self = this

        let base64 = this.base64
        initDraggableElement(
            this.el,
            () => {
                currentModelController.value.stickToMousePosition({
                    isLocalResource: true,
                    base64: currentCanvasControllerInstance.value.base64,
                    data: Utils.clone(canvasStickerOptions.value), // 用来保存当且贴纸的所有信息
                })
            },

            () => base64
        )
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

            this.updateRenderingCanvas()

            return <Canvas options={canvasStickerOptions.value.children.find((item) => item.type == 'canvas')}>
                {children}
            </Canvas>
        }

        return render.bind(this)
    }
}

