
import { StatusCodeEnum } from "../../../common/enum/statusCode.js"

export const loginHook = (router, sequelize) => router.post('/login', async (ctx) => {
    const data = ctx.request.body
    const { account, password } = data
    const userTable = sequelize.models.users

    const userInfo = await userTable.findOne({ where: { account } })

    if (!userInfo) {
        return ctx.body = {
            status: StatusCodeEnum.ACCOUNT_NOT_EXIST
        }
    }
    
    if (password !== userInfo.dataValues.password) {
        return ctx.body = {
            status: StatusCodeEnum.PASSWORD_ERROR
        }
    } else {
        // 登陆成功
        return ctx.body = {
            status: StatusCodeEnum.LOGIN_SUCCESS,
            data: userInfo
        }
    }
})