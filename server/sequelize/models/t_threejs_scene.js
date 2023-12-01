'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_threejs_scene extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  t_threejs_scene.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_threejs_scene',
  });
  return t_threejs_scene;
};