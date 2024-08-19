import { SvgFilterCategory } from '@/types/filter'


/* 
    自定义的滤镜效果
*/

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
    line,
    maorongrong,
    huichenkeli,
    xRays, 
    xRaysWarm,
    noise,
    yuzhouxingguang,
    heibaixiangsu
} from './special.tsx'
import { neonLightsText,xingguang,saibopengke,xiuxibanban,waiwainiuniu } from './text.tsx'



export const SvgFilterCategoryOptions = [
    {
        label: '常用',
        value: SvgFilterCategory.Normal,
        children: [
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
            twisted,
            maorongrong,
            huichenkeli,
            xRays,
            xRaysWarm,
            noise,
            line,
            yuzhouxingguang,
            heibaixiangsu
        ]
    },
    {
        label: '文字适用',
        value: SvgFilterCategory.Text,
        children: [
            xingguang,
            neonLightsText,
            saibopengke,
            xiuxibanban,
            waiwainiuniu
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





