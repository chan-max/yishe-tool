
export const getWebStickersHook = (router) => router.post('/getWebStickers',(ctx) => {
    ctx.body = {
        data:[
            {
                type:'最近更新',
                data:[{
                    source:'stickers/twitter.png',
                    name:'twitter',
                },{
                    source:'stickers/apple.png',
                    name:'apple',
                },{
                    source:'stickers/savior.png',
                    name:'救世主',
                },{
                    source:'stickers/long.png',
                    name:'长图片测试',
                }
            ]
            },
            {
                type:'热门贴纸',
                data:[]
            },
            {
                type:'相关推荐',
                data:[]
            },
            {
                type:'我的创作',
                data:[]
            },
            {
                type:'我的收藏',
                data:[]
            },
        ]
    }
})

