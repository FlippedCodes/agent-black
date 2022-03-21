const { messageSuccess } = require("../../functions_old/GLBLFUNC_messageSuccess.js");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

// adds a Warn to the warning table
async function addWarn(Warn, serverID, userID, reason) {
	await Warn.create({ userID, serverID, reason })
		.catch(err => {
			if (err) throw err;
		});
}

module.exports.run = async (interaction, warnMessage, Warn, checkforInfectedGuilds) => {
	// get information
	const userID = interaction.options.getUser("user", true).id;
	// add warn
	await addWarn(Warn, interaction.guild.id, userID, warnMessage);
	messageSuccess(interaction, `The user with the ID \`${userID}\` got a new warning added.\n Warning other servers.`);
	checkforInfectedGuilds(interaction.guild, userID, warnMessage);
};

module.exports.data = { subcommand: true };
