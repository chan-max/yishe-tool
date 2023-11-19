'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_text_sticker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_text_sticker.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_text_sticker',
  });
  return t_text_sticker;
};