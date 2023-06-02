
export const getStickersHook = (router) => router.post('/getStickers',(ctx) => {
    ctx.body = {
        data:[
            {
                type:'内置贴图'
            },
            {
                type:'我的收藏'
            },
            {
                type:'上传'
            }
        ]
    }
})