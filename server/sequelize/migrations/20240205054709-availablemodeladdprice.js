/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-05 13:47:09
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 13:48:07
 * @FilePath: /1s/server/sequelize/migrations/20240205054709-availablemodeladdprice.js
 * @Description:
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('t_available_models', 'price', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
