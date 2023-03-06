
export class CustomTextureCanvas {
    constructor(canvasElement: any) {
        this.context = canvasElement.getContext('2d')
        this.width = canvasElement.width
        this.height = canvasElement.height
    }

    
    basicBackground: any
    context: any
    width: any
    height: any

    operaetStack: any = []

    // 设置基础背景，不参与撤销等操作
    setBasicBackground(source: any) {
        this.context.drawImage(source, 0, 0, this.width, this.height)
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    // 与原生方法参数一样
    drawImage(...args: any) {
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

}