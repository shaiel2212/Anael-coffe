const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_id: {
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
  description_he: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_ru: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  allergens: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'products',
});

module.exports = Product;
