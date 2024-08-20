import { SvgFilterCategory } from '@/types/filter.ts'


export const baisebowenqiangzhi = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '白色波纹墙纸',
    filterId: 'baisebowenqiangzhi',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency="0.1" type="turbulence" result='noise' />
            <feDiffuseLighting in='noise'
                result='diffLight'
                lighting-color='white'
                surfaceScale='2'>
                <feDistantLight azimuth='45' elevation='60' />
            </feDiffuseLighting>
        </filter >
    }
}


export const xingkong = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '星空',
    filterId: 'xingkong',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>
            <feTurbulence baseFrequency="0.2" />
            <feColorMatrix values="0 0 0 9 -4
                               0 0 0 9 -4
                               0 0 0 9 -4
                               0 0 0 0 1"/>
        </filter>
    }
}


export const muwen = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '木纹',
    filterId: 'muwen',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency=".1 .01" />
            <feColorMatrix values="0 0 0 .11 .69
                               0 0 0 .09 .38
                               0 0 0 .08 .14
                               0 0 0 0 1"/>
        </filter>

    }
}



export const nainiu = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '奶牛条纹',
    filterId: 'nainiu',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="2" />
            <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 1 0" />
            </feComponentTransfer>
            <feColorMatrix values="0 0 0 1 0
                               0 0 0 1 0
                               0 0 0 1 0
                               0 0 0 0 1"/>
        </filter>

    }
}


export const micai = {
    category: SvgFilterCategory.SpecialEffect,
    filterLabel: '迷彩·',
    filterId: 'micai',
    displayRender: null,
    render: ({
        filterId
    }) => {
        return <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3"/>
        <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0 1"/>
            <feFuncG type="discrete" tableValues="0 0 0 1 1"/>
            <feFuncB type="discrete" tableValues="0 1"/>
        </feComponentTransfer>
        <feColorMatrix values="1  0 0 0 0
                              -1  1 0 0 0
                              -1 -1 1 0 0
                               0  0 0 0 1"/>
        <feColorMatrix values="-.08  .42  .09 0 .08
                               -.17  .35 -.08 0 .17
                               -.08  .15 -.04 0 .08
                                0    0     0    0 1"/>
        </filter>

    }
}






