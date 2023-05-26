

export const getBaseModelListHook = (router) => router.get('/getBaseModelList',(ctx) => {
    ctx.body = {
        data:[{
            name:'白色T恤',
            source:'white_shirt.glb',
        },{
            name:'黑色T恤',
            source:'black_shirt.glb',
        },{
            name:'蓝色T恤',
            source:'blue_shirt.glb',
        }]
    }
})