import { StatusCodeEnum } from "../../../common/enum/statusCode.js"


export const signupHook = (router, sequelize, app) => router.post('/signup', async (ctx, next) => {
    const data = ctx.request.body
    const { phonenumber, account, password } = data

    const table = sequelize.models.users

    
    let _user = await table.findOne({ where: { account } })

    if (_user) {
        ctx.body = {
            status: StatusCodeEnum.ACCOUNT_ALREADY_EXIST
        }
        return
    }

    try {
        await table.create(data)
        return ctx.body = {
            status: StatusCodeEnum.SIGNUP_SUCCESS
        }
    } catch (error) {
        return ctx.body = {
            status: StatusCodeEnum.UNKNOW_ERROR,
            error
        }
    }
})




