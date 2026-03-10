'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query("SHOW TABLES LIKE 'users'");
    const tableExists = Array.isArray(rows) && rows.length > 0;
    if (!tableExists) {
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
    }
    const addIndexIfMissing = async (table, fields, name) => {
      try {
        await queryInterface.addIndex(table, fields, { name });
      } catch (err) {
        if (err.original?.code !== 'ER_DUP_KEYNAME' && err.message?.indexOf('Duplicate') === -1) throw err;
      }
    };
    await addIndexIfMissing('users', ['cafe_id'], 'users_cafe_id');
    await addIndexIfMissing('users', ['email'], 'users_email');
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
