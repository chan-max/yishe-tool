import { CanvasChildType, canvasChildLabelMap, canvasChildDefaultOptionsMap, canvasChildRenderMap } from '../index.tsx'

interface canvasChildDefineOptionsInterface {

    typeName: string // 类型名称 供外部使用的名称

    typeKey: string // 内部使用的key值

    label: string // 元素的名称

    defaultOptions: any // 默认配置

    renderer: any // 默认的渲染器
}

export const defineCanvasChild = (canvasChildDefineOptions: canvasChildDefineOptionsInterface) => {
    let {
        typeName,
        typeKey,
        label,
        defaultOptions,
        renderer,
    } = canvasChildDefineOptions

    CanvasChildType[typeName] = typeKey

    canvasChildLabelMap[typeKey] = label

    canvasChildDefaultOptionsMap[typeKey] = defaultOptions

    canvasChildRenderMap[typeKey] = renderer
}nde