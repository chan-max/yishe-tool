
import { SvgFilterCategory } from '@/types/filter.ts'
/**
 * @description 简易的扭曲效果
*/

export const twisted = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '扭曲',
    filterId: 'twisted',
    render: () => {
        return <filter id="twisted" x="-.048" y="-.048" width="1.096" height="1.096" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceGraphic" result="result5" stdDeviation="3" />
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="result1" type="fractalNoise" />
            <feDisplacementMap in="SourceGraphic" in2="result1" result="result3" scale="30" xChannelSelector="R" yChannelSelector="G" />
            <feComposite in="result3" in2="result1" operator="out" result="result4" />
            <feComposite in2="result4" k1="0.3" k2="1" k3="0.3" operator="arithmetic" result="result6" />
            <feComposite in="result6" in2="result5" />
        </filter>
    }
}



/**
 * @description 彩色条纹
*/



export const line = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '彩色网格线',
    filterId: 'line',
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
            <feTurbulence baseFrequency="0.2 0" numOctaves="3" result="result0" seed="10" type="fractalNoise" />
            <feColorMatrix type="hueRotate" values="0" />
            <feColorMatrix result="result4" type="saturate" values="1" />
            <feColorMatrix result="result9" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 4 -2 " />
            <feTurbulence baseFrequency="0 0.2" numOctaves="3" result="result8" seed="10" type="fractalNoise" />
            <feColorMatrix type="hueRotate" values="0" />
            <feColorMatrix result="result4" type="saturate" values="1" />
            <feColorMatrix result="result10" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 4 -2 " />
            <feComposite in="result10" in2="result9" k2="0.5" k3="0.5" operator="arithmetic" result="result7" />
            <feColorMatrix result="result11" values="2 -1 0 0 0 0 2 -1 0 0 -1 0 2 0 0 0 0 0 5 0 " />
            <feComposite in2="result7" k2="1" operator="arithmetic" result="result12" />
            <feBlend in2="result7" mode="screen" result="result13" />
            <feBlend in="result13" in2="SourceGraphic" result="result6" />
            <feComposite in="result6" in2="SourceGraphic" operator="in" result="result3" />
        </filter>
    }
}









/*
    一层毛茸茸的效果
*/
export const maorongrong = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '毛茸茸',
    filterId: 'maorongrong',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" result="fluffyNoise" numOctaves="5" />
            <feColorMatrix in="fluffyNoise" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0" />
            <feComposite operator="in" in2="SourceGraphic" result="monoFluffyNoise" />
            <feBlend in="SourceGraphic" in2="monoFluffyNoise" mode="screen" />
        </filter>
    }
}



/*
    灰尘颗粒
*/
export const huichenkeli = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '灰尘颗粒',
    filterId: 'huichenkeli',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>
            <feTurbulence baseFrequency="0.60,0.90" result="colorNoise" />
            <feColorMatrix in="colorNoise" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0" />
            <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
            <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply" />
        </filter>
    }
}


/*
    x 光效果
*/
export const xRays = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: 'x光效果',
    filterId: 'x-rays',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values=".33 .33 .33 0 0
            .33 .33 .33 0 0
            .33 .33 .33 0 0
            0 0 0 1 0" in="SourceGraphic" result="colormatrix" />
            <feComponentTransfer in="colormatrix" result="componentTransfer">
                <feFuncR type="table" tableValues="0.98 0.3 0.25" />
                <feFuncG type="table" tableValues="1 0.44 0.24" />
                <feFuncB type="table" tableValues="0.91 0.62 0.39" />
                <feFuncA type="table" tableValues="0 1" />
            </feComponentTransfer>
            <feBlend mode="normal" in="componentTransfer" in2="SourceGraphic" result="blend" />
        </filter>
    }
}

/*
   热 x 光效果
*/
export const xRaysWarm = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '热x光效果',
    filterId: 'x-rays-wram',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values=".33 .33 .33 0 0
            .33 .33 .33 0 0
            .33 .33 .33 0 0
            0 0 0 1 0" in="SourceGraphic" result="colormatrix" />
            <feComponentTransfer in="colormatrix" result="componentTransfer">
                <feFuncR type="table" tableValues="0.98 0.75 0.51" />
                <feFuncG type="table" tableValues="1 0.45 0.11" />
                <feFuncB type="table" tableValues="0.91 0.39 0.29" />
                <feFuncA type="table" tableValues="0 1" />
            </feComponentTransfer>
            <feBlend mode="normal" in="componentTransfer" in2="SourceGraphic" result="blend" />
        </filter>
    }
}



