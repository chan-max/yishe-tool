'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_model_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_model_comment.init({
    model_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    parent_id: DataTypes.INTEGER,
    t_user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 't_model_comment',
  });
  return t_model_comment;
};