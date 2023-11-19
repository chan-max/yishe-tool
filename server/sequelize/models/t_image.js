'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_image.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_image',
  });
  return t_image;
};