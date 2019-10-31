module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BanAssignedTags', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      banTagUnique: {
        fields: ['banID', 'tagID'],
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('BanAssignedTags'),
};
