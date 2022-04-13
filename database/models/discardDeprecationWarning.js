const Sequelize = require('sequelize');

module.exports = sequelize.define('discardDeprecationWarning', {
  userID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
});
