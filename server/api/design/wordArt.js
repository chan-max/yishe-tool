import TextToSvg from 'text-to-svg'

/*
    根据字体，文字获取艺术字图片资源
    svg,png
*/


export const getWordArtStickerHook = (router) => router.get('/getWordArtSticker/:font/:text',(ctx) => {

    const ttf = TextToSvg.loadSync('../../../static/font/1.ttf')
    const svg = ttf.getSVG('666')
    ctx.body = {
        type:ctx.params
    }
})

