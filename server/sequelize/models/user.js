'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    phonenumber: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    }
  }, {
    sequelize,
    modelName: 't_user',
  });
  return User;
};