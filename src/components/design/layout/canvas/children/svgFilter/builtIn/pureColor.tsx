

/*
    所有纯颜色相关的滤镜
*/





export const BlackAndWhiteMatrix = `
0.2126 0.7152 0.0722 0 0
0.2126 0.7152 0.0722 0 0
0.2126 0.7152 0.0722 0 0
0      0      0      1 0
`


/*
    用于构建纯色的滤镜渲染
*/

export function createPureColorMatrixFilterRender(filterId, matrix) {
    return () => {
        return <filter id={filterId}>
            <feColorMatrix
                type="matrix"
                values={matrix} />
        </filter>
    }
}



/*
    复古
*/
export function vintage() {
    return <filter id="vintage">
        <feColorMatrix type="matrix" values="1 0 0 0 0
                                       0.9 0.8 0 0 0
                                       0.7 0.6 0.5 0 0
                                       0 0 0 1 0" />
    </filter>
}










