


export const getBaseSkyboxHook =  (router) => router.get('/getBaseSkybox',(ctx) => {
    ctx.body = {
        data:[{
            name:'太空',
            source:'/sphereskybox/space.jpg',
        },{
            name:'深海',
            source:'/sphereskybox/deepocean.jpg',
        },{
            name:'天空',
            source:'/sphereskybox/space.jpg',
        },{
            name:'正方体天空',
            source:[
                '/cubeskybox/sky/right.jpg',
                '/cubeskybox/sky/left.jpg',
                '/cubeskybox/sky/top.jpg',
                '/cubeskybox/sky/bottom.jpg',
                '/cubeskybox/sky/front.jpg',
                '/cubeskybox/sky/back.jpg'
            ],
        }]
    }
})