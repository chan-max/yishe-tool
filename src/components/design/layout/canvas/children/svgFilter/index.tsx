


// 创建svg滤镜



export function SvgFilter(props) {
    return <svg height="0" width="0" xmlns="http://www.w3.org/2000/svg" >
        <defs>
            <filter id="f1" x="0" y="0" xmlns="http://www.w3.org/2000/svg">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
        </defs>
    </svg>
}