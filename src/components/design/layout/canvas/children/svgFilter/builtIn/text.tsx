
import { SvgFilterCategory } from '@/types/filter.ts'
/*
    文字类相关
*/

export const neonLightsText = {
    category: SvgFilterCategory.Text,
    filterLabel: '霓虹灯边缘',
    filterId: 'neonLightsText',
    displayRender: () => {
        return <span style="font-size:1.5rem;"> 霓虹灯边缘 </span>
    },
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
    0 1 0 0 0
    0 0 1 0 0
    0 0 0 0 1" in="turbulence" result="colormatrix" />
            <feColorMatrix type="saturate" values="4" in="colormatrix" result="colormatrix1" />
            <feComponentTransfer in="colormatrix1" result="componentTransfer">
                <feFuncR type="table" tableValues="1 0 -1" />
                <feFuncG type="table" tableValues="1 0 1" />
                <feFuncB type="table" tableValues="1 -1 1" />
                <feFuncA type="identity" />
            </feComponentTransfer>
            <feMorphology operator="dilate" radius="2 2" in="SourceAlpha" result="morphology" />
            <feFlood flood-color="#ffffff" flood-opacity="1" result="flood" />
            <feComposite in="flood" in2="morphology" operator="in" result="composite" />
            <feComposite in="composite" in2="SourceAlpha" operator="out" result="composite1" />
            <feComposite in="componentTransfer" in2="composite1" operator="in" result="composite2" />
        </filter>
    }
}






export const xingguang = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '星光',
    filterId: 'weiguang',
    displayRender: () => {
        return <span style="font-size:1.5rem;"> 星光 </span>
    },
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>

            <feMorphology operator="erode" radius="0" in="SourceGraphic" result="erode" />
            <feMorphology operator="erode" radius="2" in="SourceGraphic" result="erode1" />
            <feMorphology operator="erode" radius="3" in="SourceGraphic" result="erode2" />
            <feMorphology operator="erode" radius="4" in="SourceGraphic" result="erode3" />
            <feMorphology operator="erode" radius="6" in="SourceGraphic" result="erode4" />
            <feComposite in="erode" in2="erode1" operator="out" result="main" />
            <feComposite in="erode1" in2="erode2" operator="out" result="stroke1" />
            <feComposite in="erode2" in2="erode3" operator="out" result="stroke2" />
            <feComposite in="erode3" in2="erode4" operator="out" result="stroke3" />
            <feGaussianBlur in="stroke1" stdDeviation="0 10" result="stroke1-blur" />
            <feBlend in="stroke1-blur" mode="screen" result="stroke1-blur-blend"></feBlend>
            <feGaussianBlur in="stroke2" stdDeviation="0 10" />
            <feOffset dx="0" dy="10" result="stroke2-blur" />
            <feBlend in="stroke2-blur" mode="screen" result="stroke2-blur-blend"></feBlend>
            <feGaussianBlur in="stroke3" stdDeviation="0 25" />
            <feOffset dx="0" dy="20" result="stroke3-blur" />
            <feBlend in="stroke3-blur" mode="screen" result="stroke3-blur-blend"></feBlend>

            <feFlood result="floodFill" flood-color="rgba(0,0,0,0.7)" flood-opacity="1" />
            <feComposite in="floodFill" in2="erode2" operator="in" result="black" />
            <feBlend in="black" mode="screen" result="letterInside"></feBlend>
            <feMerge>
                <feMergeNode in="stroke1-blur-blend"></feMergeNode>
                <feMergeNode in="stroke2-blur-blend"></feMergeNode>
                <feMergeNode in="stroke3-blur-blend"></feMergeNode>
                <feMergeNode in="main"></feMergeNode>
                <feMergeNode in="letterInside"></feMergeNode>
            </feMerge>

        </filter>
    }
}



export const saibopengke = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '赛博朋克',
    filterId: 'saibopengke',
    displayRender: () => {
        return <span style="font-size:1.5rem;"> 赛博朋克 </span>
    },
    render: ({
        filterId
    }) => {
        return <filter id="bevel">
            <feMorphology operator="dilate" radius="3" in="SourceGraphic" result="bevel" />
        </filter>
    }
}



export const xiuxibanban = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '锈迹斑斑',
    filterId: 'xiuxibanban',
    displayRender: () => {
        return <span style="font-size:1.5rem;"> 锈迹斑斑 </span>
    },
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="0 10" in="SourceGraphic" edgeMode="none" result="blur" />
            <feTurbulence type="turbulence" baseFrequency="0.09 0.005" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence" />
            <feComposite in="turbulence" in2="blur" operator="in" result="composite" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 100 -10" in="composite" result="colormatrix" />
            <feMorphology operator="dilate" radius="0 36" in="colormatrix" result="morphology" />
            <feOffset dx="0" dy="45" in="morphology" result="offset" />
            <feComposite in="offset" in2="SourceGraphic" operator="xor" result="composite1" />
            <feFlood flood-color="teal" flood-opacity="1" result="flood" />
            <feComposite in="flood" in2="composite1" operator="in" result="composite2" />
        </filter>
    }
}