/**
 * 
 * @description 噪音
*/


export const noise = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '噪音',
    filterId: 'noise',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id="noise">
            <feTurbulence baseFrequency="0.5" in="SourceGraphic"></feTurbulence>
        </filter>
    }
}


/**
 * @description 宇宙星光
*/

export const yuzhouxingguang = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '宇宙星光',
    filterId: 'yuzhouxingguang',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId}
            filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="300">
            <feTurbulence type="fractalNoise" baseFrequency="0.995" numOctaves="1" seed="1" stitchTiles="noStitch" result="img" />
            <feDisplacementMap in="SourceGraphic" in2="img" xChannelSelector="R" yChannelSelector="G" scale="500">
            </feDisplacementMap>
        </filter>
    }
}


/**
 * @description 黑白像素
*/

export const heibaixiangsu = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '黑白像素',
    filterId: 'heibaixiangsu',
    displayRender: null,
    disabled: true,
    render: ({
        filterId
    }) => {
        return <>
            <circle id="two" cx="3" cy="3" r="0.5" />
            <circle id="three" cx="3" cy="3" r="1" />
            <circle id="four" cx="3" cy="3" r="1.5" />
            <circle id="five" cx="3" cy="3" r="2" />
            <circle id="six" cx="3" cy="3" r="2.5" />
            <circle id="seven" cx="3" cy="3" r="3" />
            <circle id="seven" cx="3" cy="3" r="3.5" />
            <circle id="eight" cx="3" cy="3" r="4" />

            <filter id={filterId} x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
                <feImage width="3" height="3" xlinkHref="#two" />
                <feTile result="2dot" />
                <feImage width="3" height="3" xlinkHref="#three" />
                <feTile result="3dot" />
                <feImage width="3" height="3" xlinkHref="#four" />
                <feTile result="4dot" />
                <feImage width="3" height="3" xlinkHref="#five" />
                <feTile result="5dot" />
                <feImage width="3" height="3" xlinkHref="#six" />
                <feTile result="6dot" />
                <feImage width="3" height="3" xlinkHref="#seven" />
                <feTile result="7dot" />
                <feImage width="3" height="3" xlinkHref="#eight" />
                <feTile result="8dot" />

                <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="neg-lum-map" />
                <feComponentTransfer result="lum-map">
                    <feFuncA type="table" tableValues="1 0" />
                </feComponentTransfer>

                <feComponentTransfer in="lum-map" result="2r-thresh">
                    <feFuncA type="discrete" tableValues="0 1 0 0 0 0 0 0" />
                </feComponentTransfer>
                <feComponentTransfer in="lum-map" result="3r-thresh">
                    <feFuncA type="discrete" tableValues="0 0 1 0 0 0 0 0" />
                </feComponentTransfer>
                <feComponentTransfer in="lum-map" result="4r-thresh">
                    <feFuncA type="discrete" tableValues="0 0 0 1 0 0 0 0" />
                </feComponentTransfer>
                <feComponentTransfer in="lum-map" result="5r-thresh">
                    <feFuncA type="discrete" tableValues="0 0 0 0 1 0 0 0" />
                </feComponentTransfer>
                <feComponentTransfer in="lum-map" result="6r-thresh">
                    <feFuncA type="discrete" tableValues="0 0 0 0 0 1 0 0" />
                </feComponentTransfer>
                <feComponentTransfer in="lum-map" result="7r-thresh">
                    <feFuncA type="discrete" tableValues="0 0 0 0 0 0 1 0" />
                </feComponentTransfer>
                <feComponentTransfer in="lum-map" result="8r-thresh">
                    <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 1" />
                </feComponentTransfer>

                <feComposite operator="in" in="2r-thresh" in2="2dot" result="lev2" />
                <feComposite operator="in" in="3r-thresh" in2="3dot" result="lev3" />
                <feComposite operator="in" in="4r-thresh" in2="4dot" result="lev4" />
                <feComposite operator="in" in="5r-thresh" in2="5dot" result="lev5" />
                <feComposite operator="in" in="6r-thresh" in2="6dot" result="lev6" />
                <feComposite operator="in" in="7r-thresh" in2="7dot" result="lev7" />
                <feComposite operator="in" in="8r-thresh" in2="8dot" result="lev8" />

                <feMerge>
                    <feMergeNode in="lev8" />
                    <feMergeNode in="lev7" />
                    <feMergeNode in="lev6" />
                    <feMergeNode in="lev5" />
                    <feMergeNode in="lev4" />
                    <feMergeNode in="lev3" />
                    <feMergeNode in="lev2" />
                </feMerge>
                <feComposite operator="in" in2="SourceGraphic" />
            </filter>
        </>
    }
}



