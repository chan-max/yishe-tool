import TextToSvg from 'text-to-svg'
import sharp from 'sharp';
import path from 'path'

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

export const createWordArtHook = (router) => router.get('/createWordArt/:text/:color', async (ctx) => {
    const { text, color } = ctx.params;

    const fontPath = path.resolve('./static/fonts/1.ttf')

    const font = TextToSvg.loadSync(fontPath);

    const svg = font.getSVG(text, { fill: '#ff0000' });

    ctx.body = svg;
})