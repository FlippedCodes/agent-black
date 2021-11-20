const Sequelize = require('sequelize');

module.exports.run = () => {
  console.log('[DB] Connecting...');

  const sequelize = new Sequelize(
    process.env.DBdatabase,
    process.env.DBusername,
    process.env.DBpassword,
    {
      host: process.env.DBhost,
      dialect: 'mysql',
      logging: DEBUG,
    },
  );
  console.log('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
