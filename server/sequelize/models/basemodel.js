'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BaseModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BaseModel.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    filePath: DataTypes.STRING,
    imgPath: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BaseModel',
  });
  return BaseModel;
};