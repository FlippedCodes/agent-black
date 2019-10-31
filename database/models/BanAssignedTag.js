const Sequelize = require('sequelize');

module.exports = sequelize.define('BanAssignedTag', {
  banID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: 'Bans',
      key: 'banID',
    },
  },
  tagID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: 'Tags',
      key: 'tagID',
    },
  },
},
{
  uniqueKeys: {
    banTagUnique: {
      fields: ['banID', 'tagID'],
    },
  },
});
