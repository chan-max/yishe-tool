import { generateVerificationCode } from '../util.js';
import {sendValidateCodeEmail} from '../util/email.js'


// 防止重复发送邮件
export const mailedMap = {}

export const sendEmailHook = (router,sequelize) => router.post('/sendEmail', async (ctx) => {
    const { email} = ctx.request.body;

    if(mailedMap[email]){
       return ctx.body = {
            message:'验证码已发送，请不要频繁发送',
            type:'info'
        }
    }


    const validateCode = generateVerificationCode()
    var res = null
    try{
        res = await sendValidateCodeEmail({
            email,
            validateCode
        })
        mailedMap[email] = validateCode
        setTimeout(() => {
            mailedMap[email] = null
        }, 10 * 1000 * 60);
        ctx.body = {
            message:'验证码发送成功',
            type:'success'
        }
    }catch(e){
        ctx.body = {
            message:'验证码发送失败',
            type:'info'
        }
    }
})
