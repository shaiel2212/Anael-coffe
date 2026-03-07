'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_items', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      cafe_id: { type: Sequelize.UUID, allowNull: false },
      name: { type: Sequelize.STRING(255), allowNull: false },
      unit: { type: Sequelize.STRING(50), allowNull: false },
      current_quantity: { type: Sequelize.DECIMAL(10, 3), allowNull: false, defaultValue: 0 },
      minimum_quantity: { type: Sequelize.DECIMAL(10, 3), allowNull: false, defaultValue: 0 },
      cost_per_unit: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      supplier: { type: Sequelize.STRING(255), allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('inventory_items', ['cafe_id']);
    await queryInterface.addIndex('inventory_items', ['name']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inventory_items');
  },
};
