const sequelize = require('../config/database');
const Cafe = require('./cafe.model');
const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const InventoryItem = require('./inventoryItem.model');
const InventoryTransaction = require('./inventoryTransaction.model');
const Employee = require('./employee.model');
const WorkHour = require('./workHour.model');
const FinancialRecord = require('./financialRecord.model');

// Cafe associations
Cafe.hasMany(User, { foreignKey: 'cafe_id', as: 'users' });
Cafe.hasMany(Category, { foreignKey: 'cafe_id', as: 'categories' });
Cafe.hasMany(InventoryItem, { foreignKey: 'cafe_id', as: 'inventoryItems' });
Cafe.hasMany(Employee, { foreignKey: 'cafe_id', as: 'employees' });
Cafe.hasMany(FinancialRecord, { foreignKey: 'cafe_id', as: 'financialRecords' });

// User associations
User.belongsTo(Cafe, { foreignKey: 'cafe_id', as: 'cafe' });

// Category associations
Category.belongsTo(Cafe, { foreignKey: 'cafe_id', as: 'cafe' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

// Product associations
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Inventory associations
InventoryItem.belongsTo(Cafe, { foreignKey: 'cafe_id', as: 'cafe' });
InventoryItem.hasMany(InventoryTransaction, { foreignKey: 'inventory_item_id', as: 'transactions' });
InventoryTransaction.belongsTo(InventoryItem, { foreignKey: 'inventory_item_id', as: 'item' });
InventoryTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Employee associations
Employee.belongsTo(Cafe, { foreignKey: 'cafe_id', as: 'cafe' });
Employee.hasMany(WorkHour, { foreignKey: 'employee_id', as: 'workHours' });
WorkHour.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Financial associations
FinancialRecord.belongsTo(Cafe, { foreignKey: 'cafe_id', as: 'cafe' });
FinancialRecord.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  Cafe,
  User,
  Category,
  Product,
  InventoryItem,
  InventoryTransaction,
  Employee,
  WorkHour,
  FinancialRecord,
};
