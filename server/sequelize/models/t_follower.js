'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_follower.init({
    user_id: DataTypes.STRING,
    follower_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_follower',
  });
  return t_follower;
};