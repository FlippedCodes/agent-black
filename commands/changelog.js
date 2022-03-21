const { messageFail } = require("../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../functions_old/GLBLFUNC_messageSuccess.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports.run = async (client, interaction) => {
	fs.readFile(config.commands.changelog.text, "utf8", (err, body) => {
		if (err) {
			if (err) throw err;
			messageFail(client, interaction, "Something went wrong, try again another time!");
			return;
		}
		messageSuccess(interaction, body, null, true);
	});
};

module.exports.data = new SlashCommandBuilder()
	.setName("changelog")
	.setDescription("Displays information about the most recent bot changes and what's to come.");
