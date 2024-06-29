import { ref, computed, shallowRef, nextTick, watch, defineAsyncComponent, defineComponent } from 'vue'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { htmlToPngFile, downloadByFile } from '@/common/transform'
import { useDebounceFn } from '@vueuse/core'
import { waitImage } from '@/common'
import { createCanvasChildText, defaultCanvasChildTextOptions } from './children/text.tsx'
import { createCanvasChildBackground, defaultCanvasChildBackgroundOptions } from './children/background.tsx'
import { defaultCanvasChildQrcodeOptions, createCanvasChildQrcode, qrcode } from './children/qrcode.tsx'
import { initDraggableElement } from "@/components/design/utils/draggable";

import { Canvas as Canvas } from './children/canvas.tsx'

export const canvasOptions = ref({
    width: 1000,
    height: 1000,
    children: [{
        type: 'canvas'
    }],
})

// 保留两位小数
function toFixed3(val): any {
    return parseFloat(val).toFixed(3);
}

watch(() => canvasOptions.value.width, () => {
    if (canvasOptions.value.width < 100) {
        canvasOptions.value.width = 100
        return
    }
})

watch(() => canvasOptions.value.height, () => {
    if (canvasOptions.value.height < 100) {
        canvasOptions.value.height = 100
        return
    }
})





export enum CanvasChildType {
    CANVAS = 'canvas', // 画布
    TEXT = 'text',
    BACKGROUHND = 'background',
    IMAGE = 'image',
}

export function getCanvasChildLabel(val) {
    switch (val) {
        case 'text':
            return '文字'
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
        case 'border':
            return '边框'
    }
}


interface CanvasChild {
    type: CanvasChildType
}

interface CanvasOptions {
    width: number | string,
    height: number | string,
    children: CanvasChild[],
}


import { showBasicCanvas } from '@/components/design/store';


/*
    是否展示主画布
*/
export const showMainCanvas = ref(true)

function createCanvasChild(options, controller) {
    if (options.type == CanvasChildType.TEXT) {
        return createCanvasChildText(options, controller)
    }

    if (options.type == CanvasChildType.BACKGROUHND) {
        return createCanvasChildBackground(options, controller)
    }

    if (options.type == 'qrcode') {
        return createCanvasChildQrcode(options, controller)
    }
}




const isPromise = (val) => {
    return val.catch && val.then;
};

function createAsyncComponent(loader) {
    return defineAsyncComponent({
        // 加载异步组件时使用的组件
        loader,
        loadingComponent: () => null,
        // 展示加载组件前的延迟时间，默认为 200ms
        delay: 200,

        // 加载失败后展示的组件
        errorComponent: () => null,
        // 如果提供了一个 timeout 时间限制，并超时了
        // 也会显示这里配置的报错组件，默认值是：Infinity
        timeout: 3000
    })
}

// 添加画布子元素
export function addCanvasChild(options) {

    let index = canvasOptions.value.children.length

    options = {
        ...(
            options.type == 'text'
                ? defaultCanvasChildTextOptions
                : options.type == 'background'
                    ? defaultCanvasChildBackgroundOptions
                    : options.type == 'qrcode' ?
                        defaultCanvasChildQrcodeOptions : null
        ),
        ...options,
        index: canvasOptions.value.children.length
    }

    canvasOptions.value.children.push(options)
    // 返回最新的索引
    return index
}

// 当前正在操作的元素
export const currentOperatingCanvasChildIndex = ref(0)

export const currentOperatingCanvasChild = computed(() => {
    let child = canvasOptions.value.children[currentOperatingCanvasChildIndex.value]

    if (!child) {
        currentOperatingCanvasChildIndex.value = 0
        return canvasOptions.value.children[0]
    }

    return child
})

export function removeCavnasChild(index) {

    if (index == 0) {
        return
    }

    canvasOptions.value.children.splice(index, 1)
    currentOperatingCanvasChildIndex.value = index - 1
}

export function calcCanvasDisplayTransformScale(max) {
    let m = Math.max(canvasOptions.value.width, canvasOptions.value.height)
    return `scale(${max / m}, ${max / m}`
}

export const currentCanvasControllerInstance = shallowRef(null)


export function updateCanvas() {
    currentCanvasControllerInstance.value.updateCanvas()
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

    get el() {
        return document.querySelector('#canvas-raw-el') as any
    }


    get canvasEl() {
        return document.querySelector('#canvas-display-el') as any
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
    updateWorkDelay = 500; // 更新延迟

    async updateCanvasJob() {
        if (!this.el) {
            return
        }
        let base64 = await toPng(this.el) // 会有页面卡顿的问题
        let img = document.createElement('img')
        img.width = canvasOptions.value.width
        img.height = canvasOptions.value.height
        document.body.appendChild(img)
        img.src = base64
        await waitImage(img)
        this.clearCanvas()
        this.drawImage(img)
        await nextTick()
        document.body.removeChild(img)
        this.syncCloneCanvas()
        this.initDraggable(base64)
        this.loading.value = false
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

    get cloneCanvasEl() {
        return document.querySelector('#canvas-cloned-el') as any
    }

    async syncCloneCanvas() {
        await nextTick()
        let cloneCtx = this.cloneCanvasEl?.getContext("2d")

        if (!cloneCtx || !this.canvasEl) {
            return
        }
        this.cloneCanvasEl.width = this.cloneCanvasEl.width;
        cloneCtx.drawImage(this.canvasEl, 0, 0);
    }


    getCloneCanvasRender() {
        return (props) => {

            const containerStyle: any = {
                width: '100%',
                height: '100%',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }

            const canvasStyle = {
                transform: calcCanvasDisplayTransformScale(400),
            }

            this.syncCloneCanvas()

            return <div style={containerStyle}>
                <canvas class="png-background" id={'canvas-cloned-el'} style={canvasStyle} width={canvasOptions.value.width} height={canvasOptions.value.height}></canvas>
            </div>
        }
    }

    // 画布元素是否在加载中
    pending = ref(false)

    getRender(params) {

        // 改为异步组件
        function render() {

            const children = canvasOptions.value.children.map((childOptions) => {
                return createCanvasChild(childOptions, this)
            })

            this.updateCanvas()

            return <Canvas>
                {children}
            </Canvas>
        }

        return render.bind(this)
    }
}

