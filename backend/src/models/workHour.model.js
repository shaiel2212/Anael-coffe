const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkHour = sequelize.define('WorkHour', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  clock_in: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  clock_out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  hours_worked: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'work_hours',
  paranoid: false,
});

module.exports = WorkHour;
