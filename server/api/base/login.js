import { StatusCodeEnum } from "../../../common/enum/statusCode.js"
import jwt from "jsonwebtoken";


export const loginHook = (router, sequelize) => router.post('/login', async (ctx) => {
    const data = ctx.request.body
    const { account, password } = data
    const userTable = sequelize.models.users

    const user = await userTable.findOne({ where: { account } })

    if (!user) {
        return ctx.body = {
            status: StatusCodeEnum.ACCOUNT_NOT_EXIST
        }
    }
    
    if (password !== user.dataValues.password) {
        return ctx.body = {
            status: StatusCodeEnum.PASSWORD_ERROR
        }
    } 


    const token = jwt.sign({ account, exp: Date.now() + 60 * 60 }, '1s');
    ctx.set('Token',token)
    
    
    return ctx.body = {
        status: StatusCodeEnum.LOGIN_SUCCESS,
        data: user
    }
})