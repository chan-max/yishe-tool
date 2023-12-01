const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    username: process.env.mysql_username ,
    password: process.env.mysql_password ,
    database: process.env.mysql_database ,
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
