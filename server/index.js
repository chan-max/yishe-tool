import Koa from 'koa';
import path from 'path'
import _static from 'koa-static'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);


import { setupDatabase } from '../database/setup.js'

const app = new Koa();

app.use(_static(path.join(__dirname, '../dist')))

let sequelize = await setupDatabase()



app.listen(3000);
console.log('server is running at http://localhost:3000')

