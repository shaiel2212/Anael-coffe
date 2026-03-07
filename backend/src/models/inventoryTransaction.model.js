const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryTransaction = sequelize.define('InventoryTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  inventory_item_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('in', 'out', 'adjustment'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  quantity_before: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  quantity_after: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'inventory_transactions',
  paranoid: false,
});

module.exports = InventoryTransaction;
