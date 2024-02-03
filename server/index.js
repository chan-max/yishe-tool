import Koa from "koa";
import Router from "koa-router";
import cors from "koa2-cors";
import jwt from "jsonwebtoken";
import path from "path";
import _static from "koa-static";
import { koaBody } from "koa-body";
import { fileURLToPath } from "url";
import { initRouter, initController } from "./router.js"
import fs from "fs";
import http from 'http'
import https from 'https'
import { createRedisClient } from "./redis/index.js";
import { getRelativePath, getUploadPath } from "./fileManage.js"
import { logger } from "./logger.js";
import { middlewares } from "./middleware/index.js";
import ip from 'ip'

import dotenv from 'dotenv'
dotenv.config()


const app = new Koa();


const router = new Router();

// 当前文件全名
const __filename = fileURLToPath(import.meta.url);
// 当前文件所在的路径
const __dirname = path.dirname(__filename);

var redis = null

try {
    redis = await createRedisClient()
} catch (e) {
    console.log('redis 链接失败')
}


app.use(
    cors({
        origin: "*",
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept','X-Requested-With','Origin'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['*'] //设置获取其他自定义字段
    })
);

// 注册中间件
middlewares.forEach((mw) => mw(app))


import db from './sequelize/models/index.js'

initRouter(router, db.sequelize, app, redis);

initController({
    router,
    app,
    sequelize: db.sequelize,
    redis
})

// 前端打包后的代码
app.use(_static(path.join(__dirname, "../www")));
app.use(_static(path.join(__dirname, "../static")));

import { uploadsPath } from "./fileManage.js"
import { formatFilePath } from "./util.js";

app.use(_static(uploadsPath()));

app.use(koaBody({
    multipart: true,
    formidable: {
        // 上传目录
        uploadDir: getUploadPath(),
        // 保留文件扩展名
        keepExtensions: true,
    }
}));

// 定义中间件
app.use(async (ctx, next) => {
    // 将文件将对路径转换为全路径
    ctx.relativePathToPreviewPath = (path) => {
        if (!path) {
            return ''
        }
        return formatFilePath(`${ctx.protocol}://${getHost()}${path}`);
    }

    // 获取上传文件的相对路径
    ctx.getUploadFileRelativePath = (key = 'file') => {
        return getRelativePath(ctx.request.files[key].filepath)
    }

    await next()
})


app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000

// 获取当前服务运行的主机名
export function getHost() {
    return (process.env.localhost || ip.address()) + ':' + port
}

const options = {
    // key:  fs.readFileSync('./ssl/private.key'),
    // cert: fs.readFileSync('./ssl/certificate.crt'),        
    key:  fs.readFileSync('./tools/mac-key.pem'),
    cert: fs.readFileSync('./tools/mac.pem'),
}


var server = process.env.protool === 'https' ? https.createServer(options, app.callback()) : http.createServer({},app.callback())

import { initWebsocket } from './websocket/index.js'

initWebsocket(server)


export async function startServe() {
    await server.listen(3000, '0.0.0.0');
    console.log('1s listening on *:3000');
}


