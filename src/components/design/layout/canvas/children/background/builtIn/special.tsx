
// import { CustomBackgroundCategory } from './index'


export const heixian = {
    label: '黑线',
    id: 'heixian',

    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <filter id="heixian">
                <feTurbulence baseFrequency=".005" numOctaves="5" />
                <feComponentTransfer>
                    <feFuncA type="discrete" tableValues="1 0 1 0 1 0 1 0 1 0" />
                </feComponentTransfer>
                <feConvolveMatrix kernelMatrix="1 0 1
                                        0 -4 0
                                        1 0 1"/>
                <feColorMatrix values="0 0 0 -1 1
                               0 0 0 -1 1
                               0 0 0 -1 1
                               0 0 0  0 1"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#heixian)" />
        </svg>
    }
}



export const honhsemubu = {
    label: '红色幕布',
    id: 'honhsemubu',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <filter id="honhsemubu">
                <feTurbulence baseFrequency="0.01 0.0001" numOctaves="5" />
                <feColorMatrix values="1 0 0 0 .1
                                   0 0 0 0 0
                                   0 0 0 0 0
                                   0 0 0 0 1"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#honhsemubu)" />
        </svg>
    }
}


/**
 * @description 粉色煎蛋
*/

export const fensejiandan = {
    label: '粉色煎蛋',
    id: 'fensejiandan',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
            <pattern id="fensejiandan-pattern" width="142" height="82" patternUnits="userSpaceOnUse">
                <path d="M9 41a17 17 0 1 1 0 1zM80 0a17 17 0 1 0 0 -1m0 82a17 17 0 1 1 0 1z" fill="#ea3" stroke="#fff" stroke-width="16" />
            </pattern>
            <filter id="fensejiandan">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" />
                <feDisplacementMap in="SourceGraphic" scale="35" />
                <feComposite in="SourceGraphic" operator="atop" />
            </filter>
            <rect width="100%" height="100%" fill="pink" />
            <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#fensejiandan-pattern)" filter="url(#fensejiandan)" />
        </svg>
    }
}


export const peigenpisa = {
    label: '培根披萨',
    id: 'peigenpisa',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
            <pattern id="peigenpisa-pattern" width="86" height="150" patternUnits="userSpaceOnUse">
                <circle r="200" fill="blue" />
                <path d="M43 0a25 25 0 1 0 1 0M0 75a25 25 0 1 1 0 50m86 0a25 25 0 0 1 0 -50" fill="red" />
            </pattern>
            <filter id="peigenpisa">
                <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" result="n" />
                <feDisplacementMap in="SourceGraphic" scale="9" />
                <feBlend in="n" />
                <feColorMatrix values="-.3 0 0 0 1
                                   -.6 0 .6 0 .3
                                   -.6 0 .6 0 0
                                   0 0 0 0 1"/>
            </filter>
            <circle cx="50%" cy="50%" r="71%" fill="url(#peigenpisa-pattern)" filter="url(#peigenpisa)" />
        </svg>

    }
}


export const xiguapi = {
    label: '西瓜皮',
    id: 'xiguapi',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <pattern id="xiguapi-pattern" width="80" height="1" patternUnits="userSpaceOnUse">
                <circle r="99" fill="#3f812d" />
                <path d="M0 0H32V1H0Z" fill="#96c96d" />
            </pattern>
            <filter id="xiguapi">
                <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" />
                <feDisplacementMap in="SourceGraphic" scale="48" />
            </filter>
            <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#xiguapi-pattern)" filter="url(#xiguapi)" />
        </svg>

    }
}



export const xiaomifeng = {
    label: '小蜜蜂',
    id: 'xiaomifeng',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <pattern id="xiaomifeng-pattern" width="100" height="1" patternUnits="userSpaceOnUse">
                <circle r="101" />
                <path d="M27 0h46V1H27z" fill="#ff1" />
            </pattern>
            <filter id="xiaomifeng">
                <feTurbulence type="fractalNoise" baseFrequency=".005 1" numOctaves="3" />
                <feDisplacementMap in="SourceGraphic" xChannelSelector="R" scale="50" />
            </filter>
            <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#xiaomifeng-pattern)" filter="url(#xiaomifeng)" />
        </svg>
    }
}




export const baisebowenqiangzhi = {
    label: '白色波纹墙纸',
    id: 'baisebowenqiangzhi',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <filter id="baisebowenqiangzhi" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence baseFrequency="0.1" type="turbulence" result='noise' />
                <feDiffuseLighting in='noise'
                    result='diffLight'
                    lighting-color='white'
                    surfaceScale='2'>
                    <feDistantLight azimuth='45' elevation='60' />
                </feDiffuseLighting>
            </filter >
            <rect x="-10%" y="-10%" width="120%" height="120%" filter="url(#baisebowenqiangzhi)" />
        </svg>
    }
}


export const xingkong = {
    label: '星空',
    id: 'xingkong',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <filter id="xingkong">
                <feTurbulence baseFrequency="0.2" />
                <feColorMatrix values="0 0 0 9 -4
                               0 0 0 9 -4
                               0 0 0 9 -4
                               0 0 0 0 1"/>
            </filter>
            <rect x="-10%" y="-10%" width="120%" height="120%" filter="url(#xingkong)" />
        </svg>
    }
}


export const muwen = {
    label: '木纹',
    id: 'muwen',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <filter id="muwen">
                <feTurbulence type="fractalNoise" baseFrequency=".1 .01" />
                <feColorMatrix values="0 0 0 .11 .69
                               0 0 0 .09 .38
                               0 0 0 .08 .14
                               0 0 0 0 1"/>
            </filter>
            <rect x="-10%" y="-10%" width="120%" height="120%" filter="url(#muwen)" />
        </svg>

    }
}



export const nainiu = {
    label: '奶牛条纹',
    id: 'nainiu',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <filter id="nainiu">
                <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="2" />
                <feComponentTransfer>
                    <feFuncA type="discrete" tableValues="0 1 0" />
                </feComponentTransfer>
                <feColorMatrix values="0 0 0 1 0
                               0 0 0 1 0
                               0 0 0 1 0
                               0 0 0 0 1"/>
            </filter>
            <rect x="-10%" y="-10%" width="120%" height="120%" filter="url(#nainiu)" />
        </svg>
    }
}


export const micai = {
    label: '迷彩',
    id: 'micai',
    renderSlot: () => {
        return <svg style="width:100%;height:100%">
            <filter id="micai">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" />
                <feComponentTransfer>
                    <feFuncR type="discrete" tableValues="0 0 1" />
                    <feFuncG type="discrete" tableValues="0 0 0 1 1" />
                    <feFuncB type="discrete" tableValues="0 1" />
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
            <rect x="-10%" y="-10%" width="120%" height="120%" filter="url(#micai)" />
        </svg>

    }
}



export const banmawen = {
    label: '斑马纹',
    id: 'banmawen',
    renderSlot: () => {
        return <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <linearGradient id="banmawen-gradient" x2="50" spreadMethod="reflect" gradientUnits="userSpaceOnUse">
                <stop offset="50%" />
                <stop stop-color="#fff" />
            </linearGradient>
            <filter id="banmawen">
                <feTurbulence baseFrequency=".005" numOctaves="5" />
                <feGaussianBlur stdDeviation="1" />
                <feDisplacementMap in="SourceGraphic" scale="40" />
            </filter>
            <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#banmawen-gradient)" filter="url(#banmawen)" />
        </svg>

    }
}