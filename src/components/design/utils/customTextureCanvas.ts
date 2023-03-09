
export class CustomTextureCanvas {
    constructor(canvasElement: any, basicBackground: any) {
        this.context = canvasElement.getContext('2d')
        this.width = canvasElement.width
        this.height = canvasElement.height
        this.basicBackground = basicBackground
        this.setBasicBackground()
    }



    // 背景材质，不受贴图影响
    basicBackground: any
    context: any
    width: any
    height: any

    operaetStack: any = []

    // 设置基础背景，不参与撤销等操作 , 只有第一次需要传递参数
    setBasicBackground() {
        this.context.drawImage(this.basicBackground, 0, 0, this.width, this.height)
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height)
        this.setBasicBackground()
    }

    // 与原生方法参数一样
    drawImage(...args: any) {
        debugger
        this.operaetStack.push({
            type: 'dragImage',
            args
        })
        this.context.drawImage(...args);
    }

    undo() {
        // 清空画布然后把之前的过程重复一遍
        // 清空画布
        this.clear();
        // 删除当前操作
        this.operaetStack.pop();
        // 逐个执行绘图动作进行重绘
        for (let operate of this.operaetStack) {
            this.context.drawImage(...operate.args)
        }
    }

    textures: any = []

    initTexture(textureInfo: any) {
        const { image, x, y, w, h } = textureInfo
        this.context.drawImage(image, x, y, w, h)
        this.textures.push(textureInfo)
    }

    updateTexture(textureInfo: any) {
        debugger
    }
}