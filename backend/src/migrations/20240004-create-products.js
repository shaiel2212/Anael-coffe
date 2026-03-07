'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      category_id: { type: Sequelize.UUID, allowNull: false },
      name_he: { type: Sequelize.STRING(255), allowNull: false },
      name_en: { type: Sequelize.STRING(255), allowNull: true },
      name_ru: { type: Sequelize.STRING(255), allowNull: true },
      description_he: { type: Sequelize.TEXT, allowNull: true },
      description_en: { type: Sequelize.TEXT, allowNull: true },
      description_ru: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      image_url: { type: Sequelize.TEXT, allowNull: true },
      allergens: { type: Sequelize.JSON, allowNull: true, defaultValue: '[]' },
      is_available: { type: Sequelize.BOOLEAN, defaultValue: true },
      is_visible: { type: Sequelize.BOOLEAN, defaultValue: true },
      display_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['display_order']);
    await queryInterface.addIndex('products', ['name_he']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};
