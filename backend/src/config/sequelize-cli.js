require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const base = {
  dialect: 'mysql',
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
  },
};

// Railway provides MYSQL_URL - parse it for sequelize-cli
const getMysqlConfig = () => {
  if (process.env.MYSQL_URL) {
    return { ...base, url: process.env.MYSQL_URL };
  }
  return {
    ...base,
    username: process.env.DB_USER || 'cafe_user',
    password: process.env.DB_PASSWORD || 'cafe_password',
    database: process.env.DB_NAME || 'cafe_management',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
  };
};

module.exports = {
  development: getMysqlConfig(),
  test: {
    ...base,
    username: process.env.DB_USER || 'cafe_user',
    password: process.env.DB_PASSWORD || 'cafe_password',
    database: process.env.DB_NAME_TEST || 'cafe_management_test',
    host: process.env.DB_HOST || '127.0.0.1',
  },
  production: getMysqlConfig(),
};
