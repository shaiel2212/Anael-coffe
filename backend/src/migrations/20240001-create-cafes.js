'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cafes', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(255), allowNull: false },
      slug: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      logo_url: { type: Sequelize.TEXT, allowNull: true },
      primary_color: { type: Sequelize.STRING(7), allowNull: true, defaultValue: '#4A90E2' },
      default_language: { type: Sequelize.ENUM('he', 'en', 'ru'), defaultValue: 'he' },
      address: { type: Sequelize.TEXT, allowNull: true },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('cafes');
  },
};
