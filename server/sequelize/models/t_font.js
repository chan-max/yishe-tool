'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_font extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_font.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    file: DataTypes.STRING,
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_font',
  });
  return t_font;
};