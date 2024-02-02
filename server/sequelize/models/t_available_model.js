/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 17:01:34
 * @FilePath: /1s/server/sequelize/models/t_available_model.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_available_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.t_available_model.belongsTo(models.t_model, {
        foreignKey:'model_id',
        targetKey:'id',
      });
      models.t_available_model.belongsTo(models.t_user, {
        foreignKey:'user_id',
        targetKey:'id',
      });
    }
  }
  t_available_model.init({
    model_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    like_count:{
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    comment_count:{
      type: DataTypes.INTEGER,
      defaultValue:0
    }
  }, {
    sequelize,
    modelName: 't_available_model',
  });
  return t_available_model;
};