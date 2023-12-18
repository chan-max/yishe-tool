module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('t_base_models', 'description_imgs', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('t_base_models', 'description_imgs');
  }
};
