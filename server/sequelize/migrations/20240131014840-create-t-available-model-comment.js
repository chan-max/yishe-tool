/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-03 11:12:07
 * @FilePath: /1s/server/sequelize/migrations/20240131014840-create-t-available-model-comment.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('t_available_model_comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      available_model_id: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      root_id: {
        type: Sequelize.STRING
      },
      root_children_count: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      like_count: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('t_available_model_comments');
  }
};