/**
 * 小波浪
*/

export const xiaobolang = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '小波浪',
    filterId: 'xiaobolang',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x='0%' y='0%' width='100%' height='100%'>
            <feTurbulence type='fractalNoise' baseFrequency="0.1" result="NOISE" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="20" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
        </filter>
    }
}


/**
 * 小波浪
*/

export const qiangzhi = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '墙纸',
    filterId: 'qiangzhi',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x='0%' y='0%' width='100%' height='100%'>
            <feTurbulence type='turbulence' baseFrequency="0.2" result="NOISE" numOctaves="30" />
            <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="20" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
        </filter>
    }
}



/**
 * 彩色光纹
*/

export const caiseguangwen = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '彩色光纹',
    filterId: 'caiseguangwen',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.008" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence" />
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.012" numOctaves="1" seed="1" stitchTiles="stitch" result="turbulence1" />
            <feMerge result="merge">
                <feMergeNode in="turbulence1" result="mergeNode" />
                <feMergeNode in="turbulence" result="mergeNode1" />
            </feMerge>
            <feColorMatrix type="saturate" values="10" in="merge" result="colormatrix" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
    0 1 0 0 0
    0 0 1 0 0
    0 0 0 10 0" in="colormatrix" result="colormatrix1" />
            <feDisplacementMap in="colormatrix1" in2="colormatrix" scale="40" xChannelSelector="R" yChannelSelector="G" result="displacementMap" />
            <feComposite in="displacementMap" in2="SourceAlpha" operator="in" result="composite1" />
        </filter>
    }
}

/**
 * 深色光纹
*/

export const shenseguangwen = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '深色光纹',
    filterId: 'shenseguangwen',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
    0 1 0 0 0
    0 0 1 0 0
    0 0 0 0 1" in="turbulence" result="colormatrix" />
            <feColorMatrix type="saturate" values="4" in="colormatrix" result="colormatrix1" />
            <feGaussianBlur stdDeviation="3 3" in="componentTransfer" edgeMode="none" result="blur" />
            <feComponentTransfer in="composite" result="componentTransfer">
                <feFuncR type="table" tableValues="1 0 -1" />
                <feFuncG type="table" tableValues="1 0 1" />
                <feFuncB type="table" tableValues="1 -1 1" />
                <feFuncA type="identity" />
            </feComponentTransfer>
            <feComposite in="componentTransfer" in2="SourceAlpha" operator="in" result="composite" />
        </filter>
    }
}

/**
 * @description 彩色光
*/

export const caiseguang = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '彩色光',
    filterId: 'caiseguang',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.015 0.015" numOctaves="3" seed="8" stitchTiles="stitch" result="turbulence" />
            <feMorphology operator="dilate" radius="35 35" in="turbulence" result="morphology" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
    0 1 0 0 0
    0 0 1 0 0
    0 0 0 10 0" in="morphology" result="colormatrix" />
            <feColorMatrix type="saturate" values="10" in="colormatrix" result="colormatrix1" />
            <feComposite in="colormatrix1" in2="SourceAlpha" operator="in" result="composite" />
        </filter>
    }
}


/**
 * 
 * 
*/

