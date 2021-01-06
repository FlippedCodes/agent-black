module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserIDAssociations', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    userTag: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      uniqueUserTagID: {
        fields: ['userTag', 'userID'],
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserIDAssociations'),
};
