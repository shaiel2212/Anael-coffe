const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Railway provides MYSQL_URL or individual vars
const sequelize = process.env.MYSQL_URL
  ? new Sequelize(process.env.MYSQL_URL, {
      dialect: 'mysql',
      logging: (msg) => logger.debug(msg),
      dialectOptions: { ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false },
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      define: { underscored: true, timestamps: true, paranoid: true },
    })
  : new Sequelize(
      process.env.DB_NAME || 'cafe_management',
      process.env.DB_USER || 'cafe_user',
      process.env.DB_PASSWORD || 'cafe_password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        logging: (msg) => logger.debug(msg),
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
        define: { underscored: true, timestamps: true, paranoid: true },
      }
    );

module.exports = sequelize;
