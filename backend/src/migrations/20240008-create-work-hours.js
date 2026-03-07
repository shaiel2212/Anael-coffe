'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_hours', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      employee_id: { type: Sequelize.UUID, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      clock_in: { type: Sequelize.TIME, allowNull: false },
      clock_out: { type: Sequelize.TIME, allowNull: true },
      hours_worked: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('work_hours', ['employee_id']);
    await queryInterface.addIndex('work_hours', ['date']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('work_hours');
  },
};
