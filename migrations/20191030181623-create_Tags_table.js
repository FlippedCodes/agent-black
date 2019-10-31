module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Tags', {
    tagID: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(15),
      allowNull: false,
      unique: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Tags'),
};
