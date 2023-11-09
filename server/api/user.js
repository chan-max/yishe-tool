import { ResponseStatusCodeEnum } from "../../common/enum/statusCode.js";
import { getRelativePath } from "../fileManage.js";
import { generateVerificationCode,formatFilePath } from "../util.js";
import { sendValidateCodeEmail } from "../util/email.js";
import { mailedMap } from "./email.js";

export const signupHook = (router, sequelize, app) =>
  router.post("/signup", async (ctx, next) => {
    const { email, account, password, avatar, validateCode } = ctx.request.body;

    // if(!validateCode || validateCode != mailedMap[email]){
    //     return ctx.body = {
    //         message:'验证码错误，注册失败',
    //         type:'error'
    //     }
    // }

    const table = sequelize.models.User;

    const _user = await table.findOne({ where: { account } });

    if (_user) {
      ctx.body = {
        message: "该用户已存在",
        type: "info",
        status: ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST,
      };
      return;
    }

    try {
      data.isAdmin = true;
      await table.create(data);
      return (ctx.body = {
        message: "注册成功",
        type: "success",
        status: ResponseStatusCodeEnum.SIGNUP_SUCCESS,
      });
    } catch (error) {
      return (ctx.body = {
        message: "注册失败",
        type: "error",
        status: ResponseStatusCodeEnum.UNKNOW_ERROR,
      });
    }
  });

// 获取用户列表
export const getUserListHook = (router, sequelize, app) =>
  router.post("/getUserList", async (ctx, next) => {
    const pageSize = 5;
    const currentPage = 1;

    const result = await sequelize.models.User.findAndCountAll({
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

    await sequelize.models.User.update(
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
      type:'success',
      message:'用户信息更新成功'
    };
  });


import jwt from "jsonwebtoken";

export const loginHook = (router, sequelize) => router.post('/login', async (ctx) => {
    const data = ctx.request.body
    const { account, password } = data
    const table = sequelize.models.User

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

    // 登陆成功，签发token

    const token = jwt.sign({ account, exp: Date.now() + 60 * 60 }, '1s');

    ctx.set('Token',token)
    
    user.avatar = formatFilePath(`${ctx.protocol}://${ctx.host}${user.avatar}`);
    

    return ctx.body = {
        status: ResponseStatusCodeEnum.LOGIN_SUCCESS,
        data: user
    }
})