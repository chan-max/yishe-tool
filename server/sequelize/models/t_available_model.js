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
    }
  }
  t_available_model.init({
    model_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 't_available_model',
  });
  return t_available_model;
};