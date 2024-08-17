
/* 
    自定义的滤镜效果
*/



/* 滤镜分类 */
export enum SvgFilterCategory {

    /** 基本类滤镜 */
    Normal = 'normal',

    /* 纯色滤镜 */
    PureColor = 'pure-color',

    /** 调整类滤镜 */
    Adjustment = 'adjustment',

    /** 颜色效果类滤镜 */
    ColorEffect = 'colorEffect',

    /** 锐化和模糊类滤镜 */
    SharpenBlur = 'sharpenBlur',

    /** 扭曲和变形类滤镜 */
    Distortion = 'distortion',

    /** 纹理和艺术效果类滤镜 */
    TextureArt = 'textureArt',

    /** 边缘和轮廓类滤镜 */
    EdgeDetection = 'edgeDetection',

    /** 噪点和纹理类滤镜 */
    NoiseTexture = 'noiseTexture',

    /** 光照效果类滤镜 */
    LightingEffect = 'lightingEffect',

    /** 特殊效果类滤镜 */
    SpecialEffect = 'specialEffect'
}

export type SvgFilterCustomEffectType = {
    category: SvgFilterCategory,
    filterLabel: string,
    filterId: SvgFilteCustomEffect,
    render: Function,
    displayRender?: Function,
}


export enum SvgFilteCustomEffect {
    Default = 'default', // 默认无任何效果,
    Old = 'old',
    Mosaic = 'mosaic' // 马赛克笑过
}



import { createDefaultFilter } from './default'
import { createMosaicFilter } from './mosaic'
import { createPureColorMatrixFilterRender, BlackAndWhiteMatrix, vintage } from './pureColor'
import {
    twisted,
    line
} from './strange.tsx'
import { neonLightsText } from './text.tsx'


export const SvgFilterCategoryOptions = [
    {
        label: '常用',
        value: SvgFilterCategory.Normal,
        children: [
            {
                category: SvgFilterCategory.Normal,
                filterLabel: '测试',
                filterId: 'test',
                render: () => {
                    return
                }
            },
            {
                category: SvgFilterCategory.Normal,
                filterLabel: '默认 (原始图)',
                filterId: SvgFilteCustomEffect.Default,
                render: createDefaultFilter
            },
            {
                category: SvgFilterCategory.Normal,
                filterLabel: '马赛克效果',
                filterId: SvgFilteCustomEffect.Mosaic,
                render: createMosaicFilter
            },
        ]
    },
    {
        label: '纯颜色',
        value: SvgFilterCategory.PureColor,
        children: [
            {
                category: SvgFilterCategory.PureColor,
                filterLabel: '黑白',
                filterId: 'blackWhite',
                render: createPureColorMatrixFilterRender('blackWhite', BlackAndWhiteMatrix)
            },
            {
                category: SvgFilterCategory.PureColor,
                filterLabel: '复古',
                filterId: 'vintage',
                render: vintage
            },
        ]
    },
    {
        label: '特殊效果',
        value: SvgFilterCategory.SpecialEffect,
        children: [
            {
                category: SvgFilterCategory.SpecialEffect,
                filterLabel: '扭曲',
                filterId: 'twisted',
                render: twisted
            },
            {
                category: SvgFilterCategory.SpecialEffect,
                filterLabel: '彩色网格线',
                filterId: 'line',
                render: line
            },
        ]
    },
    {
        label: '文字使用',
        value: SvgFilterCategory.Text,
        children: [
            {
                category: SvgFilterCategory.Text,
                filterLabel: '霓虹灯边缘',
                filterId: 'neonLightsText',
                render: neonLightsText,
                displayRender: () => {
                    return <span style="font-size:1.5rem;"> 霓虹灯边缘 </span>
                }
            },
        ]
    },
]


export const BuiltInSvgFilterRenderList = SvgFilterCategoryOptions.reduce((res, item) => {
    if (item.children) {
        return res.concat(item.children)
    } else {
        return res
    }
}, [])





