'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_available_model_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_available_model_comment.init({
    available_model_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    like_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 't_available_model_comment',
  });
  return t_available_model_comment;
};