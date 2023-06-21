import Sequelize from 'sequelize';
import { initTables } from './table/index.js';

export const setupDatabase = () => new Promise(async (resolve, reject) => {
    const sequelize = new Sequelize(
        '1s', // 数据库名称
        'root',  // 用户名
        'root',  // 密码
        {
            host: 'localhost',
            dialect: 'mysql', // 'mysql'|'sqlite'|'postgres'|'mssql'
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

    await initTables(sequelize)
    resolve(sequelize)
})