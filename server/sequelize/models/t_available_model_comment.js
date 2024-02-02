/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 14:17:28
 * @FilePath: /1s/server/sequelize/models/t_available_model_comment.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_available_model_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.t_available_model_comment.belongsTo(models.t_user, {
        foreignKey:'user_id',
        targetKey:'id',
      });
      
    }
  }
  t_available_model_comment.init({
    available_model_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    like_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 't_available_model_comment',
  });
  return t_available_model_comment;
};