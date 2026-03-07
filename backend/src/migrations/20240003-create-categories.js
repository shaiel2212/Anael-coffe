'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      cafe_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'cafes', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      name_he: { type: Sequelize.STRING(255), allowNull: false },
      name_en: { type: Sequelize.STRING(255), allowNull: true },
      name_ru: { type: Sequelize.STRING(255), allowNull: true },
      display_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      is_visible: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('categories', ['cafe_id']);
    await queryInterface.addIndex('categories', ['display_order']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
