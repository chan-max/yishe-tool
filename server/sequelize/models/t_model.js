'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class t_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /*  关联用户表用于查询该模型的作者 */
      models.t_model.belongsTo(models.t_user, {
        foreignKey:'t_user_id',
        targetKey:'id',
      });
    }
  }


  t_model.init({
    modelInfo: DataTypes.TEXT('long'),
    img: DataTypes.STRING,
    t_user_id: {
      type:DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 't_model',
  });
  return t_model;
};