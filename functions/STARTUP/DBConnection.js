const Sequelize = require('sequelize');

module.exports.run = () => {
  console.log('[DB] Connecting...');

  const sequelize = new Sequelize(
    process.env.DBdatabase,
    process.env.DBusername,
    process.env.DBpassword,
    {
      host: process.env.DBhost || 'db-aB',
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
