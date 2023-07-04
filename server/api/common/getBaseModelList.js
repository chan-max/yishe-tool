

export const getBaseModelListHook = (router) => router.get('/getBaseModelList',(ctx) => {
    ctx.body = {
        data:[{
            name:'白色T恤',
            source:'model/white_shirt.glb',
        },{
            name:'黑色T恤',
            source:'model/black_shirt.glb',
        },{
            name:'蓝色T恤',
            source:'model/blue_shirt.glb',
        },{
            name:'塑胶人',
            source:'model/person.glb',
        }]
    }
})