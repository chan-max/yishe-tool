/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 11:24:12
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 11:27:26
 * @FilePath: /1s/server/sequelize/migrations/20240107032412-tmodeladduserid.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('t_models', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
