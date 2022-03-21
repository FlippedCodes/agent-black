const { messageFail } = require("../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../functions_old/GLBLFUNC_messageSuccess.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

const clean = (text) => {
	if (typeof (text) === "string") {
		return text.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(process.env.DCtoken, "****NOPE****")
			.replace(process.env.DBpassword, "****NOPE****")
			.replace(process.env.DBhost, "****NOPE****")
			.replace(process.env.DBusername, "****NOPE****");
	}
	return text;
};

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
module.exports.run = async (client, interaction) => {
	// check owner permissions
	if (interaction.user.id !== "172031697355800577") return messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``, null, false);
	const code = interaction.options.getString("codeline", true);
	try {
		let evaled = eval(code);

		if (typeof evaled !== "string") { evaled = require("util").inspect(evaled); }

		messageSuccess(interaction, `\`\`\`xl\n${clean(evaled)}\n\`\`\``, null, true);
	} catch (err) { messageFail(client, interaction, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``); }
};

module.exports.data = new SlashCommandBuilder()
	.setName("eval")
	.setDescription("Command used to run snippets of code. [OWNER ONLY].")
	.addStringOption((option) => option.setName("codeline").setDescription("Commandline to execute").setRequired(true));
