'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_transactions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      inventory_item_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: true },
      type: { type: Sequelize.ENUM('in', 'out', 'adjustment'), allowNull: false },
      quantity: { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      quantity_before: { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      quantity_after: { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('inventory_transactions', ['inventory_item_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inventory_transactions');
  },
};
