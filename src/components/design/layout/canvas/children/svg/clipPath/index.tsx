



/**
 * @description 定义通用的 裁剪路径
*/
export const SvgClipPathComponent = () => {
    return <>
        <style>
            {
                ` 
                .svg-circle {
                    clip-path: url("#svgCircle");
                  }
            `
            }
        </style>
        <svg id="define-clippath" width="0" height="0">
            <defs>
                <clipPath id="svgCircle">
                    <circle cx="500" cy="500" r="400" />
                </clipPath>
            </defs>
        </svg>
    </>
}