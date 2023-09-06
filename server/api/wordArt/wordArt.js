import TextToSvg from 'text-to-svg'
import sharp from 'sharp';
import path from 'path'

/*
    根据字体，文字获取艺术字图片资源
    svg,png
*/


export const textStickerHook = (router) => router.get('/textSticker', async (ctx) => {
    const { text, color, } = ctx.query;
    
    const tts = TextToSvg.loadSync();
    const attributes = {fill: color};
    const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes,fontWeight: 900};
    const svg = tts.getSVG(text, options);
    
    ctx.set('Content-Type', 'image/svg+xml');
    ctx.body = svg;
})




