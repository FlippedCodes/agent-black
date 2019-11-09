module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ParticipatingServers', {
    serverID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      unique: true,
    },
    logChannelID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    teamRoleID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    serverName: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ParticipatingServers'),
};
