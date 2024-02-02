/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-02 07:27:31
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 08:16:20
 * @FilePath: /1s/server/sequelize/migrations/20240201232731-update-image-group.js
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
    await queryInterface.addColumn('t_image_groups', 'imgs', {
      type: Sequelize.JSON,
      allowNull:true
    })

    await queryInterface.addColumn('t_image_groups', 'description', {
      type: Sequelize.STRING,
      allowNull:true
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
