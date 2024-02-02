/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-01 19:16:23
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 08:51:29
 * @FilePath: /1s/server/sequelize/models/t_image_group.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_image_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_image_group.init({
    name: DataTypes.STRING,
    description:DataTypes.STRING,
    imgs:DataTypes.JSON,
  }, {
    sequelize,
    modelName: 't_image_group',
  });
  return t_image_group;
};