import Koa from 'koa';
import Router from 'koa-router'
import cors from 'koa2-cors'
import jwt from 'jsonwebtoken'
import path from 'path'
import _static from 'koa-static'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

import { setupDatabase } from '../database/setup.js'

const app = new Koa();
const router = new Router();

app.use(_static(path.join(__dirname, '../dist')))

let sequelize = await setupDatabase()

router.get('/accountIsExist', async (ctx, next) => {
    const account = ctx.request.query
    console.log(account);
    ctx.body = true
});

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(router.routes()).use(router.allowedMethods());

await app.listen(3000);
console.log('server is running at http://localhost:3000')

