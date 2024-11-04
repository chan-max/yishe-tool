

/*
    所有纯颜色相关的滤镜
*/



export const BlackAndWhiteMatrix = `
0.2126 0.7152 0.0722 0 0
0.2126 0.7152 0.0722 0 0
0.2126 0.7152 0.0722 0 0
0      0      0      1 0
`


export const blackAndWhite = {
    filterLabel: '黑白',
    filterId: 'blackWhite',
    render: () => {
        return <filter id="blackWhite">
            <feColorMatrix
                type="matrix"
                values={BlackAndWhiteMatrix} />
        </filter>
    }
}




/*
    复古
*/

export const anjinhuang = {
    filterLabel: '暗金黄',
    filterId: 'anjinhuang',
    render: function () {
        return <filter id="anjinhuang">
            <feColorMatrix type="matrix" values="0.33 0 0 0 0.66
                           0 0.33 0 0.66 0
                           0 0 0.66 0 0
                           0 0 0 1 0" />
        </filter>
    },
}




/**
 * @method 
*/

export function createPureColorFilterRender(id, r, g, b) {
    return <filter id={id}>
        <feColorMatrix type="matrix" values={

            `${r / 255} 0 0 0 0
            0 ${g / 255} 0 0 0
            0 0 ${b / 255} 0 0
            0 0 0 1 0`

        } />
    </filter>
        ;
}



export const redStamp = {
    filterLabel: '印章红',
    filterId: 'red_stamp',
    render: () => {
        return <filter id='red_stamp'>
            <feColorMatrix type="matrix" values={
                ` 1 0 0 0 255
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0`
            } />
        </filter>
    }
}

export const golden = {
    filterLabel: '金色',
    filterId: 'golden',
    render: () => {
        return <filter id='golden'>
            <feColorMatrix type="matrix" values={
                `
                1.0  0.9  0.2  0 0
                0.5  0.5  0.2  0 0
                0.1  0.1  0.1  0 0
                0    0    0    1 0
                `
            } />
        </filter>
    }
}








