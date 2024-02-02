/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-02 16:51:32
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 17:00:53
 * @FilePath: /1s/server/sequelize/migrations/20240202085132-update-available-model.js
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
    queryInterface.addColumn('t_available_models', 'like_count',  {
      type: Sequelize.INTEGER,
    })
    queryInterface.addColumn('t_available_models', 'comment_count',  {
      type: Sequelize.INTEGER,
    })
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
