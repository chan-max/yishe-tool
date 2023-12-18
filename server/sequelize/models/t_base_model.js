'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_base_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_base_model.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    filePath: DataTypes.STRING,
    imgPath: DataTypes.STRING,
    description_imgs:DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 't_base_model',
  });
  return t_base_model;
};