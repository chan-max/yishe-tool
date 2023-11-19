'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_model1 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_model1.init({
    modelInfo: DataTypes.TEXT('long'),
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_model1',
  });
  return t_model1;
};