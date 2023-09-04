import TextToSvg from 'text-to-svg'
import sharp from 'sharp';
import path from 'path'

/*
    根据字体，文字获取艺术字图片资源
    svg,png
*/


export const textStickerHook = (router) => router.get('/textSticker/:text/:color', async (ctx) => {
    const { text, color } = ctx.params;

    const tts = TextToSvg.loadSync();
    const attributes = {fill: 'red', stroke: 'black'};
    const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};
    const svg = tts.getSVG('hello', options);

    ctx.body = svg;
})


