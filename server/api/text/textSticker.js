import TextToSvg from 'text-to-svg'
import sharp from 'sharp';
import path from 'path'
import {getRePath} from '../../fileManage.js';

// 获取所有可用的字体列表 
export const getFontsHook = (router,sequelize) => router.get('/getFonts', async (ctx) => {
    const table = sequelize.models.Font;
    const fonts = await table.findAll();
    ctx.body = {
      data:fonts
    };
})


export const uploadFontHook = (router,sequelize) => router.post('/uploadFont', async (ctx) => {
    const table = sequelize.models.Font;
    const { name, description } = ctx.request.body;
    var { file, img } = ctx.request.files; // 模型文件, 图片
    
    file = getRePath(file?.filepath);
    img  = getRePath(img?.filepath);
    
    await table.create({
      name,
      description,
      file,
      img,
    });

    ctx.body = {
      message: "字体上传成功",
      type:'success'
    };
})


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
