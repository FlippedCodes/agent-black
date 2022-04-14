const Sequelize = require('sequelize');

module.exports.run = () => {
  console.log('[DB] Connecting...');

  const sequelize = new Sequelize(
    process.env.DBName,
    process.env.DBUsername,
    process.env.DBPassword,
    {
      host: process.env.DBHost,
      dialect: 'mysql',
      logging: DEBUG ? console.log : false,
    },
  );
  sequelize.query('SET NAMES utf8mb4;');
  console.log('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
