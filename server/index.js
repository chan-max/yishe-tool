import Koa from 'koa';
import Router from 'koa-router'
import cors from 'koa2-cors'
import jwt from 'jsonwebtoken'
import path from 'path'
import _static from 'koa-static'
import { koaBody } from 'koa-body'
import { fileURLToPath } from 'url'
import { initRouter } from './router.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

import { setupDatabase } from '../database/setup.js'

const app = new Koa();
const router = new Router();
const sequelize = await setupDatabase()
initRouter(router, sequelize, app)

app.use(_static(path.join(__dirname, '../dist')))
app.use(cors({ origin: "*", credentials: true }));
app.use(koaBody({ multipart: true }))
app.use(router.routes());
app.use(router.allowedMethods())

await app.listen(3000);
console.log('server is running at http://localhost:3000')

