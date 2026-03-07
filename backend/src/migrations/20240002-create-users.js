'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      cafe_id: { type: Sequelize.UUID, allowNull: false },
      name: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'manager', 'employee'), defaultValue: 'employee' },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      last_login_at: { type: Sequelize.DATE, allowNull: true },
      refresh_token: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('users', ['cafe_id']);
    await queryInterface.addIndex('users', ['email']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
