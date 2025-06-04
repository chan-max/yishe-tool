import { canvasStickerOptions, currentCanvasControllerInstance, updateRenderingCanvas, CanvasChildType, canvasStickerOptionsOnlyChild } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeString, createFilterFromOptions, createTransformString, formatSizeOptionToPixelValue } from '../helper.tsx'
import { computed, defineComponent, onMounted, onUpdated, ref } from "vue"
import { createFilterDefaultOptions, createPositionDefaultOptions, createTransformDefaultOptions } from "./defaultOptions.tsx"
import Utils from '@/common/utils'
import { useDebounceFn } from "@vueuse/core"

export const createDefaultCanvasChildRawCanvasOptions = () => {

    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'rawCanvas',
        position: createPositionDefaultOptions(canvasUnit),
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        transform: createTransformDefaultOptions(canvasUnit),
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex: 0,
    }
}



export function createCanvasChildRawCanvas(options) {
    return <RawCanvas options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></RawCanvas>
}

export const RawCanvas = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const canvasRef = ref()
        const canvasCtx = computed(() => {
            return canvasRef.value?.getContext('2d')
        })

        onUpdated(() => {
            props.options.targetComputedWidth = Utils.getComputedWidth(canvasRef.value)
            props.options.targetComputedHeight = Utils.getComputedHeight(canvasRef.value)
        })


        
        const paint = useDebounceFn(function paint() {
            const width = formatSizeOptionToPixelValue(props.options.width)
            const height = formatSizeOptionToPixelValue(props.options.width)
            let context = canvasCtx.value
            if (!context) {
                return
            }
        })


        onMounted(paint)
        onUpdated(paint)



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
                ..._containerStyle
            }



            var style: any = {
                flexShrink: 0,
                transform: createTransformString(props.options.transform),
                width: formatToNativeSizeString(props.options.width),
                height: formatToNativeSizeString(props.options.height),
                filter: createFilterFromOptions(props.options.filter),
                zIndex: props.options.zIndex,
                ..._style,
            }

            const width = formatSizeOptionToPixelValue(props.options.width)
            const height = formatSizeOptionToPixelValue(props.options.height)

            console.log(width, height)

            return <div style={containerStyle}>
                <canvas ref={canvasRef} style={style} width={width} height={height}></canvas>
            </div>
        }
    }
})


function createFireEffect(context) {
    const canvas = context.canvas;
    const particles = [];
    const particleCount = 100;
    const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ffffff'];

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 10;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * -3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 1;
    }

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95;
        this.opacity -= 0.02;
        if (this.opacity < 0) this.opacity = 0;
    };

    Particle.prototype.draw = function () {
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
    };

    function createParticles(x, y) {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y));
        }
    }

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.5) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', function (event) {
        createParticles(event.clientX, event.clientY);
    });

    animate();
}