export const shuguangwen = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '竖光纹',
    filterId: 'shuguangwen',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.03 0" numOctaves="10" seed="3" stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="saturate" values="20" in="morphology1" result="colormatrix" />
            <feFlood flood-color="#ffeb00" flood-opacity="1" result="flood" />
            <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite" />
            <feComposite in="colormatrix" in2="SourceGraphic" operator="in" result="composite1" />
            <feMerge result="merge">
                <feMergeNode in="composite" result="mergeNode" />
                <feMergeNode in="composite1" result="mergeNode1" />
                <feMergeNode in="composite1" result="mergeNode2" />
                <feMergeNode in="composite1" result="mergeNode3" />
                <feMergeNode in="composite1" result="mergeNode4" />
                <feMergeNode in="composite1" result="mergeNode5" />
                <feMergeNode in="composite1" result="mergeNode6" />
            </feMerge>
        </filter>
    }
}

export const huichen = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '灰尘',
    filterId: 'huichen',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.8 0.8" numOctaves="4" seed="4" stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="matrix" values="0 0 0 0 0
    0 0 0 0 0
    0 0 0 0 0
    0 0 0 -40 10" in="turbulence" result="colormatrix" />
            <feComposite in="colormatrix" in2="SourceAlpha" operator="in" result="composite" />
            <feTurbulence type="turbulence" baseFrequency="0.1 0.1" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence1" />
            <feDisplacementMap in="composite" in2="turbulence1" scale="20" xChannelSelector="R" yChannelSelector="B" result="displacementMap" />
        </filter>
    }
}

export const yuanxingshitouwenli = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '圆形石头纹理',
    filterId: 'yuanxingshitouwenli',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.06 0.07" numOctaves="1" seed="4" stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="matrix" values="0 0 0 0 0
    0 0 0 0 0
    0 0 0 0 0
    0 0 0 -70 10" in="turbulence" result="colormatrix" />
            <feOffset dx="22" dy="4" in="colormatrix" result="offset" />
            <feComposite in="offset" in2="colormatrix" operator="xor" result="composite" />
            <feComposite in="composite" in2="SourceAlpha" operator="in" result="composite1" />
        </filter>
    }
}

export const shuibowen = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '水波纹',
    filterId: 'shuibowen',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05 0.05" numOctaves="1" seed="3" stitchTiles="stitch" result="turbulence" />
            <feComposite in="turbulence" in2="SourceGraphic" operator="in" result="composite" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
    0 1 0 0 0
    0 0 1 0 0
    0 0 0 25 -2" in="composite" result="colormatrix" />
            <feComposite in="SourceGraphic" in2="colormatrix" operator="in" result="composite1" />
            <feGaussianBlur stdDeviation="3 3" in="composite1" edgeMode="none" result="blur" />
            <feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lighting-color="#fffffd" in="blur" result="specularLighting">
                <feDistantLight azimuth="-90" elevation="150" />
            </feSpecularLighting>
            <feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lighting-color="#cae1fe" in="blur" result="specularLighting1">
                <feDistantLight azimuth="90" elevation="150" />
            </feSpecularLighting>
            <feSpecularLighting surfaceScale="7" specularConstant="1" specularExponent="35" lighting-color="#fcfeff" in="blur" result="specularLighting2">
                <fePointLight x="150" y="50" z="300" />
            </feSpecularLighting>
            <feComposite in="specularLighting" in2="composite1" operator="in" result="composite2" />
            <feComposite in="specularLighting2" in2="composite1" operator="in" result="composite3" />
            <feComposite in="specularLighting1" in2="composite1" operator="in" result="composite4" />
            <feBlend mode="multiply" in="composite4" in2="SourceGraphic" result="blend" />
            <feBlend mode="color-dodge" in="composite2" in2="blend" result="blend1" />
            <feBlend mode="soft-light" in="composite3" in2="blend1" result="blend2" />
        </filter>
    }
}


export const yanwu = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '烟雾',
    filterId: 'yanwu',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.013 0.01" numOctaves="2" seed="1" stitchTiles="stitch" result="turbulence" />
            <feFlood flood-color="#38252f" flood-opacity="1" result="flood" />
            <feComposite in="flood" in2="turbulence" operator="in" result="composite1" />
            <feComposite in="composite1" in2="SourceAlpha" operator="in" result="composite2" />
        </filter>
    }

}


