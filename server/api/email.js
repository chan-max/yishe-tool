import {sendEmail} from '../util/email.js'

export const sendEmailHook = (router,sequelize) => router.post('/sendEmail', async (ctx) => {
    const { email} = ctx.request.body;
    sendEmail({
        email
    })
    ctx.body = {
        message:'验证码发送成功',
        type:'success'
    }
})
