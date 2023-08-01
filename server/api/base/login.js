import { ResponseStatusCodeEnum } from "../../../common/enum/statusCode.js"
import jwt from "jsonwebtoken";


export const loginHook = (router, sequelize) => router.post('/login', async (ctx) => {
    const data = ctx.request.body
    const { account, password } = data
    const table = sequelize.models.users

    const user = await table.findOne({ where: { account } })

    if (!user) {
        return ctx.body = {
            status: ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST
        }
    }
    
    if (password !== user.dataValues.password) {
        return ctx.body = {
            status: ResponseStatusCodeEnum.PASSWORD_ERROR
        }
    } 


    const token = jwt.sign({ account, exp: Date.now() + 60 * 60 }, '1s');
    ctx.set('Token',token)
    
    
    return ctx.body = {
        status: ResponseStatusCodeEnum.LOGIN_SUCCESS,
        data: user
    }
})