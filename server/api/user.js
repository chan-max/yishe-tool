import { ResponseStatusCodeEnum } from "../../common/statusCode.js";
import { getRelativePath } from "../fileManage.js";
import { sendValidateCodeEmail } from "../util/email.js";
import { mailedMap } from "./email.js";

// 获取账号的使用状态



export const getAccountStatusHook = (router, sequelize, app) =>
  router.post("/getAccountStatus", async (ctx, next) => {
    const account = ctx.request.body.account

    const user = await sequelize.models.t_user.findOne({ where: { account } });
    
    if (user) {
      return ctx.body = {
        status: ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST,
      }
    }

    return ctx.body = {
      status: ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST
    }
  })


export const signupHook = (router, sequelize, app) =>
  router.post("/signup", async (ctx, next) => {
    const { email, account, password, avatar, validateCode } = ctx.request.body;

    // if(!validateCode || validateCode != mailedMap[email]){
    //     return ctx.body = {
    //         message:'验证码错误，注册失败',
    //         type:'error'
    //     }
    // }

    const table = sequelize.models.t_user;

    const user = await table.findOne({ where: { account } });

    if (user) {
      ctx.body = {
        message: "该用户已存在",
        type: "info",
        status: ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST,
      };
      return;
    }

    try {
      const data = {
        email, 
        account, 
        password,
        avatar,
        isAdmin: true
      }
      await table.create(data);
      return (ctx.body = {
        status: ResponseStatusCodeEnum.SIGNUP_SUCCESS,
      });
    } catch (error) {
      return (ctx.body = {
        status: ResponseStatusCodeEnum.UNKNOW_ERROR,
      });
    }
  });



// 获取用户列表
export const getUserListHook = (router, sequelize, app) =>
  router.post("/getUserList", async (ctx, next) => {
    const pageSize = 5;
    const currentPage = 1;

    const result = await sequelize.models.t_user.findAndCountAll({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

    ctx.body = {
      data: {
        total: result.count,
        list: result.rows,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: Math.ceil(result.count / pageSize),
      },
    };
  });

// 更新用户信息

export const updateUserInfoHook = (router, sequelize, app) =>
  router.post("/updateUserInfo", async (ctx) => {
    const { id } = ctx.request.body;

    const avatar = getRelativePath(ctx.request.files.avatar.filepath);
    
    await sequelize.models.t_user.update(
      {
        avatar,
      },
      {
        where: {
          id,
        },
      }
    );

    ctx.body = {
      type: 'success',
      message: '用户信息更新成功'
    };
  });


import jwt from "jsonwebtoken";


export const loginHook = (router, sequelize) => router.post('/login', async (ctx) => {
  const data = ctx.request.body
  const { account, password } = data
  const table = sequelize.models.t_user

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


  user.setDataValue('preview_avatar', ctx.relativePathToPreviewPath(user.avatar))


  ctx.set('Token', ctx.signToken({
    userId: user.id,
  }))
  
  return ctx.body = {
    status: ResponseStatusCodeEnum.LOGIN_SUCCESS,
    data: user
  }
})