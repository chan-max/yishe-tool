/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-29 20:40:22
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-14 23:14:16
 * @FilePath: /1s/server/sequelize/models/t_model_comment.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_model_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_model_comment.init({
    model_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    parent_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 't_model_comment',
  });
  return t_model_comment;
};