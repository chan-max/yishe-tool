/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-11 09:10:15
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 23:00:44
 * @FilePath: /yishe/server/sequelize/models/t_follower.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.t_follower.belongsTo(models.t_user, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'user_info'
      });

      models.t_follower.belongsTo(models.t_user, {
        foreignKey: 'follower_id',
        targetKey: 'id',
        as: 'follower_info'
      });
    }
  }
  
  
  t_follower.init({
    user_id: DataTypes.STRING,
    follower_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_follower',
  });
  return t_follower;
};