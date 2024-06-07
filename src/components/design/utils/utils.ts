import { toPng } from "html-to-image"
import {base64ToPngFile} from '@/common/transform/base64ToFile'
import { nextTick } from "vue"

export function onWindowResize(callback: any, immediate: boolean = false) {
    window.onresize = callback
    immediate && callback()
    return () => window.onresize = null
}

export function debounce(fn: Function, wait: number = 10) {
    let timeoutId: any = null
    return (...params) => {
        if (timeoutId !== null) {
            // 存在任务
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn(...params)
            timeoutId = null
        }, wait);
    }
}



export function getElementPureWidth(el: any) {
    return Number(window.getComputedStyle(el).width.split('px')[0])
}

export function getElementPureHeight(el: any) {
    return Number(window.getComputedStyle(el).height.split('px')[0])
}




/*
    在本地使用某个字体
*/
export function useFontFamily(){

}

// 创建文件缩略图
export async function createFontThumbnail({
    file = null, // 字体文件
    content = file.name,
    style = {}
}){

    const baseStyle = {
        fontSize :'30px',
        lineHeight :'30px',
        color:'#000',
        background:'transparent',
        padding:0,
        textWrap: 'nowrap'
    }

    const styleEl = document.createElement("style");
    const fontId = `font_${new Date().getTime()}`

    styleEl.innerHTML = `
          @font-face {
              font-family: ${fontId};
              src: url(${URL.createObjectURL(file)}); 
          }
    `;
  
    document.head.appendChild(styleEl);
    styleEl.setAttribute('font_id',fontId)


    const _style = {
        ...baseStyle,
        ...style,
        fontFamily : fontId,
        position:'absolute',
    }

    _style.lineHeight =_style.fontSize

    const p = document.createElement('div')
    p.style.position = 'relative'
    p.style.top = '0'
    p.style.top = '-1000px'

    let el = document.createElement('span')

    el.innerHTML = content.split('.')[0]

    for(let key in _style){
        let value = _style[key]
        el.style[key] = value
    }

    p.appendChild(el)

    document.body.appendChild(p)
    
    await nextTick()

    const b6 = await toPng(el)

    const png = base64ToPngFile(b6)

    document.body.removeChild(p)
    return png
}