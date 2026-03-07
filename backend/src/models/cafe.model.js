const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cafe = sequelize.define('Cafe', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  logo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  primary_color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#4A90E2',
  },
  default_language: {
    type: DataTypes.ENUM('he', 'en', 'ru'),
    defaultValue: 'he',
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'cafes',
});

module.exports = Cafe;
