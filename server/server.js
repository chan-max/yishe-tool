import Koa from "koa";
import Router from "koa-router";
import cors from "koa2-cors";
import jwt from "jsonwebtoken";
import path from "path";
import _static from "koa-static";
import { koaBody } from "koa-body";
import { fileURLToPath } from "url";
import { initRouter } from "./router.js"
import http from "http";
import ip from "ip";

import { getUploadPath } from "./fileManage.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = new Koa();
const router = new Router();

import db from './sequelize/models/index.js'

initRouter(router, db.sequelize, app);

// 前端打包后的代码
app.use(_static(path.join(__dirname, "../dist")));

app.use(_static(path.join(__dirname, "../static")));

import { uploadsPath } from "./fileManage.js"

app.use(_static(uploadsPath));


app.use(cors({ origin: "*", credentials: true }));

app.use(koaBody({ multipart: true ,    
    formidable: {
    // 上传目录
    uploadDir : getUploadPath(),
    // 保留文件扩展名
    keepExtensions: true,
}}));


app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000

// 获取当前服务运行的主机名


export function getHost(){
    return  ip.address() + ':' + port
}

await app.listen(port);
console.log("1s is running at http://localhost:3000");
