module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ParticipatingServers', {
    serverID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      unique: true,
    },
    logChannelID: Sequelize.STRING(30),
    serverName: Sequelize.TEXT('tiny'),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      banTagUnique: {
        fields: ['serverID', 'logChannelID'],
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ParticipatingServers'),
};
