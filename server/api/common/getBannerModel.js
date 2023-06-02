import path from 'path'
import fs from 'fs'

export const getBannerModelHook = (router) => router.get('/getBannerModel',  (ctx) => {
    var path = process.cwd() + '/static/bannerModel.glb';
    const src = fs.createReadStream(path);
    ctx.body = {
        data:{
            url:'bannerModel.glb',
            source:''
        }
    }
})