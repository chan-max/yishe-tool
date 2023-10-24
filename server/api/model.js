import {sleep} from '../util.js'


export const getModelListHook = (router,sequelize) => router.post('/getModelList' , async (ctx) => {
    const table = sequelize.models.Model1;
    const res =  await table.findAll();
    
    ctx.body = {
        data:res
    }
})

