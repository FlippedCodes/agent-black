module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('TeamRoles', {
    serverID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      references: {
        model: 'ParticipatingServers',
        key: 'serverID',
      },
    },
    roleID: {
      type: Sequelize.STRING(30),
      unique: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      uniqueTeamRole: {
        fields: ['serverID', 'roleID'],
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('TeamRoles'),
};
