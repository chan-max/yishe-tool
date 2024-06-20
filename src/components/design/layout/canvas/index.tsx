import { ref, computed } from 'vue'

export const canvasOptions = ref({})


// 实际的画布尺寸
export const canvasWidth = ref(1000)
export const canvasHeight = ref(1000)

// 展示的画布尺寸
export const canvasDisplayWidth = ref(200)
export const canvasDisplayHeight = ref(200)

// 画布的缩放尺寸
export const canvasDisplayTransformScale = computed(() => {
    return `scale(${canvasDisplayWidth.value / canvasWidth.value}, ${canvasDisplayHeight.value / canvasHeight.value}`
})

export class CanvasController {
    target = null
    constructor() {


    }

    el = null


    render(h) {

    }

    getEl(e) {
        this.el = e
    }

    getRender() {
        return () => {

            let style = {
                background: 'red',
                transform:  canvasDisplayTransformScale.value
            }

            return <canvas style={style} width={canvasWidth.value} height={canvasHeight.value} ref={this.getEl.bind(this)}></canvas>
        }
    }
}




// htmlToImage.toCanvas(document.getElementById('my-node'))
//   .then(function (canvas) {
//     document.body.appendChild(canvas);
//   });

