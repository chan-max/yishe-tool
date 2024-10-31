import { CanvasChildType, canvasChildLabelMap, canvasChildDefaultOptionsMap, canvasChildRenderMap,CanvasChildOperationComponentMap } from '../index.tsx'

interface canvasChildDefineOptionsInterface {

    typeName: string // 类型名称 供外部使用的名称

    typeKey: string // 内部使用的key值

    label: string // 元素的名称

    defaultOptionsCreator: any // 默认配置生成

    renderer: any // 默认的渲染器

    operationLayout?:any //  操作配置
}

export const defineCanvasChild = (canvasChildDefineOptions: canvasChildDefineOptionsInterface) => {
    let {
        typeName,
        typeKey,
        label,
        defaultOptionsCreator,
        renderer,
        operationLayout
    } = canvasChildDefineOptions

    CanvasChildType[typeName] = typeKey

    canvasChildLabelMap[typeKey] = label

    canvasChildDefaultOptionsMap[typeKey] = defaultOptionsCreator

    canvasChildRenderMap[typeKey] = renderer
    
    CanvasChildOperationComponentMap[typeKey] = operationLayout
}



