import { ResponseStatusCodeEnum } from "../../common/enum/statusCode.js"
import { generateVerificationCode } from "../util.js"
import { sendValidateCodeEmail } from "../util/email.js"
import { mailedMap } from "./email.js"

export const signupHook = (router, sequelize, app) => router.post('/signup', async (ctx, next) => {
    const data = ctx.request.body
    const { email, account, password, avatar ,validateCode } = data

    if(!validateCode || validateCode != mailedMap[email]){
        return ctx.body = {
            message:'验证码错误，注册失败',
            type:'error'
        }
    }

    const table = sequelize.models.User

    const _user = await table.findOne({ where: { account } })
    
    if (_user) {
        ctx.body = {
            message:'该用户已存在',
            type:'info',
            status: ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST
        }
        return
    }


    try {
        data.isAdmin = true
        await table.create(data)
        return ctx.body = {
            message:'注册成功',
            type:'success',
            status: ResponseStatusCodeEnum.SIGNUP_SUCCESS
        }
    } catch (error) {
        return ctx.body = {
            message:'注册失败',
            type:'error',
            status: ResponseStatusCodeEnum.UNKNOW_ERROR,
        }
    }
})




// 获取用户列表
export const getUserListHook = (router,sequelize,app) => router.post('/getUserList',async (ctx,next) => {
    
    const pageSize = 5
    const currentPage = 1

    const result = await sequelize.models.User.findAndCountAll({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });

      ctx.body = {
        data:{
            total: result.count,
            list: result.rows,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: Math.ceil(result.count / pageSize),
          }
      }
})