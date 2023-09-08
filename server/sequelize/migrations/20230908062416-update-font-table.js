'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.renameColumn('Fonts', 'desc', 'description');
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.renameColumn('Fonts', 'description', 'desc');
  }
};
