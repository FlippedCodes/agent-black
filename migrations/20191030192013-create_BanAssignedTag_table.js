module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BanAssignedTags', {
    banID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    tagID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
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
