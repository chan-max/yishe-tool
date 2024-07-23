import { canvasStickerOptions, currentOperatingCanvasChildIndex } from '@/components/design/layout/canvas/index.tsx'


// 创建svg滤镜

/*
    svg 滤镜中统一使用 px 单位
*/


export enum SvgFilterEffects {
    DROP_SHADOW = 'drop-shadow'
}

export const SvgFilterEffectDisplayLabelMap = {
    [SvgFilterEffects.DROP_SHADOW]: '投影(feDropShadow)'
}

function createFeDropShadowDefaultOptions() {
    let unit = canvasStickerOptions.value.unit
    return {
        type: SvgFilterEffects.DROP_SHADOW,
        dx: {
            value: 1,
            unit: unit
        },
        dy: {
            value: 1,
            unit: unit
        },
        stdDeviationX: {
            value: 1,
            unit: unit
        },
        stdDeviationY: {
            value: 1,
            unit: unit
        },
        floodColor: {
            type: 'pure',
            color: "#ff0000",
        },
        floodOpacity: 1,
    }
}


export const SvgFilterCreatorMap = {
    [SvgFilterEffects.DROP_SHADOW]: createFeDropShadowDefaultOptions
}



/* 添加 过滤特效 */
export function addSvgFilterEffect(type) {
    canvasStickerOptions.value.svgFilter.children.push(
        SvgFilterCreatorMap[type]?.call()
    )
}





// 1. feBlend - 混合
// 将两个对象组合在一起，使用不同的混合模式
export const FeBlend = ({ in1, in2, mode = 'normal', result }) => (
    <feBlend in={in1} in2={in2} mode={mode} result={result} />
);

// 2. feColorMatrix - 颜色矩阵
// 通过矩阵乘法转换颜色
export const FeColorMatrix = ({ type, values, result }) => (
    <feColorMatrix type={type} values={values} result={result} />
);

// 3. feComponentTransfer - 组件转换
// 对颜色的每个通道进行独立操作
export const FeComponentTransfer = ({ children, result }) => (
    <feComponentTransfer result={result}>{children}</feComponentTransfer>
);

// 4. feComposite - 合成
// 将两个图像进行组合，使用 Porter-Duff 合成操作
export const FeComposite = ({ in1, in2, operator = 'over', result }) => (
    <feComposite in={in1} in2={in2} operator={operator} result={result} />
);

// 5. feConvolveMatrix - 卷积矩阵
// 应用矩阵卷积滤镜效果
export const FeConvolveMatrix = ({ kernelMatrix, result }) => (
    <feConvolveMatrix kernelMatrix={kernelMatrix} result={result} />
);

// 6. feDiffuseLighting - 漫反射光照
// 创建漫反射光照效果
export const FeDiffuseLighting = ({ surfaceScale, diffuseConstant, result, children }) => (
    <feDiffuseLighting surfaceScale={surfaceScale} diffuseConstant={diffuseConstant} result={result}>
        {children}
    </feDiffuseLighting>
);

// 7. feDisplacementMap - 置换图
// 使用一个图像来置换另一个图像的像素
export const FeDisplacementMap = ({ in1, in2, scale, xChannelSelector, yChannelSelector, result }) => (
    <feDisplacementMap in={in1} in2={in2} scale={scale} xChannelSelector={xChannelSelector} yChannelSelector={yChannelSelector} result={result} />
);

// 8. feFlood - 填充
// 用指定的颜色和不透明度填充滤镜区域
export const FeFlood = ({ floodColor, floodOpacity, result }) => (
    <feFlood floodColor={floodColor} floodOpacity={floodOpacity} result={result} />
);

// 9. feGaussianBlur - 高斯模糊
// 创建模糊效果
export const FeGaussianBlur = ({ stdDeviation, result }) => (
    <feGaussianBlur stdDeviation={stdDeviation} result={result} />
);

// 10. feImage - 图像
// 引用外部图像作为滤镜输入
export const FeImage = ({ href, result }) => (
    <feImage href={href} result={result} />
);

// 11. feMerge - 合并
// 将多个滤镜效果层叠在一起
export const FeMerge = ({ children, result }) => (
    <feMerge result={result}>{children}</feMerge>
);

// 12. feMorphology - 形态学
// 对图像进行"胖化"或"瘦化"操作
export const FeMorphology = ({ operator, radius, result }) => (
    <feMorphology operator={operator} radius={radius} result={result} />
);

// 13. feOffset - 偏移
// 对图像进行平移
export const FeOffset = ({ dx, dy, result }) => (
    <feOffset dx={dx} dy={dy} result={result} />
);

// 14. feSpecularLighting - 镜面光照
// 创建镜面光照效果
export const FeSpecularLighting = ({ surfaceScale, specularConstant, specularExponent, result, children }) => (
    <feSpecularLighting surfaceScale={surfaceScale} specularConstant={specularConstant} specularExponent={specularExponent} result={result}>
        {children}
    </feSpecularLighting>
);

// 15. feTile - 平铺
// 重复平铺图像填充整个滤镜区域
export const FeTile = ({ in1, result }) => (
    <feTile in={in1} result={result} />
);

// 16. feTurbulence - 湍流
// 生成分形噪声图像
export const FeTurbulence = ({ baseFrequency, numOctaves, seed, stitchTiles, type, result }) => (
    <feTurbulence baseFrequency={baseFrequency} numOctaves={numOctaves} seed={seed} stitchTiles={stitchTiles} type={type} result={result} />
);

// 17. feDistantLight - 远光源
// 定义一个远光源，用于光照滤镜
export const FeDistantLight = ({ azimuth, elevation }) => (
    <feDistantLight azimuth={azimuth} elevation={elevation} />
);

// 18. fePointLight - 点光源
// 定义一个点光源，用于光照滤镜
export const FePointLight = ({ x, y, z }) => (
    <fePointLight x={x} y={y} z={z} />
);

// 19. feSpotLight - 聚光灯
// 定义一个聚光灯光源，用于光照滤镜
export const FeSpotLight = ({ x, y, z, pointsAtX, pointsAtY, pointsAtZ, specularExponent, limitingConeAngle }) => (
    <feSpotLight x={x} y={y} z={z} pointsAtX={pointsAtX} pointsAtY={pointsAtY} pointsAtZ={pointsAtZ} specularExponent={specularExponent} limitingConeAngle={limitingConeAngle} />
);




// 马赛克效果滤镜
export const MosaicFilter = () => {
    return <>
        <feDropShadow dx="0" dy="0" stdDeviation="10 10" flood-color="#ff0000" flood-opacity="1"></feDropShadow>
    </>
}


export function SvgFilter(props) {
    return <svg id="filter-container-id" height="0" width="0" xmlns="http://www.w3.org/2000/svg" >
        <defs>
            <filter id="example" x="0" y="0" xmlns="http://www.w3.org/2000/svg">
                <MosaicFilter></MosaicFilter>
            </filter>
        </defs>
    </svg>
}