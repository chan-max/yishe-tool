/* 如果直接导出对象，会出现读配置文件为空的情况 */ 
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    host: "127.0.0.1",
    dialect: "mysql",
  }
};
