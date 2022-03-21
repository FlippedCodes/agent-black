const Sequelize = require("sequelize");

module.exports = sequelize.define("PunishmentLevel", {
	ID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	name: {
		type: Sequelize.TEXT("tiny"),
		allowNull: false,
	},
	command: {
		type: Sequelize.TEXT("tiny"),
		allowNull: false,
	},
	amount: Sequelize.INTEGER,
});
