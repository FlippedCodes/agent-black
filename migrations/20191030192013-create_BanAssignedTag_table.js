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
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('BanAssignedTags'),
};
