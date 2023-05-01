

export const signUpHook = (router, sequelize, app) => router.post('/signUp', (ctx, next) => {
    const { phonenumber, account, password } = ctx.request.body

    sequelize.models.users.find

    ctx.body = data
})




