const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cafe_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name_he: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  name_ru: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'categories',
});

module.exports = Category;
