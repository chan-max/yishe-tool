'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_message.init({
    communication_id: DataTypes.INTEGER,
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    payload:DataTypes.JSON
  }, {
    sequelize,
    modelName: 't_message',
  });
  return t_message;
};