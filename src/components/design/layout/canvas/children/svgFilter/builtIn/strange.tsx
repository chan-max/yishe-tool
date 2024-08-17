


/**
 * @description 简易的扭曲效果
*/
export const twisted = () => {
    return <filter id="twisted" x="-.048" y="-.048" width="1.096" height="1.096" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" result="result5" stdDeviation="3" />
        <feTurbulence baseFrequency="0.02" numOctaves="3" result="result1" type="fractalNoise" />
        <feDisplacementMap in="SourceGraphic" in2="result1" result="result3" scale="30" xChannelSelector="R" yChannelSelector="G" />
        <feComposite in="result3" in2="result1" operator="out" result="result4" />
        <feComposite in2="result4" k1="0.3" k2="1" k3="0.3" operator="arithmetic" result="result6" />
        <feComposite in="result6" in2="result5" />
    </filter>
}


/**
 * @description 彩色条纹
*/

export const line = ({
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





/*
    一层毛茸茸的效果
*/
export const maorongrong = {
}