import { DataTypes } from "sequelize"



export const USER_TABLE = {
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING
    },
    // 用户名
    name: {
        type: DataTypes.STRING,
    },
    phonenumber: {
        type: DataTypes.STRING,
    },
    // 账号对于每个用户为唯一
    account: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
    },
    accountStatus: {
        type: DataTypes.STRING
    },
    avatar:{
        type:DataTypes.TEXT('long')
    },
    isAdmin:{
        type:DataTypes.BOOLEAN,
    }
}
