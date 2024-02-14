/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-14 11:30:36
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 22:25:04
 * @FilePath: /yishe/server/sequelize/models/t_communication.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_communication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.t_communication.belongsTo(models.t_user, {
        foreignKey: 'initiator_id',
        targetKey: 'id',
        as: 'initiator_info'
      });

      models.t_communication.belongsTo(models.t_user, {
        foreignKey: 'receiver_id',
        targetKey: 'id',
        as: 'receiver_info'
      });
    }
  }
  t_communication.init({
    initiator_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 't_communication',
  });
  return t_communication;
};