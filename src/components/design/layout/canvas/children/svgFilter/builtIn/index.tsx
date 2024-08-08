
/*
    内置svg 滤镜分组
*/
export const enum SvgFilterCategory {

    /** 基本类滤镜 */
    Normal = 'normal',

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

/* 
    自定义的滤镜效果
*/

export type SvgFilterCustomEffectType = {
    category: SvgFilterCategory,
    label: string,
    filterName: SvgFilteCustomEffect,
    render: Function
}


export enum SvgFilteCustomEffect {
    Default = 'default', // 默认无任何效果,
    Old = 'old',
    Mosaic = 'mosaic' // 马赛克笑过
}

import { createDefaultFilter } from './default'
import { createMosaicFilter } from './mosaic'




export const SvgFilterCategoryOptions = [
    {
        label: '常用',
        value: SvgFilterCategory.Normal,
        children: [
            {
                category: SvgFilterCategory.Normal,
                label: '默认 (原始图)',
                filterName: SvgFilteCustomEffect.Default,
                render: createDefaultFilter
            },
            {
                category: SvgFilterCategory.Normal,
                label: '马赛克效果',
                filterName: SvgFilteCustomEffect.Mosaic,
                render: createMosaicFilter
            },
        ]
    },
    {
        label: '调整类滤镜',
        value: SvgFilterCategory.Adjustment
    },
    {
        label: '颜色效果类滤镜',
        value: SvgFilterCategory.ColorEffect
    },
    {
        label: '锐化和模糊类滤镜',
        value: SvgFilterCategory.SharpenBlur
    },
    {
        label: '扭曲和变形类滤镜',
        value: SvgFilterCategory.Distortion
    },
    {
        label: '纹理和艺术效果类滤镜',
        value: SvgFilterCategory.TextureArt
    },
    {
        label: '边缘和轮廓类滤镜',
        value: SvgFilterCategory.EdgeDetection
    },
    {
        label: '噪点和纹理类滤镜',
        value: SvgFilterCategory.NoiseTexture
    },
    {
        label: '光照效果类滤镜',
        value: SvgFilterCategory.LightingEffect
    },
    {
        label: '特殊效果类滤镜',
        value: SvgFilterCategory.SpecialEffect
    }
]


export const BuiltInSvgFilterRenderList = SvgFilterCategoryOptions.reduce((res, item) => {

    if (item.children) {
        return res.concat(item.children)
    } else {
        return res
    }
}, [])





