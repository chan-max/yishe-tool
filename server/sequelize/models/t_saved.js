'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_saved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_saved.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    data_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_saved',
  });
  return t_saved;
};