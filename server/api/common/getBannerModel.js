import path from 'path'
import fs from 'fs'
import { QueryTypes, literal } from 'sequelize';

export const getBannerModelHook = (router,sequelize) => router.get('/getBannerModel', async (ctx) => {
    const table = sequelize.models.Model1;
    const result = await table.findAll({ order: literal('rand()'), limit: 1 })
    ctx.body = {
        data:result[0]
    }
})
