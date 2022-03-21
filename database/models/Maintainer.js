const Sequelize = require("sequelize");

module.exports = sequelize.define("Maintainer", {
	userID: {
		type: Sequelize.STRING(30),
		primaryKey: true,
		unique: true,
	},
});
