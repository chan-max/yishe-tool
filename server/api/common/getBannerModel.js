import path from 'path'
import fs from 'fs'

export const getBannerModelHook = (router) => router.get('/getBannerModel',  (ctx) => {
    var path = process.cwd() + '/static/bannerModel.glb';
    const glbFile = fs.readFileSync(path);
    
    // ctx.body = glbFile;
    ctx.body = {
        data:{
            url:'bannerModel.glb',
        }
    }
})