/**
 * @description 水波纹
*/


export const waiwainiuniu = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '歪歪扭扭',
    filterId: 'waiwainiuniu',
    displayRender: () => {
        return <span style="font-size:1.5rem;"> 歪歪扭扭 </span>
    },
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="turbulence" data-filterId="5" />
            <feDisplacementMap id="distortion" in="SourceGraphic" in2="turbulence" scale="20">
            </feDisplacementMap>
        </filter>
    }
}



/*
*/


export const xuankumoshui = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '炫酷墨水',
    filterId: 'xuankumoshui',
    displayRender: () => {
        return <span style="font-size:1.5rem;"> 歪歪扭扭 </span>
    },
    render: ({
        filterId
    }) => {
        return <filter id={filterId} width="150%" height="160%" x="-25%" y="-25%">

            <feFlood flood-color="#16B5FF" result="COLOR-blue"></feFlood>‚
            <feFlood flood-color="#9800FF" result="COLOR-violet"></feFlood>
            <feFlood flood-color="#A64DFF" result="COLOR-violet-light"></feFlood>

            <feTurbulence baseFrequency="0.05" type="fractalNoise" numOctaves="1" seed="2" result="BOTTOM-SPLASH_10"></feTurbulence>
            <feGaussianBlur stdDeviation="6.5" in="SourceAlpha" result="BOTTOM-SPLASH_20"></feGaussianBlur>
            <feDisplacementMap scale="420" in="BOTTOM-SPLASH_20" in2="BOTTOM-SPLASH_10" result="BOTTOM-SPLASH_30"></feDisplacementMap>
            <feComposite operator="in" in="COLOR-blue" in2="BOTTOM-SPLASH_30" result="BOTTOM-SPLASH_40"></feComposite>

            <feTurbulence baseFrequency="0.1" type="fractalNoise" numOctaves="1" seed="1" result="MIDDLE-SPLASH_10"></feTurbulence>
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.1" result="MIDDLE-SPLASH_20"></feGaussianBlur>
            <feDisplacementMap in="MIDDLE-SPLASH_20" in2="MIDDLE-SPLASH_10" scale="25" result="MIDDLE-SPLASH_30"></feDisplacementMap>
            <feComposite in="COLOR-violet-light" in2="MIDDLE-SPLASH_30" operator="in" result="MIDDLE-SPLASH_40"></feComposite>

            <feTurbulence baseFrequency="0.07" type="fractalNoise" numOctaves="1" seed="1" result="TOP-SPLASH_10"></feTurbulence>
            <feGaussianBlur stdDeviation="3.5" in="SourceAlpha" result="TOP-SPLASH_20"></feGaussianBlur>
            <feDisplacementMap scale="220" in="TOP-SPLASH_20" in2="TOP-SPLASH_10" result="TOP-SPLASH_30"></feDisplacementMap>
            <feComposite operator="in" in="COLOR-violet" in2="TOP-SPLASH_30" result="TOP-SPLASH_40"></feComposite>

            <feMerge result="LIGHT-EFFECTS_10">
                <feMergeNode in="BOTTOM-SPLASH_40"></feMergeNode>
                <feMergeNode in="MIDDLE-SPLASH_40"></feMergeNode>
                <feMergeNode in="TOP-SPLASH_40"></feMergeNode>
            </feMerge>
            <feColorMatrix type="matrix" values="0 0 0 0 0,
          0 0 0 0 0,
          0 0 0 0 0,
          0 0 0 1 0" in="LIGHT-EFFECTS_10" result="LIGHT-EFFECTS_20"></feColorMatrix>
            <feGaussianBlur stdDeviation="2" in="LIGHT-EFFECTS_20" result="LIGHT-EFFECTS_30"></feGaussianBlur>
            <feSpecularLighting surfaceScale="5" specularConstant=".75" specularExponent="30" lighting-color="#white" in="LIGHT-EFFECTS_30" result="LIGHT-EFFECTS_40">
                <fePointLight x="-50" y="-100" z="400"></fePointLight>
            </feSpecularLighting>
            <feComposite operator="in" in="LIGHT-EFFECTS_40" in2="LIGHT-EFFECTS_20" result="LIGHT-EFFECTS_50"></feComposite>
            <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="LIGHT-EFFECTS_10" in2="LIGHT-EFFECTS_50" result="LIGHT-EFFECTS_60"></feComposite>
        </filter>
    }
}


