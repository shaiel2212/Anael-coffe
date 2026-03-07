'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('financial_records', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      cafe_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: true },
      type: { type: Sequelize.ENUM('income', 'expense'), allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: true },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('financial_records', ['cafe_id']);
    await queryInterface.addIndex('financial_records', ['date']);
    await queryInterface.addIndex('financial_records', ['type']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('financial_records');
  },
};
