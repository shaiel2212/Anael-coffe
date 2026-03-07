require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    username: process.env.DB_USER || 'cafe_user',
    password: process.env.DB_PASSWORD || 'cafe_password',
    database: process.env.DB_NAME || 'cafe_management',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  },
  test: {
    username: process.env.DB_USER || 'cafe_user',
    password: process.env.DB_PASSWORD || 'cafe_password',
    database: process.env.DB_NAME_TEST || 'cafe_management_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  },
};
