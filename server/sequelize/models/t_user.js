/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:56
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 13:59:02
 * @FilePath: /1s/server/sequelize/models/t_user.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    phonenumber: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    }
  }, {
    sequelize,
    modelName: 't_user',
  });
  return User;
};