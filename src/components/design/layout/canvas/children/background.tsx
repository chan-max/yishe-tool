import { getPositionInfoFromOptions } from '../helper.tsx'

export function createCanvasChildBackground(options) {

    const {
        containerStyle: _containerStyle,
        style: _style
    } = getPositionInfoFromOptions(options.position)

    const containerStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: options.zIndex,
        ..._containerStyle
    }

    const style = {
        width:options.width + '%',
        height: options.height + '%',
        background: options.backgroundColor,
        ..._style
    }


    return <div style={containerStyle}>
        <div style={style}></div>
    </div>
}