const Sequelize = require('sequelize');

const testToken = '../config/config.json';

const config = require('../config/main.json');

module.exports.run = () => {
  console.log('[DB] Connecting...');
  let database;
  let user;
  let password;
  let host;
  if (config.env.get('inDev')) {
    const DBCredentials = require(testToken).development;
    database = DBCredentials.database;
    user = DBCredentials.username;
    password = DBCredentials.password;
    host = DBCredentials.host;
  } else {
    database = process.env.DBNameAgentBlack;
    user = process.env.DBNameAgentBlack;
    password = process.env.DBPasswAgentBlack;
    host = process.env.DBHost;
  }
  const sequelize = new Sequelize(
    database, user, password, { host, dialect: 'mysql', logging: config.env.get('inDev') },
  );
  sequelize.query('SET NAMES utf8mb4;');
  console.log('[DB] Connected!');

  // DEPRECATED: gets passed along outside of run function
  // module.exports = module.exports.help;

  global.sequelize = sequelize;
};

module.exports.help = {
  name: 'STARTUP_DBConnection',
};
