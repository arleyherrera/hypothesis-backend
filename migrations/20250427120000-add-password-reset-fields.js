'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'resetPasswordToken', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('Users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });

    // Añadir índice para búsquedas más rápidas por token
    await queryInterface.addIndex('Users', ['resetPasswordToken'], {
      name: 'Users_reset_password_token_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'Users_reset_password_token_idx');
    await queryInterface.removeColumn('Users', 'resetPasswordExpires');
    await queryInterface.removeColumn('Users', 'resetPasswordToken');
  }
};
